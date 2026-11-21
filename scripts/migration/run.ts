import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'

import { importResources, type Manifest, validateManifest } from './import-resources'
import { migrationConfig } from './local-config'

// Fixed local destination. DATABASE_URL, S3 and the application's local.db are never used.
const directory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.migration-poc')
const manifest = JSON.parse(await fs.readFile(path.join(directory, 'manifest.json'), 'utf8')) as Manifest
await validateManifest(manifest, directory)
const payload = await getPayload({ config: migrationConfig(directory) })
try {
  const report = await importResources(payload, manifest, directory)
  await fs.writeFile(path.join(directory, 'report.json'), JSON.stringify(report, null, 2) + '\n')
  console.table(report.resources.map(({ title, language, id, action }) => ({ title, language, id, action })))
  console.log(`Reviewed ${report.projects.length} projects and ${report.resources.length} resources. See .migration-poc/report.json.`)
} finally {
  await payload.destroy()
}
