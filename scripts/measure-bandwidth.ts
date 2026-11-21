// Measures how much data the site's pages download, so the numbers can be compared over time.
//
//   npm run measure:bandwidth                      build the site, start it, measure, stop it
//   npm run measure:bandwidth -- --skip-build      reuse the last build (faster)
//   npm run measure:bandwidth -- --url=https://…   measure a site that is already running
//   npm run measure:bandwidth -- --help            every option
//
// It measures three pages: the resource gallery (/resources), one project page and one article page. The
// project and article are found on the site each time (the most recently updated project, from the site's
// /api/projects, and the first card on /stories), so the script keeps working as content is added or removed.
// --project and --article choose specific pages instead.
//
// Each page is loaded three times in a fresh headless Chrome:
//   1. First visit: empty cache, full speed. Then the script scrolls to the bottom, so pictures that only
//      load when scrolled into view are counted too.
//   2. Repeat visit: the same page again with the cache from visit 1, as for a returning visitor.
//   3. Slow connections: empty cache, throttled like Chrome DevTools' "Slow 4G", then again like its "3G".
//      Screenshots at 2 s, 5 s, 10 s and when loading finished show what a visitor sees while waiting.
//
// The report (Markdown, JSON and screenshots) goes to bandwidth-reports/<date>/. See docs/bandwidth-testing.md.
// Runs directly with Node (no build step); Node removes the TypeScript types itself.

import { spawn, execFileSync, type ChildProcess } from 'node:child_process';
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { connect, createServer } from 'node:net';
import path from 'node:path';
import { parseArgs, parseEnv } from 'node:util';

import { chromium, devices, type Browser, type BrowserContextOptions, type CDPSession, type Page } from 'playwright';

const ROOT = path.resolve(import.meta.dirname, '..');
const NEXT_BIN = path.join(ROOT, 'node_modules', 'next', 'dist', 'bin', 'next');

// Throttling values. The same numbers Chrome DevTools uses for its presets of these names.
const CONNECTIONS = {
  'slow-4g': { label: 'Slow 4G', latencyMs: 562.5, downloadKbps: 1440, uploadKbps: 675 },
  '3g': { label: '3G', latencyMs: 2000, downloadKbps: 400, uploadKbps: 400 },
} as const;
type Connection = (typeof CONNECTIONS)[keyof typeof CONNECTIONS];
// Every run tests each of these, slowest last
const SLOW_CONNECTIONS: Connection[] = Object.values(CONNECTIONS);

// Times (after the page starts loading) of the screenshots on the slow connections
const SCREENSHOT_TIMES_MS = [2000, 5000, 10_000];
// A page counts as finished when no request has been open for this long
const QUIET_MS = 1500;

const HELP = `Measures how much data /resources, one project page and one article page download.

Usage: npm run measure:bandwidth -- [options]

  --skip-build          Use the last build in .next instead of building again
  --url=<address>       Measure a site that is already running (no build, no server)
                        e.g. --url=http://localhost:3000 or --url=https://nest360-web.vercel.app
  --project=<path>      Project page to measure, e.g. --project=/resources/clinical-job-aids
  --article=<path>      Article page to measure, e.g. --article=/stories/my-story
  --desktop             Use a desktop-sized window instead of a phone
  --help                Show this text

Guide: docs/bandwidth-testing.md`;

// ---------------------------------------------------------------------------------------------------------
// Types

type Phase = 'load' | 'scroll';

interface RequestRecord {
  url: string;
  type: string; // Chrome's resource type: Document, Script, Image, Font, Stylesheet, Fetch, …
  status: number | null;
  bytes: number; // bytes transferred over the network (compressed, with headers), as DevTools shows
  fromCache: boolean;
  failed: string | null;
  phase: Phase; // while loading, or only after scrolling down
}

interface Timings {
  firstPaintMs: number | null; // first text or picture appears
  largestPaintMs: number | null; // the biggest text block or picture appears
  loadedMs: number | null; // the browser's "load" event: the page and its first files are done
}

interface Visit {
  status: number | null;
  timings: Timings;
  requests: RequestRecord[];
  screenshots: { label: string; file: string }[];
}

interface PageResult {
  name: string;
  path: string;
  firstVisit: Visit;
  repeatVisit: Visit;
  slowVisits: { connection: Connection; visit: Visit }[]; // one per SLOW_CONNECTIONS entry
}

// ---------------------------------------------------------------------------------------------------------
// Network recording through the Chrome DevTools Protocol (the same data DevTools' Network tab shows)

function recordNetwork(cdp: CDPSession) {
  const open = new Map<string, RequestRecord>();
  let finished: RequestRecord[] = [];
  let phase: Phase = 'load';
  let lastActivity = Date.now();
  const touch = () => (lastActivity = Date.now());

  const finish = (id: string, update: Partial<RequestRecord>) => {
    const record = open.get(id);
    if (!record) return;
    Object.assign(record, update);
    finished.push(record);
    open.delete(id);
  };

  cdp.on('Network.requestWillBeSent', (event) => {
    touch();
    // A redirect reuses the request id: the first hop is finished. Chrome also makes "Internal Redirect"s of
    // its own (no network involved, e.g. trying https first), which aren't counted.
    if (event.redirectResponse?.statusText === 'Internal Redirect') {
      open.delete(event.requestId);
    } else if (event.redirectResponse) {
      finish(event.requestId, { status: event.redirectResponse.status, bytes: event.redirectResponse.encodedDataLength });
    }
    if (event.request.url.startsWith('data:')) return;
    open.set(event.requestId, {
      url: event.request.url,
      type: event.type ?? 'Other',
      status: null,
      bytes: 0,
      fromCache: false,
      failed: null,
      phase,
    });
  });
  cdp.on('Network.requestServedFromCache', (event) => {
    const record = open.get(event.requestId);
    if (record) record.fromCache = true;
  });
  cdp.on('Network.responseReceived', (event) => {
    touch();
    const record = open.get(event.requestId);
    if (!record) return;
    record.status = event.response.status;
    if (event.response.fromDiskCache || event.response.fromServiceWorker || event.response.fromPrefetchCache) {
      record.fromCache = true;
    }
  });
  cdp.on('Network.loadingFinished', (event) => {
    touch();
    finish(event.requestId, { bytes: event.encodedDataLength });
  });
  cdp.on('Network.loadingFailed', (event) => {
    touch();
    finish(event.requestId, { failed: event.canceled ? 'canceled' : event.errorText });
  });

  return {
    reset() {
      open.clear();
      finished = [];
      phase = 'load';
      touch();
    },
    setPhase(next: Phase) {
      phase = next;
    },
    records(): RequestRecord[] {
      return [...finished, ...open.values()];
    },
    // Waits until no request has been open for QUIET_MS (or gives up after maxMs)
    async waitUntilQuiet(maxMs: number) {
      const end = Date.now() + maxMs;
      while (Date.now() < end) {
        if (open.size === 0 && Date.now() - lastActivity >= QUIET_MS) return;
        await sleep(200);
      }
    },
  };
}

type Recorder = ReturnType<typeof recordNetwork>;

async function setConnection(cdp: CDPSession, connection: Connection | null) {
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: connection?.latencyMs ?? 0,
    // bytes per second; -1 means no limit
    downloadThroughput: connection ? (connection.downloadKbps * 1000) / 8 : -1,
    uploadThroughput: connection ? (connection.uploadKbps * 1000) / 8 : -1,
  });
}

// ---------------------------------------------------------------------------------------------------------
// Visiting a page

// Collects the largest contentful paint, which the page can only report while it loads
const LCP_SCRIPT = `
  window.__lcp = 0;
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__lcp = entry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {}
`;

async function readTimings(page: Page): Promise<Timings> {
  return page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const paint = performance.getEntriesByName('first-contentful-paint')[0];
    const lcp = (window as unknown as { __lcp?: number }).__lcp;
    return {
      firstPaintMs: paint ? Math.round(paint.startTime) : null,
      largestPaintMs: lcp ? Math.round(lcp) : null,
      loadedMs: nav && nav.loadEventEnd > 0 ? Math.round(nav.loadEventEnd) : null,
    };
  });
}

async function scrollToBottom(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
}

interface VisitOptions {
  connection: Connection | null;
  scroll: boolean;
  screenshotPrefix: string | null; // file name start for the screenshots, or null for none
  outDir: string;
}

async function visit(page: Page, cdp: CDPSession, recorder: Recorder, url: string, options: VisitOptions): Promise<Visit> {
  recorder.reset();
  await setConnection(cdp, options.connection);
  const maxMs = options.connection ? 180_000 : 60_000;
  const screenshots: Visit['screenshots'] = [];
  const shoot = async (label: string, suffix: string) => {
    if (!options.screenshotPrefix) return;
    const file = `${options.screenshotPrefix}-${suffix}.png`;
    await page.screenshot({ path: path.join(options.outDir, file) }).catch(() => {});
    screenshots.push({ label, file });
  };

  const started = Date.now();
  let loaded = false;
  const navigation = page.goto(url, { waitUntil: 'load', timeout: maxMs }).finally(() => (loaded = true));
  navigation.catch(() => {}); // handled below; stops an "unhandled rejection" while taking screenshots
  if (options.screenshotPrefix) {
    for (const at of SCREENSHOT_TIMES_MS) {
      await sleep(Math.max(0, started + at - Date.now()));
      if (loaded) break;
      await shoot(`after ${at / 1000} s`, `${at / 1000}s`);
    }
  }
  const response = await navigation;
  await recorder.waitUntilQuiet(maxMs);
  const timings = await readTimings(page);
  await shoot('loading finished', 'loaded');

  if (options.scroll) {
    recorder.setPhase('scroll');
    await scrollToBottom(page);
    await recorder.waitUntilQuiet(maxMs);
  }

  return { status: response?.status() ?? null, timings, requests: recorder.records(), screenshots };
}

async function measurePage(
  browser: Browser,
  contextOptions: BrowserContextOptions,
  base: string,
  name: string,
  pagePath: string,
  outDir: string,
  progress: Progress,
): Promise<PageResult> {
  const url = new URL(pagePath, base).toString();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const open = async () => {
    // A new browser context starts with an empty cache, like a first-time visitor
    const context = await browser.newContext(contextOptions);
    await context.addInitScript(LCP_SCRIPT);
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    return { context, page, cdp, recorder: recordNetwork(cdp) };
  };

  // 1 and 2: first visit, then a repeat visit with the cache the first visit filled
  progress.next(`Measuring ${name}: first visit`, STEP_SECONDS.firstVisit);
  const fast = await open();
  const firstVisit = await visit(fast.page, fast.cdp, fast.recorder, url, {
    connection: null,
    scroll: true,
    screenshotPrefix: null,
    outDir,
  });
  progress.next(`Measuring ${name}: repeat visit`, STEP_SECONDS.repeatVisit);
  const repeatVisit = await visit(fast.page, fast.cdp, fast.recorder, url, {
    connection: null,
    scroll: false,
    screenshotPrefix: null,
    outDir,
  });
  await fast.context.close();

  // 3: a first visit on each slow connection
  const slowVisits: PageResult['slowVisits'] = [];
  for (const connection of SLOW_CONNECTIONS) {
    progress.next(`Measuring ${name}: ${connection.label}`, STEP_SECONDS[connection.label]);
    const slow = await open();
    const slowVisit = await visit(slow.page, slow.cdp, slow.recorder, url, {
      connection,
      scroll: false,
      screenshotPrefix: `${slug}-${connection.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      outDir,
    });
    await slow.context.close();
    slowVisits.push({ connection, visit: slowVisit });
  }

  return { name, path: pagePath, firstVisit, repeatVisit, slowVisits };
}

// ---------------------------------------------------------------------------------------------------------
// Finding the pages to measure

interface Discovered {
  projectPath: string | null;
  articlePath: string | null;
  resourcesShown: string | null; // the gallery's own count, e.g. "11 resources found"
  projectCount: number;
  articleCount: number;
}

// Paths of the links on a page that are on the same site and match the pattern, in page order
async function linksOn(page: Page, pattern: RegExp): Promise<string[]> {
  const paths = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')]
      .map((a) => new URL((a as HTMLAnchorElement).href))
      .filter((u) => u.origin === location.origin)
      .map((u) => u.pathname),
  );
  return [...new Set(paths.filter((p) => pattern.test(p)))];
}

// The most recently updated project and how many there are, from Payload's REST API. Projects are public
// (collections/Projects.ts), and since #32 no page links to them, so they can't be found from the pages.
async function projectsFromApi(base: string): Promise<{ path: string | null; count: number } | null> {
  try {
    const response = await fetch(new URL('/api/projects?limit=1&depth=0&sort=-updatedAt', base));
    if (!response.ok) return null;
    const data = (await response.json()) as { docs?: { slug?: string | null }[]; totalDocs?: number };
    const slug = data.docs?.[0]?.slug;
    return { path: slug ? `/resources/${encodeURIComponent(slug)}` : null, count: data.totalDocs ?? 0 };
  } catch {
    return null;
  }
}

async function discover(browser: Browser, base: string): Promise<Discovered> {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    const gallery = await page.goto(new URL('/resources', base).toString(), { waitUntil: 'load', timeout: 60_000 });
    if (!gallery?.ok()) throw new Error(`/resources answered with status ${gallery?.status() ?? 'none'}.`);
    const linkedProjects = await linksOn(page, /^\/resources\/[^/]+$/);
    // The gallery's own count, e.g. "16 resources" (or "11 resources found" on older versions)
    const shownText = await page
      .locator('text=/^\\s*\\d+ resources?\\b/')
      .first()
      .textContent({ timeout: 2000 })
      .catch(() => null);
    const fromApi = await projectsFromApi(base);

    const stories = await page.goto(new URL('/stories', base).toString(), { waitUntil: 'load', timeout: 60_000 });
    if (!stories?.ok()) throw new Error(`/stories answered with status ${stories?.status() ?? 'none'}.`);
    const articles = await linksOn(page, /^\/stories\/[^/]+$/);

    return {
      projectPath: fromApi?.path ?? linkedProjects[0] ?? null,
      articlePath: articles[0] ?? null,
      resourcesShown: shownText?.replace(/\s+/g, ' ').trim() ?? null,
      projectCount: fromApi?.count ?? linkedProjects.length,
      articleCount: articles.length,
    };
  } finally {
    await context.close();
  }
}

// ---------------------------------------------------------------------------------------------------------
// Building and starting the site

// The DATABASE_URL the site would use: from the shell, or else from the first env file that sets it, in the
// order Next.js reads them for a production build
function configuredDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL !== undefined) return process.env.DATABASE_URL;
  for (const file of ['.env.production.local', '.env.local', '.env.production', '.env']) {
    const full = path.join(ROOT, file);
    if (!existsSync(full)) continue;
    const value = parseEnv(readFileSync(full, 'utf8')).DATABASE_URL;
    if (value !== undefined) return value;
  }
  return undefined;
}

// True if something accepts connections at the database URL's host and port within a second
// (the same check payload.config.ts makes under npm run dev)
async function databaseAnswers(url: string): Promise<boolean> {
  let host: string;
  let port: number;
  try {
    const parsed = new URL(url);
    host = parsed.hostname;
    port = Number(parsed.port) || 5432;
  } catch {
    return false;
  }
  const socket = connect({ host, port, timeout: 1000 });
  return new Promise<boolean>((resolve) => {
    socket.once('connect', () => resolve(true));
    socket.once('timeout', () => resolve(false));
    socket.once('error', () => resolve(false));
  }).finally(() => socket.destroy());
}

// Environment for the build and the server. A production build insists on Postgres whenever DATABASE_URL is
// set (payload.config.ts), so a DATABASE_URL with nothing behind it (such as a leftover .env) would stop the
// build. Like npm run dev, the script then uses local.db instead: an empty DATABASE_URL in the environment
// wins over the env files, because Next.js never replaces a value that is already set.
async function siteEnvironment(log: (message: string) => void): Promise<NodeJS.ProcessEnv> {
  const env: NodeJS.ProcessEnv = { ...process.env, NEXT_TELEMETRY_DISABLED: '1' };
  const databaseUrl = configuredDatabaseUrl();
  if (databaseUrl && !(await databaseAnswers(databaseUrl))) {
    let host = 'an address that is not valid';
    try {
      host = new URL(databaseUrl).host;
    } catch {
      // keep the general wording
    }
    log(`Nothing answers at DATABASE_URL (${host}), so the site uses local.db (SQLite), as npm run dev does.`);
    env.DATABASE_URL = '';
  }
  return env;
}

function runNext(args: string[], logFile: string, env: NodeJS.ProcessEnv): ChildProcess {
  const log = createWriteStream(logFile, { flags: 'a' });
  const child = spawn(process.execPath, [NEXT_BIN, ...args], {
    cwd: ROOT,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout?.pipe(log);
  child.stderr?.pipe(log);
  return child;
}

function lastLines(file: string, count: number) {
  try {
    return readFileSync(file, 'utf8').trimEnd().split('\n').slice(-count).join('\n');
  } catch {
    return '';
  }
}

async function build(logFile: string, env: NodeJS.ProcessEnv) {
  const child = runNext(['build'], logFile, env);
  const code: number | null = await new Promise((resolve) => child.on('exit', resolve));
  if (code !== 0) {
    const log = lastLines(logFile, 25);
    const hint = /no such column|no such table/.test(log)
      ? '\n\nThe local database (local.db) is older than the code. Run `npm run dev` once, open ' +
        'http://localhost:3000 so it updates local.db, stop it, and run this again.'
      : '';
    throw new Error(`The build failed. Last lines of ${path.relative(ROOT, logFile)}:\n\n${log}${hint}`);
  }
}

async function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, () => {
      const address = server.address();
      server.close(() => (typeof address === 'object' && address ? resolve(address.port) : reject(new Error('No free port'))));
    });
  });
}

async function startServer(logFile: string, env: NodeJS.ProcessEnv): Promise<{ base: string; child: ChildProcess }> {
  const port = await freePort();
  const child = runNext(['start', '-p', String(port)], logFile, env);
  const base = `http://localhost:${port}`;
  const end = Date.now() + 90_000;
  while (Date.now() < end) {
    if (child.exitCode !== null) break;
    try {
      const response = await fetch(base, { redirect: 'manual' });
      if (response.status < 500) return { base, child };
    } catch {
      // not answering yet
    }
    await sleep(500);
  }
  child.kill();
  throw new Error(`The site did not start. Last lines of ${path.relative(ROOT, logFile)}:\n\n${lastLines(logFile, 25)}`);
}

// ---------------------------------------------------------------------------------------------------------
// Report

const TYPE_GROUPS: Record<string, string> = {
  Document: 'Page HTML',
  Script: 'JavaScript',
  Stylesheet: 'CSS',
  Image: 'Images',
  Font: 'Fonts',
  Fetch: 'Data requests',
  XHR: 'Data requests',
  Media: 'Video and audio',
};
const groupOf = (type: string) => TYPE_GROUPS[type] ?? 'Other';

function size(bytes: number) {
  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1_000_000) return `${(bytes / 1000).toFixed(1)} kB`;
  return `${(bytes / 1_000_000).toFixed(2)} MB`;
}

const seconds = (ms: number | null) => (ms === null ? 'n/a' : `${(ms / 1000).toFixed(1)} s`);
const sum = (records: RequestRecord[]) => records.reduce((total, r) => total + r.bytes, 0);
const duringLoad = (records: RequestRecord[]) => records.filter((r) => r.phase === 'load');

// A short, readable form of a request's address
function shortUrl(raw: string, base: string) {
  const url = new URL(raw);
  if (url.pathname === '/_next/image') {
    const source = url.searchParams.get('url') ?? '?';
    return `${source} (resized by Next.js to ${url.searchParams.get('w') ?? '?'} px wide)`;
  }
  const shown = url.origin === new URL(base).origin ? url.pathname + url.search : url.host + url.pathname;
  return shown.length > 100 ? `${shown.slice(0, 97)}...` : shown;
}

function gitDescription() {
  try {
    const commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT }).toString().trim();
    const branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: ROOT }).toString().trim();
    const dirty = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT }).toString().trim() !== '';
    return `\`${commit}\` on branch \`${branch}\`${dirty ? ', plus changes that are not committed' : ''}`;
  } catch {
    return 'unknown';
  }
}

interface ReportInfo {
  started: Date;
  base: string;
  source: string;
  device: string;
  browserVersion: string;
  discovered: Discovered;
  results: PageResult[];
}

function markdownReport(info: ReportInfo) {
  const { discovered, results, base } = info;
  const lines: string[] = [];
  const add = (...more: string[]) => lines.push(...more);

  add(
    `# Bandwidth report, ${info.started.toISOString().slice(0, 16).replace('T', ' ')} UTC`,
    '',
    `- **Site:** ${base} (${info.source})`,
    `- **Code:** ${info.source.startsWith('local') ? gitDescription() : 'whatever that site is running'}`,
    `- **Browser:** headless Chromium ${info.browserVersion}, ${info.device}`,
    `- **Content at the time:** /resources said "${discovered.resourcesShown ?? 'no count shown'}" ` +
      `; the site had ${discovered.projectCount} ${discovered.projectCount === 1 ? 'project' : 'projects'}; /stories listed ${discovered.articleCount} ` +
      `${discovered.articleCount === 1 ? 'article' : 'articles'}. More content changes these numbers.`,
    ...SLOW_CONNECTIONS.map(
      (c) =>
        `- **${c.label}:** ${c.downloadKbps} kbit/s down, ${c.uploadKbps} kbit/s up, ${c.latencyMs} ms added to each ` +
        'request (the Chrome DevTools preset of that name).',
    ),
    '',
    'How each page was loaded (see docs/bandwidth-testing.md):',
    '',
    '1. **First visit:** empty cache, full speed. "Whole page" also counts what loaded while scrolling to the bottom.',
    '2. **Repeat visit:** the same page again, with the cache from the first visit.',
    `3. **Slow connections:** empty cache, once on each of ${SLOW_CONNECTIONS.map((c) => c.label).join(' and ')}.`,
    '',
    '"Data" is what travelled over the network (compressed, with headers): the "transferred" column in Chrome DevTools.',
    '',
    '## Summary',
    '',
    'Times are seconds from the start of loading until the first content, the largest content, and the whole ' +
      'page (the browser\'s "load" event) appeared.',
    '',
    '| Page | First visit: data (requests) | Whole page after scrolling | Repeat visit: data (requests) | ' +
      SLOW_CONNECTIONS.map((c) => `${c.label}: first content | ${c.label}: largest content | ${c.label}: loaded`).join(' | ') +
      ' |',
    `|---|---|---|---|${'---|'.repeat(SLOW_CONNECTIONS.length * 3)}`,
  );
  for (const r of results) {
    const load = duringLoad(r.firstVisit.requests);
    const slowCells = r.slowVisits.map(
      ({ visit: v }) => `${seconds(v.timings.firstPaintMs)} | ${seconds(v.timings.largestPaintMs)} | ${seconds(v.timings.loadedMs)}`,
    );
    add(
      `| ${r.name} \`${r.path}\` | ${size(sum(load))} (${load.length}) | ${size(sum(r.firstVisit.requests))} ` +
        `(${r.firstVisit.requests.length}) | ${size(sum(r.repeatVisit.requests))} (${r.repeatVisit.requests.length}) | ` +
        `${slowCells.join(' | ')} |`,
    );
  }

  for (const r of results) {
    const all = r.firstVisit.requests;
    add('', `## ${r.name}: \`${r.path}\``, '');
    if (r.firstVisit.status !== 200) add(`**Warning:** the page answered with status ${r.firstVisit.status}.`, '');

    add('### Data by kind (first visit, whole page)', '', '| Kind | Data | Requests |', '|---|---|---|');
    const groups = new Map<string, RequestRecord[]>();
    for (const record of all) groups.set(groupOf(record.type), [...(groups.get(groupOf(record.type)) ?? []), record]);
    for (const [group, records] of [...groups].sort((a, b) => sum(b[1]) - sum(a[1]))) {
      add(`| ${group} | ${size(sum(records))} | ${records.length} |`);
    }

    add('', '### 10 largest requests (first visit, whole page)', '', '| Data | Kind | Address | When |', '|---|---|---|---|');
    for (const record of [...all].sort((a, b) => b.bytes - a.bytes).slice(0, 10)) {
      add(
        `| ${size(record.bytes)} | ${groupOf(record.type)} | ${shortUrl(record.url, base)} | ` +
          `${record.phase === 'load' ? 'while loading' : 'after scrolling'} |`,
      );
    }

    const problems = all.filter((x) => (x.failed && x.failed !== 'canceled') || (x.status ?? 0) >= 400);
    if (problems.length) {
      add('', '### Failed requests', '');
      for (const x of problems) add(`- ${shortUrl(x.url, base)}: ${x.failed ?? `status ${x.status}`}`);
    }

    const timingRow = (label: string, t: Timings) =>
      `| ${label} | ${seconds(t.firstPaintMs)} | ${seconds(t.largestPaintMs)} | ${seconds(t.loadedMs)} |`;
    add(
      '',
      '### Timing',
      '',
      '| Connection | First content shown | Largest content shown | Loaded |',
      '|---|---|---|---|',
      timingRow('Full speed', r.firstVisit.timings),
      ...r.slowVisits.map(({ connection, visit: v }) => timingRow(connection.label, v.timings)),
    );
    for (const { connection, visit: v } of r.slowVisits) {
      add('', `### What a visitor sees on ${connection.label}`, '');
      for (const shot of v.screenshots) add(`**${shot.label}**`, '', `![${r.name}, ${connection.label}, ${shot.label}](${shot.file})`, '');
    }
  }
  return lines.join('\n') + '\n';
}

// ---------------------------------------------------------------------------------------------------------
// Progress bar

// About how many seconds each step takes, to share out the bar fairly. Only the proportions matter.
const STEP_SECONDS = {
  build: 30,
  start: 5,
  discover: 3,
  firstVisit: 6,
  repeatVisit: 3,
  'Slow 4G': 8,
  '3G': 18,
  report: 1,
} as const;
const pageSeconds = () =>
  STEP_SECONDS.firstVisit + STEP_SECONDS.repeatVisit + SLOW_CONNECTIONS.reduce((t, c) => t + STEP_SECONDS[c.label], 0);

// One line that fills up while the steps run: [██████░░░░]  34%  Measuring Project page: Slow 4G
// Inside a long step it creeps forward by the expected time (to at most 95% of the step), so it keeps moving.
// When the output isn't a terminal (a log file, CI), it prints one line per step instead.
class Progress {
  private total: number;
  private done = 0;
  private step = { label: 'Getting ready', seconds: 0, started: Date.now() };
  private timer: ReturnType<typeof setInterval> | null = null;
  private readonly live = Boolean(process.stdout.isTTY);

  constructor(totalSeconds: number) {
    this.total = totalSeconds;
    if (this.live) this.timer = setInterval(() => this.draw(), 200);
  }

  setTotal(totalSeconds: number) {
    this.total = Math.max(totalSeconds, this.done + this.step.seconds);
  }

  // Finishes the current step and starts the next one
  next(label: string, seconds: number) {
    this.done += this.step.seconds;
    this.step = { label, seconds, started: Date.now() };
    if (this.live) this.draw();
    else console.log(`[${String(this.percent()).padStart(3)}%] ${label}`);
  }

  // Prints a message above the bar
  log(message: string) {
    if (this.live) process.stdout.write('\r\x1b[2K');
    console.log(message);
    if (this.live) this.draw();
  }

  // Fills the bar, or (when the run failed) just leaves it where it is
  stop(completed: boolean) {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    if (completed) {
      this.done = this.total;
      this.step = { label: 'Done', seconds: 0, started: Date.now() };
      if (this.live) this.draw();
      else console.log('[100%] Done');
    }
    if (this.live) process.stdout.write('\n');
  }

  private percent() {
    const elapsed = (Date.now() - this.step.started) / 1000;
    const inStep = Math.min(elapsed, this.step.seconds * 0.95);
    return Math.min(100, Math.floor(((this.done + inStep) / this.total) * 100));
  }

  private draw() {
    const width = 30;
    const percent = this.percent();
    const filled = Math.round((percent / 100) * width);
    const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
    const columns = process.stdout.columns || 100;
    const line = `[${bar}] ${String(percent).padStart(3)}%  ${this.step.label}`;
    process.stdout.write(`\r\x1b[2K${line.slice(0, columns - 1)}`);
  }
}

// ---------------------------------------------------------------------------------------------------------
// Main

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function timestamp(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
}

function normalisePath(value: string | undefined) {
  if (!value) return undefined;
  const url = new URL(value, 'http://placeholder');
  return url.pathname;
}

async function main() {
  const { values } = parseArgs({
    options: {
      'skip-build': { type: 'boolean', default: false },
      url: { type: 'string' },
      project: { type: 'string' },
      article: { type: 'string' },
      desktop: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
    },
  });
  if (values.help) {
    console.log(HELP);
    return;
  }

  const started = new Date();
  const outDir = path.join(ROOT, 'bandwidth-reports', timestamp(started));
  mkdirSync(outDir, { recursive: true });
  const logFile = path.join(outDir, 'server.log');

  const building = !values.url && !values['skip-build'];
  const startsServer = !values.url;
  const progress = new Progress(
    (building ? STEP_SECONDS.build : 0) +
      (startsServer ? STEP_SECONDS.start : 0) +
      STEP_SECONDS.discover +
      3 * pageSeconds() +
      STEP_SECONDS.report,
  );
  let completed = false;

  let server: ChildProcess | null = null;
  const stopServer = () => {
    if (server && server.exitCode === null) server.kill();
  };
  process.on('SIGINT', () => {
    progress.stop(false);
    stopServer();
    process.exit(130);
  });

  let base: string;
  let source: string;
  try {
    if (values.url) {
      base = new URL(values.url).origin;
      source = 'already running; not built by this script';
    } else {
      const env = await siteEnvironment((message) => progress.log(message));
      if (values['skip-build']) {
        if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
          throw new Error('There is no build to reuse. Run the command again without --skip-build.');
        }
        progress.log('Using the last build in .next');
      } else {
        progress.next('Building the site the way visitors get it', STEP_SECONDS.build);
        await build(logFile, env);
      }
      progress.next('Starting the site', STEP_SECONDS.start);
      const running = await startServer(logFile, env);
      server = running.child;
      base = running.base;
      source = 'local finished build, started by this script';
    }

    const browser = await chromium.launch();
    try {
      const contextOptions: BrowserContextOptions = values.desktop
        ? { viewport: { width: 1440, height: 900 } }
        : { ...devices['Pixel 7'] };
      const device = values.desktop ? 'desktop window 1440 × 900' : 'phone (Pixel 7 screen size)';

      progress.next('Finding the pages to measure', STEP_SECONDS.discover);
      const discovered = await discover(browser, base);
      const projectPath = normalisePath(values.project) ?? discovered.projectPath;
      const articlePath = normalisePath(values.article) ?? discovered.articlePath;
      const targets: [string, string | null][] = [
        ['Resource gallery', '/resources'],
        ['Project page', projectPath],
        ['Article page', articlePath],
      ];
      const missing = targets.filter(([, p]) => !p).map(([name]) => name);
      if (missing.length) {
        progress.log(
          `Skipping: ${missing.join(', ')}. The site has no published ${missing.map((m) => m.split(' ')[0].toLowerCase()).join(' or ')} ` +
            'to measure. Add content, or name a page with --project or --article.',
        );
      }

      // Now the number of pages is known
      progress.setTotal(
        (building ? STEP_SECONDS.build : 0) +
          (startsServer ? STEP_SECONDS.start : 0) +
          STEP_SECONDS.discover +
          (targets.length - missing.length) * pageSeconds() +
          STEP_SECONDS.report,
      );

      const results: PageResult[] = [];
      for (const [name, pagePath] of targets) {
        if (!pagePath) continue;
        results.push(await measurePage(browser, contextOptions, base, name, pagePath, outDir, progress));
      }

      progress.next('Writing the report', STEP_SECONDS.report);

      const info: ReportInfo = {
        started,
        base,
        source,
        device,
        browserVersion: browser.version(),
        discovered,
        results,
      };
      writeFileSync(path.join(outDir, 'report.md'), markdownReport(info));
      writeFileSync(path.join(outDir, 'results.json'), JSON.stringify(info, null, 2));
      progress.stop(true);
      completed = true;

      console.log('');
      console.table(
        Object.fromEntries(
          results.map((r) => [
            `${r.name} ${r.path}`,
            {
              'First visit': size(sum(duringLoad(r.firstVisit.requests))),
              Requests: duringLoad(r.firstVisit.requests).length,
              'Whole page': size(sum(r.firstVisit.requests)),
              'Repeat visit': size(sum(r.repeatVisit.requests)),
              ...Object.fromEntries(
                r.slowVisits.map(({ connection, visit: v }) => [`Loaded on ${connection.label}`, seconds(v.timings.loadedMs)]),
              ),
            },
          ]),
        ),
      );
      console.log(`\nFull report: ${path.relative(process.cwd(), path.join(outDir, 'report.md'))}`);
    } finally {
      await browser.close();
    }
  } finally {
    if (!completed) progress.stop(false);
    stopServer();
  }
}

main().catch((error: unknown) => {
  console.error(`\nThe measurement stopped: ${error instanceof Error ? error.message : String(error)}`);
  if (error instanceof Error && /Executable doesn't exist/.test(error.message)) {
    console.error('Chromium for Playwright is missing. Run: npx playwright install chromium');
  }
  process.exit(1);
});
