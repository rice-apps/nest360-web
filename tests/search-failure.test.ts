// What /resources and /stories do when their data fails to load, tested with fake data functions, so no database
// is used or touched. The loaders are in lib/searchLoaders.ts; the pages show SearchError when they report a
// failure. The browser test (tests/search-failure.browser.ts) checks the same thing on the real pages.
//
//   npm run test:search
import assert from 'node:assert/strict'

import {
  loadResources,
  loadStories,
  withSimulatedFailure,
  type SearchFn,
} from '../lib/searchLoaders'

// A tiny runner: `payload run` (like the repo's other tests) finishes when this file's top-level code does, so each
// test is awaited in order here instead of being left to a separate test runner.
let failures = 0
async function describe(name: string, body: () => Promise<void>) {
  console.log(`\n${name}`)
  await body()
}
async function it(name: string, run: () => Promise<void>) {
  try {
    await run()
    console.log(`  ✓ ${name}`)
  } catch (error) {
    failures++
    const message = String(error instanceof Error ? error.message : error)
    console.log(`  ✗ ${name}\n    ${message.replace(/\n/g, '\n    ')}`)
  }
}

type Doc = { slug: string; title: string }

const resources: Doc[] = [
  { slug: 'cpap-job-aid', title: 'CPAP job aid' },
  { slug: 'phototherapy-guide', title: 'Phototherapy guide' },
]

// A working search that matches on the title, and failing or hanging stand-ins for a database or search index
const workingSearch: SearchFn = async ({ query = '' }) =>
  resources.filter((doc) => doc.title.toLowerCase().includes(query.toLowerCase()))
const down = async (): Promise<never> => {
  throw new Error('connect ECONNREFUSED 127.0.0.1:5432')
}
const hangs = () => new Promise<never>(() => {})

// The loaders log failures for the server logs; keep the test output readable while still checking they're logged
async function quietly<T>(run: () => Promise<T>): Promise<{ result: T; logged: unknown[][] }> {
  const original = console.error
  const logged: unknown[][] = []
  console.error = (...args: unknown[]) => logged.push(args)
  try {
    return { result: await run(), logged }
  } finally {
    console.error = original
  }
}

await describe('resource search (/resources)', async () => {
  await it('returns the matching resources when everything works', async () => {
    const result = await loadResources({ query: 'cpap' }, { getResources: async () => resources, search: workingSearch })
    assert.deepEqual(result, { ok: true, data: [resources[0]] })
  })

  await it('returns every resource, without searching, when there is no search term', async () => {
    let searched = false
    const result = await loadResources(
      { query: '' },
      { getResources: async () => resources, search: async () => ((searched = true), []) },
    )
    assert.deepEqual(result, { ok: true, data: resources })
    assert.equal(searched, false)
  })

  await it('reports the search index being down as a failure, not as "no results"', async () => {
    const { result, logged } = await quietly(() =>
      loadResources({ query: 'cpap' }, { getResources: async () => resources, search: down }),
    )
    assert.deepEqual(result, { ok: false, failure: 'unavailable' })
    assert.equal(logged.length, 1, 'the failure is logged for the server logs')
  })

  await it('reports the database being down as a failure', async () => {
    const { result } = await quietly(() => loadResources({ query: '' }, { getResources: down, search: workingSearch }))
    assert.deepEqual(result, { ok: false, failure: 'unavailable' })
  })

  await it('gives up on a database that never answers, instead of loading forever', async () => {
    const started = Date.now()
    const { result } = await quietly(() =>
      loadResources({ query: 'cpap' }, { getResources: hangs, search: workingSearch }, 50),
    )
    assert.deepEqual(result, { ok: false, failure: 'timeout' })
    assert.ok(Date.now() - started < 2000, 'returns soon after the time limit')
  })

  await it('works again on retry once the problem is resolved', async () => {
    let available = false
    const flakySearch: SearchFn = (options) => (available ? workingSearch(options) : down())
    const deps = { getResources: async () => resources, search: flakySearch }

    const { result: first } = await quietly(() => loadResources({ query: 'phototherapy' }, deps))
    assert.equal(first.ok, false)

    available = true // the search index comes back
    const retry = await loadResources({ query: 'phototherapy' }, deps)
    assert.deepEqual(retry, { ok: true, data: [resources[1]] })
  })
})

await describe('story search (/stories)', async () => {
  const articles = resources // same shape: a slug and a title
  const deps = { getPublishedArticles: async () => articles, search: workingSearch }

  await it('returns all stories and the matching ones when everything works', async () => {
    const result = await loadStories({ query: 'phototherapy', tag: '' }, deps)
    assert.deepEqual(result, { ok: true, data: { articles, shown: [articles[1]] } })
  })

  await it('reports the search index being down as a failure, not as "no stories match"', async () => {
    const { result } = await quietly(() =>
      loadStories({ query: 'cpap', tag: '' }, { ...deps, search: down }),
    )
    assert.deepEqual(result, { ok: false, failure: 'unavailable' })
  })

  await it('reports a failed tag filter (which also uses the search index) as a failure', async () => {
    const { result } = await quietly(() => loadStories({ query: '', tag: 'kenya' }, { ...deps, search: down }))
    assert.deepEqual(result, { ok: false, failure: 'unavailable' })
  })

  await it('gives up on a search index that never answers', async () => {
    const { result } = await quietly(() => loadStories({ query: 'cpap', tag: '' }, { ...deps, search: hangs }, 50))
    assert.deepEqual(result, { ok: false, failure: 'timeout' })
  })
})

await describe('simulated failures (the development-only cookie)', async () => {
  const deps = { getResources: async () => resources, search: workingSearch }

  await it('changes nothing when no failure is simulated', async () => {
    assert.equal(withSimulatedFailure(deps, null), deps)
  })

  await it('"search" fails only the search index: the full list still loads, a search fails', async () => {
    const failing = withSimulatedFailure(deps, 'search')
    assert.deepEqual(await failing.getResources(), resources)
    await assert.rejects(failing.search({ query: 'cpap' }), /Simulated failure/)

    const { result: listing } = await quietly(() => loadResources({ query: '' }, failing))
    assert.equal(listing.ok, true, 'no search term, so nothing touches the search index')
    const { result: searching } = await quietly(() => loadResources({ query: 'cpap' }, failing))
    assert.deepEqual(searching, { ok: false, failure: 'unavailable' })
  })

  await it('"database" fails everything', async () => {
    const failing = withSimulatedFailure(deps, 'database')
    await assert.rejects(failing.getResources(), /Simulated failure/)
    const { result } = await quietly(() => loadResources({ query: '' }, failing))
    assert.deepEqual(result, { ok: false, failure: 'unavailable' })
  })
})

console.log(failures ? `\n${failures} test(s) failed` : '\nAll search failure tests passed')
// payload run doesn't pass on process.exitCode, so exit explicitly for npm (and anyone scripting it) to see it
process.exit(failures ? 1 : 0)
