// Loading the data behind the two search pages, /resources and /stories, so that a failure shows the visitor an
// error they can retry instead of a broken page or a misleading "nothing matched".
//
// Each loader returns { ok: true, data } or { ok: false, failure }. A failure is either:
// - 'unavailable': the database or the search index (which lives in the same database) threw an error
// - 'timeout': no answer within SEARCH_TIMEOUT_MS, e.g. a database that's unreachable without refusing the
//   connection, which would otherwise leave the page loading forever
//
// The loaders take the data functions as arguments (deps) instead of importing them, so tests can pass fakes
// that fail on purpose (tests/search-failure.test.ts). This file imports nothing from Payload or Next.js.

export type SearchFailure = 'unavailable' | 'timeout'
export type LoadResult<T> = { ok: true; data: T } | { ok: false; failure: SearchFailure }

// How long a search page waits for its data before showing the error
export const SEARCH_TIMEOUT_MS = 10_000

// The development-only switch for trying the error state (see lib/simulatedFailure.ts). Its value says what
// fails: 'search' (only the search index) or 'database' (everything).
export const SIMULATE_FAILURE_COOKIE = 'nest360-simulate-search-failure'
export type SimulatedFailure = 'search' | 'database'

// The part of lib/data/search.ts's search() the loaders use: it returns the slugs of the matching documents
export type SearchFn = (options: {
  query?: string
  tags?: string[]
  collections?: ('resources' | 'projects' | 'articles')[]
  limit?: number
}) => Promise<{ slug?: string | null }[]>

class TimeoutError extends Error {}

// Runs load(), giving up after timeoutMs. Errors are logged on the server (with `what` loaded) and turned into
// a failure result, never thrown, so the page can always render its error state.
export async function loadWithin<T>(what: string, load: () => Promise<T>, timeoutMs = SEARCH_TIMEOUT_MS): Promise<LoadResult<T>> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(`No answer after ${timeoutMs} ms`)), timeoutMs)
  })
  try {
    return { ok: true, data: await Promise.race([load(), timeout]) }
  } catch (error) {
    console.error(`Couldn't load ${what}`, error)
    return { ok: false, failure: error instanceof TimeoutError ? 'timeout' : 'unavailable' }
  } finally {
    clearTimeout(timer)
  }
}

// Makes the given data functions fail the way `mode` says: 'database' fails all of them, 'search' only `search`.
// With no mode they're returned as they are.
export function withSimulatedFailure<D extends { search: SearchFn }>(deps: D, mode: SimulatedFailure | null): D {
  if (!mode) return deps
  const fail = (what: string) => async () => {
    throw new Error(`Simulated failure (${what}), set by the ${SIMULATE_FAILURE_COOKIE} cookie`)
  }
  const failed = Object.fromEntries(
    Object.keys(deps).map((name) => [name, mode === 'database' || name === 'search' ? fail(name) : deps[name as keyof D]]),
  )
  // Same keys as deps, each still a function returning a promise, so it's still a D
  return failed as unknown as D
}

// /resources: published resources, narrowed to those the search index matches when there's a search term.
// The index covers each resource's title, text and tag names. No term means no search, just the full list.
export function loadResources<R extends { slug: string }>(
  { query }: { query: string },
  deps: { getResources: () => Promise<R[]>; search: SearchFn },
  timeoutMs?: number,
): Promise<LoadResult<R[]>> {
  return loadWithin(
    'resources',
    async () => {
      const [entries, matches] = await Promise.all([
        deps.getResources(),
        query ? deps.search({ query, collections: ['resources'], limit: 100 }) : null,
      ])
      if (!matches) return entries
      const slugs = new Set(matches.map((match) => match.slug))
      return entries.filter((entry) => slugs.has(entry.slug))
    },
    timeoutMs,
  )
}

// /stories: every published article (they also give the tag buttons), and the ones matching the search and tag.
// The search index only holds published articles and returns slugs; the cards come from the full list, so they
// keep its newest-first order.
export function loadStories<A extends { slug: string }>(
  { query, tag }: { query: string; tag: string },
  deps: { getPublishedArticles: () => Promise<A[]>; search: SearchFn },
  timeoutMs?: number,
): Promise<LoadResult<{ articles: A[]; shown: A[] }>> {
  return loadWithin(
    'stories',
    async () => {
      const articles = await deps.getPublishedArticles()
      if (!query && !tag) return { articles, shown: articles }
      const results = await deps.search({ query, tags: tag ? [tag] : [], collections: ['articles'], limit: 200 })
      const slugs = new Set(results.map((result) => result.slug))
      return { articles, shown: articles.filter((article) => slugs.has(article.slug)) }
    },
    timeoutMs,
  )
}
