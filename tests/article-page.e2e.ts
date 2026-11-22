// Browser test: a story page shows the title that is saved in the database.
//
// It saves a published article with a made-up title in a throwaway SQLite database, builds and starts the
// site against that database, opens /stories/<slug> in headless Chrome, and checks what a visitor sees: the
// page heading and the browser tab show that exact title. Nothing is written to local.db or to the shared
// Postgres database. How to run it: docs/testing-pages.md.

import assert from 'node:assert/strict'
import { spawn, type ChildProcess } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { createServer } from 'node:net'
import os from 'node:os'
import path from 'node:path'

import { chromium, type Browser } from 'playwright'

const ROOT = path.resolve(import.meta.dirname, '..')
const NEXT_BIN = path.join(ROOT, 'node_modules', 'next', 'dist', 'bin', 'next')
// SKIP_BUILD=1 reuses the last `next build` in .next (faster when only the test changed)
const skipBuild = process.env.SKIP_BUILD === '1'

// A throwaway database for both this script and the site. These must be set before payload.config is
// loaded: it picks the database when it's imported. An empty DATABASE_URL and S3_BUCKET keep the shared
// Postgres database and S3 out of it, even if they're set in .env.
const directory = await mkdtemp(path.join(os.tmpdir(), 'nest360-article-page-'))
const databaseFile = path.join(directory, 'test.db')
const logFile = path.join(directory, 'next.log')
Object.assign(process.env, { PAYLOAD_SQLITE_FILE: databaseFile, DATABASE_URL: '', S3_BUCKET: '' })
const siteEnv: NodeJS.ProcessEnv = { ...process.env, NEXT_TELEMETRY_DISABLED: '1' }

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config')
// Starting Payload here also creates the database tables in the empty file
const payload = await getPayload({ config })
const context = { disableRevalidate: true } // revalidatePath only works inside Next

// Unique, so the test can only pass if the page shows what the database holds
const id = randomBytes(4).toString('hex')
const title = `Neonatal care in Malawi ${id}`
const slug = `test-article-${id}`

let site: ChildProcess | undefined
let browser: Browser | undefined
let imageId: number | undefined

function runNext(args: string[]): ChildProcess {
  const log = createWriteStream(logFile, { flags: 'a' })
  const child = spawn(process.execPath, [NEXT_BIN, ...args], { cwd: ROOT, env: siteEnv, stdio: ['ignore', 'pipe', 'pipe'] })
  child.stdout?.pipe(log)
  child.stderr?.pipe(log)
  return child
}

async function logTail() {
  const text = await readFile(logFile, 'utf8').catch(() => '')
  return text.trimEnd().split('\n').slice(-25).join('\n')
}

async function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.on('error', reject)
    server.listen(0, () => {
      const address = server.address()
      server.close(() => (typeof address === 'object' && address ? resolve(address.port) : reject(new Error('No free port'))))
    })
  })
}

async function startSite(): Promise<string> {
  const port = await freePort()
  site = runNext(['start', '-p', String(port)])
  const base = `http://localhost:${port}`
  const end = Date.now() + 90_000
  while (Date.now() < end && site.exitCode === null) {
    try {
      if ((await fetch(base, { redirect: 'manual' })).status < 500) return base
    } catch {
      // not answering yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`The site did not start. Last lines of its log:\n\n${await logTail()}`)
}

let failed = false
try {
  // 1. Save a published article, with the tag and picture an article requires
  const tag = await payload.create({ collection: 'tags', data: { name: `Test ${id}`, slug: `test-${id}`, usedFor: 'pages' }, context })
  const image = await payload.create({
    collection: 'media',
    data: { alt: 'Test picture' },
    filePath: path.join(ROOT, 'public', 'placeholder.jpg'),
    context,
  })
  imageId = image.id
  await payload.create({
    collection: 'articles',
    draft: false,
    context,
    data: {
      title,
      slug,
      _status: 'published',
      publishedDate: new Date().toISOString(),
      tags: [tag.id],
      featuredImage: image.id,
      excerpt: 'A short summary for the card.',
      content: {
        root: {
          type: 'root', format: '', indent: 0, version: 1, direction: null,
          children: [{
            type: 'paragraph', format: '', indent: 0, version: 1, direction: null, textFormat: 0, textStyle: '',
            children: [{ type: 'text', text: 'Body text of the test article.', format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
          }],
        },
      },
    },
  })

  // 2. Build and start the site the way visitors get it, against the throwaway database
  if (!skipBuild) {
    console.log('Building the site (about 1–2 minutes)…')
    const build = runNext(['build'])
    const code = await new Promise((resolve) => build.on('exit', resolve))
    if (code !== 0) throw new Error(`The build failed. Last lines of its log:\n\n${await logTail()}`)
  }
  console.log('Starting the site…')
  const base = await startSite()

  // 3. Open the story page as a visitor would
  browser = await chromium.launch()
  const page = await browser.newPage()
  const response = await page.goto(`${base}/stories/${slug}`)
  assert.equal(response?.status(), 200, `/stories/${slug} should load`)

  const heading = page.getByRole('heading', { level: 1 })
  assert.equal((await heading.textContent())?.trim(), title, 'The page heading should be the title saved in the database')
  assert.match(await page.title(), new RegExp(`^${title}\\b`), 'The browser tab should show the title saved in the database')

  console.log(`PASS: /stories/${slug} shows the title saved in the database ("${title}") in its heading and browser tab.`)
} catch (error) {
  failed = true
  console.error(error)
} finally {
  await browser?.close()
  if (site && site.exitCode === null) site.kill()
  // Deleting the picture through Payload also removes its file from the media folder
  if (imageId !== undefined) await payload.delete({ collection: 'media', id: imageId, context }).catch(() => {})
  await payload.destroy()
  await rm(directory, { recursive: true, force: true })
}
process.exit(failed ? 1 : 0)
