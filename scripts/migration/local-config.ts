import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'node:path'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Documents } from '../../collections/Documents'
import { Media } from '../../collections/Media'
import { Projects } from '../../collections/Projects'
import { Resources } from '../../collections/Resources'
import { Tags } from '../../collections/Tags'
import { Users } from '../../collections/Users'

// Same content schemas, isolated database/uploads. Never imports app config, PostgreSQL or S3.
export function migrationConfig(directory: string) {
  return buildConfig({
    secret: 'local-resource-migration-proof-of-concept-only',
    db: sqliteAdapter({ client: { url: `file:${path.join(directory, 'local.db')}` } }),
    editor: lexicalEditor(),
    sharp,
    collections: [Users, Tags, Resources, Projects,
      { ...Media, upload: { ...typeof Media.upload === 'object' ? Media.upload : {}, staticDir: path.join(directory, 'media') } },
      { ...Documents, upload: { ...typeof Documents.upload === 'object' ? Documents.upload : {}, staticDir: path.join(directory, 'documents') } },
    ],
    admin: { disable: true, user: 'users' },
    typescript: { autoGenerate: false },
  })
}
