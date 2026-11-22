// Checks what the site search (lib/data/search.ts) returns, using a throwaway database with a few sample
// resources. It tests results only (which resources come back), not how the search works inside.
//
//   npm run test:search        (see docs/testing-search.md)
//
// search() opens the database with getPayload(). getPayload() reuses the first database a program opens, so
// opening the throwaway database below first makes search() use it. The real local.db, DATABASE_URL and S3
// are never touched.

import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { searchPlugin } from '@payloadcms/plugin-search'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig, getPayload } from 'payload'
import sharp from 'sharp'

import { Articles } from '../collections/Articles'
import { Authors } from '../collections/Authors'
import { Documents } from '../collections/Documents'
import { Media } from '../collections/Media'
import { Projects } from '../collections/Projects'
import { Resources } from '../collections/Resources'
import { Tags } from '../collections/Tags'
import { Technologies } from '../collections/Technologies'
import { Users } from '../collections/Users'
import { search } from '../lib/data/search'
import { searchPluginConfig } from '../lib/searchIndex'

const directory = await mkdtemp(path.join(os.tmpdir(), 'nest360-search-test-'))
const uploadsIn = (folder: string) => (upload: typeof Media.upload) => ({
  ...(typeof upload === 'object' ? upload : {}),
  staticDir: path.join(directory, folder),
})

// The site's own collections and search setup, with a throwaway SQLite database and upload folders
const config = buildConfig({
  secret: randomBytes(32).toString('hex'),
  db: sqliteAdapter({ client: { url: `file:${path.join(directory, 'test.db')}` } }),
  editor: lexicalEditor(),
  sharp,
  collections: [
    Users,
    Tags,
    Authors,
    Resources,
    Projects,
    Technologies,
    Articles,
    { ...Media, upload: uploadsIn('media')(Media.upload) },
    { ...Documents, upload: uploadsIn('documents')(Documents.upload) },
  ],
  plugins: [searchPlugin(searchPluginConfig)],
  admin: { user: 'users', disable: true },
  typescript: { autoGenerate: false },
})
const payload = await getPayload({ config })

const slugs = (results: { slug?: string | null }[]) => results.map((result) => result.slug).sort()

try {
  // Sample content: two tags and four resources. Two resources mention "kangaroo", with different tags.
  const thermal = await payload.create({
    collection: 'tags',
    data: { name: 'Thermal Care', slug: 'thermal-care', usedFor: 'both' },
  })
  const respiratory = await payload.create({
    collection: 'tags',
    data: { name: 'Respiratory Support', slug: 'respiratory-support', usedFor: 'both' },
  })
  const resource = (slug: string, title: string, summary: string, tags: number[], published = true) =>
    payload.create({
      collection: 'resources',
      draft: !published,
      data: {
        title,
        slug,
        summary,
        resourceType: 'link',
        externalUrl: `https://example.org/${slug}`,
        language: 'en',
        tags,
        _status: published ? 'published' : 'draft',
      },
    })
  await resource('kangaroo-care-guide', 'Kangaroo mother care guide', 'Skin-to-skin care that keeps newborns warm.', [thermal.id])
  await resource('kangaroo-care-breathing', 'Kangaroo care and breathing', 'How skin-to-skin care supports breathing.', [respiratory.id])
  await resource('oxygen-concentrator-job-aid', 'Oxygen concentrator job aid', 'Setting up and cleaning an oxygen concentrator.', [respiratory.id])
  await resource('oxygen-draft', 'Oxygen draft', 'An oxygen resource that is not published yet.', [respiratory.id], false)

  // 1. A resource search returns the expected matching resource
  assert.deepEqual(
    slugs(await search({ query: 'concentrator', collections: ['resources'] })),
    ['oxygen-concentrator-job-aid'],
    'Searching "concentrator" should return the oxygen concentrator job aid and nothing else',
  )
  // Words in the summary count too, and unpublished resources stay hidden
  assert.deepEqual(
    slugs(await search({ query: 'oxygen', collections: ['resources'] })),
    ['oxygen-concentrator-job-aid'],
    'Searching "oxygen" should return only the published oxygen resource, not the draft',
  )

  // 2. Search and tag filtering work together
  assert.deepEqual(
    slugs(await search({ query: 'kangaroo', collections: ['resources'] })),
    ['kangaroo-care-breathing', 'kangaroo-care-guide'],
    'Searching "kangaroo" without a tag should return both kangaroo resources',
  )
  assert.deepEqual(
    slugs(await search({ query: 'kangaroo', tags: ['thermal-care'], collections: ['resources'] })),
    ['kangaroo-care-guide'],
    'Searching "kangaroo" with the Thermal Care tag should return only the resource that has both',
  )
  assert.deepEqual(
    slugs(await search({ tags: ['respiratory-support'], collections: ['resources'] })),
    ['kangaroo-care-breathing', 'oxygen-concentrator-job-aid'],
    'The Respiratory Support tag alone should return every published resource with that tag',
  )

  console.log('PASS: search returns the matching resource; search and tag filtering work together.')
} finally {
  await payload.destroy()
  await rm(directory, { recursive: true, force: true })
}
