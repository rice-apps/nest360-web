// The search failure experience on the real /resources and /stories pages, in a browser: a failed search shows
// the error message (not "no results"), and Try again brings the results back once the problem is resolved.
//
// Failures are simulated with the development-only cookie in lib/simulatedFailure.ts, so no database is stopped
// or changed: the test only reads pages. It needs the dev server running (npm run dev); the cookie is ignored by
// production builds, so it can't run against the deployed site.
//
//   npm run dev                       (in another terminal)
//   npm run test:search-failure:browser       (BASE_URL=http://localhost:3001 to use another address)
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'

import { SIMULATE_FAILURE_COOKIE, type SimulatedFailure } from '../lib/searchLoaders'

const BASE_URL = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const WAIT = 20_000 // dev builds compile pages on first visit, so allow time

let failures = 0
async function it(name: string, run: () => Promise<void>) {
  try {
    await run()
    console.log(`  ✓ ${name}`)
  } catch (error) {
    failures++
    const message = String(error instanceof Error ? error.message : error).split('\n').slice(0, 6).join('\n    ')
    console.log(`  ✗ ${name}\n    ${message}`)
  }
}
function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

// Each page: where it is, a search term, how to read its results, and its "nothing matched" wording
const PAGES = [
  {
    name: '/resources',
    path: '/resources',
    term: 'cpap',
    results: 'article h3',
    emptyText: /No resources (match|have been published)/,
  },
  {
    name: '/stories',
    path: '/stories',
    term: 'newborn',
    results: 'li a h2',
    emptyText: /No stories (yet|match)/,
  },
] as const

type PageSpec = (typeof PAGES)[number]

async function launch(): Promise<Browser> {
  try {
    return await chromium.launch()
  } catch {
    try {
      return await chromium.launch({ channel: 'chrome' }) // the installed Google Chrome
    } catch {
      throw new Error('No browser found. Run `npx playwright install chromium` once, then try again.')
    }
  }
}

async function simulate(context: BrowserContext, mode: SimulatedFailure | null) {
  await context.clearCookies({ name: SIMULATE_FAILURE_COOKIE })
  if (mode) await context.addCookies([{ name: SIMULATE_FAILURE_COOKIE, value: mode, url: BASE_URL }])
}

// What the visitor sees in the results area: the card titles, or else the empty-state message
async function shownResults(page: Page, spec: PageSpec) {
  const titles = (await page.locator(spec.results).allInnerTexts()).map((title) => title.trim())
  if (titles.length) return `cards: ${titles.join(' | ')}`
  const empty = await page.getByText(spec.emptyText).first().innerText({ timeout: 2000 }).catch(() => '')
  return empty ? `empty: ${empty}` : 'nothing'
}

const errorPanel = (page: Page) => page.getByRole('alert').filter({ hasText: /couldn.t load/i })

async function expectError(page: Page, spec: PageSpec, query: string) {
  await errorPanel(page).waitFor({ timeout: WAIT }).catch(() => {
    throw new Error(
      'No error message appeared. Is the server running in development (npm run dev)? ' +
        'Production builds ignore the failure cookie.',
    )
  })
  check(!(await page.getByText(spec.emptyText).isVisible()), 'shows a "nothing matched" message as well as the error')
  check(
    (await page.locator(spec.results).count()) === 0,
    'shows result cards alongside the error',
  )
  const box = page.getByRole('searchbox')
  check((await box.inputValue()) === query, `the search box lost the search text (has "${await box.inputValue()}")`)
  const retry = page.getByRole('link', { name: 'Try again' })
  const href = (await retry.getAttribute('href')) ?? ''
  check(!query || href.includes(`q=${encodeURIComponent(query)}`), `Try again doesn't keep the search (href "${href}")`)
}

async function retryAndExpect(page: Page, spec: PageSpec, expected: string, url: string) {
  await page.getByRole('link', { name: 'Try again' }).click()
  await errorPanel(page).waitFor({ state: 'detached', timeout: WAIT })
  await page.waitForLoadState('networkidle')
  const shown = await shownResults(page, spec)
  check(shown === expected, `after Try again the page shows\n  ${shown}\nbut before the failure it showed\n  ${expected}`)
  check(page.url() === url, `Try again changed the address to ${page.url()}`)
}

const response = await fetch(`${BASE_URL}/resources`).catch(() => null)
if (!response) {
  console.log(`Nothing answers at ${BASE_URL}. Start the dev server (npm run dev) first, or set BASE_URL.`)
  process.exit(1)
}

const browser = await launch()
try {
  for (const spec of PAGES) {
    console.log(`\n${spec.name}`)
    const context = await browser.newContext()
    const page = await context.newPage()
    const searchUrl = `${BASE_URL}${spec.path}?q=${encodeURIComponent(spec.term)}`

    // What the page shows when everything works, to compare against after recovering
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: WAIT * 3 })
    const normalSearch = await shownResults(page, spec)
    await page.goto(`${BASE_URL}${spec.path}`, { waitUntil: 'networkidle', timeout: WAIT * 3 })
    const normalList = await shownResults(page, spec)

    await it(`loads normally (search "${spec.term}" shows ${normalSearch.startsWith('cards') ? 'results' : 'the empty message'})`, async () => {
      check(!(await errorPanel(page).isVisible()), 'shows the error with nothing failing')
      check(normalList !== 'nothing', 'shows neither results nor an empty message')
    })

    await it('shows the error, not "no results", when the search index is down', async () => {
      await simulate(context, 'search')
      await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: WAIT * 3 })
      await expectError(page, spec, spec.term)
    })

    await it('Try again brings the same results back once the search index is up again', async () => {
      await simulate(context, null)
      await retryAndExpect(page, spec, normalSearch, searchUrl)
    })

    await it('Try again while it is still down keeps showing the error', async () => {
      await simulate(context, 'search')
      await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: WAIT * 3 })
      await page.getByRole('link', { name: 'Try again' }).click()
      await page.waitForLoadState('networkidle')
      await expectError(page, spec, spec.term)
      await simulate(context, null)
    })

    await it('typing a search while the search index is down shows the error', async () => {
      await simulate(context, 'search')
      await page.goto(`${BASE_URL}${spec.path}`, { waitUntil: 'networkidle', timeout: WAIT * 3 })
      check(!(await errorPanel(page).isVisible()), 'the full list should still load without searching')
      await page.getByRole('searchbox').fill(spec.term)
      await page.waitForURL((url) => url.searchParams.get('q') === spec.term, { timeout: WAIT })
      await expectError(page, spec, spec.term)
      await simulate(context, null)
      await retryAndExpect(page, spec, normalSearch, searchUrl)
    })

    await it('shows the error when the database is down, and recovers', async () => {
      await simulate(context, 'database')
      await page.goto(`${BASE_URL}${spec.path}`, { waitUntil: 'networkidle', timeout: WAIT * 3 })
      await expectError(page, spec, '')
      await simulate(context, null)
      await retryAndExpect(page, spec, normalList, `${BASE_URL}${spec.path}`)
    })

    await context.close()
  }
} finally {
  await browser.close()
}

console.log(failures ? `\n${failures} test(s) failed` : '\nAll browser search failure tests passed')
process.exit(failures ? 1 : 0)
