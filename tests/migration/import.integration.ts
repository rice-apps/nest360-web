import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { getPayload } from 'payload'

import { importResources, type Manifest } from '../../scripts/migration/import-resources'
import { migrationConfig } from '../../scripts/migration/local-config'

// Synthetic one-page PDF, never presented as migrated NEST360 content.
function fixturePdf() {
  const stream = 'BT /F1 16 Tf 50 700 Td (Migration test fixture) Tj ET'
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  let output = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((object, i) => { offsets.push(Buffer.byteLength(output)); output += `${i + 1} 0 obj\n${object}\nendobj\n` })
  const xref = Buffer.byteLength(output)
  output += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map((n) => `${String(n).padStart(10, '0')} 00000 n \n`).join('')}`
  output += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return Buffer.from(output)
}

const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'nest360-migration-test-'))
await fs.mkdir(path.join(directory, 'downloads'))
const pdf = fixturePdf()
const sha256 = createHash('sha256').update(pdf).digest('hex')
const file = `downloads/${sha256}.pdf`
await fs.writeFile(path.join(directory, file), pdf)
const manifest: Manifest = {
  version: 1, retrievedAt: '2026-11-21T00:00:00Z', projects: [{
    title: 'Migration test project', url: 'https://nest360.org/project/test-fixture/',
    category: 'healthcare', layout: 'groups', description: ['Original fixture introduction.'],
    resources: ['en', 'pt'].map((language) => ({
      title: `Test guide ${language}`, group: 'Test group', language: language as 'en' | 'pt',
      documentType: 'clinical-aid', fileUrl: 'https://nest360.org/test-fixture.pdf', file, sha256,
    })),
  }],
}
const payload = await getPayload({ config: migrationConfig(directory) })
try {
  // Bad cached content must not produce any partial database imports.
  await fs.writeFile(path.join(directory, file), 'not a PDF')
  await assert.rejects(importResources(payload, manifest, directory), /Invalid PDF/)
  assert.equal((await payload.count({ collection: 'resources' })).totalDocs, 0)
  await fs.writeFile(path.join(directory, file), pdf)
  const first = await importResources(payload, manifest, directory)
  assert.equal(first.resources.length, 2)
  assert.ok(first.resources.every((r) => r.action === 'created draft'))
  assert.equal((await payload.count({ collection: 'documents' })).totalDocs, 1, 'Same PDF must be uploaded once')
  const resources = await payload.find({ collection: 'resources', draft: true, depth: 0 })
  assert.ok(resources.docs.every((r) => r._status === 'draft' && r.summary === 'Original fixture introduction.'))
  assert.deepEqual(resources.docs.map((r) => r.language).sort(), ['en', 'pt'])
  const publicResults = await payload.find({ collection: 'resources', overrideAccess: false })
  assert.equal(publicResults.totalDocs, 0, 'Imported drafts must not be public')
  const project = await payload.findByID({ collection: 'projects', id: first.projects[0].id, depth: 0 })
  assert.equal(project.resourceGroups[0].title, 'Test group')
  assert.deepEqual(project.resourceGroups[0].resources.map((r) => r.resource).sort(), resources.docs.map((r) => r.id).sort())
  const document = await payload.findByID({ collection: 'documents', id: first.resources[0].document, depth: 0 })
  const uploaded = await fs.readFile(path.join(directory, 'documents', document.filename!))
  assert.deepEqual(uploaded, pdf, 'Original PDF bytes must survive the upload unchanged')
  // Reruns must not overwrite an editor's reviewed content.
  await payload.update({ collection: 'resources', id: resources.docs[0].id, draft: true, data: { title: 'Manually reviewed title' } })
  const second = await importResources(payload, manifest, directory)
  assert.ok(second.resources.every((r) => r.action === 'skipped existing'))
  assert.equal((await payload.count({ collection: 'resources' })).totalDocs, 2)
  assert.equal((await payload.count({ collection: 'projects' })).totalDocs, 1)
  assert.equal((await payload.count({ collection: 'documents' })).totalDocs, 1)
  assert.equal((await payload.findByID({ collection: 'resources', id: resources.docs[0].id, draft: true })).title, 'Manually reviewed title')
  assert.equal(second.resources[0].fileUrl, manifest.projects[0].resources[0].fileUrl)
  console.log('PASS: real Payload schemas, draft exclusion, file integrity, language/group relationships, provenance, duplicate protection and preservation of manual edits. Synthetic fixtures only.')
} finally {
  await payload.destroy()
  await fs.rm(directory, { recursive: true, force: true })
}
