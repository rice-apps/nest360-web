import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import fs from 'fs'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Documents } from './collections/Documents'
import { Media } from './collections/Media'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Documents, Tags],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      // RDS requires SSL with Amazon's CA; local Postgres doesn't
      ssl:
        process.env.DATABASE_SSL === 'true'
          ? { ca: fs.readFileSync(path.resolve(dirname, 'certs/rds-global-bundle.pem')).toString() }
          : undefined,
      // Keep low: each serverless function instance opens its own pool
      max: 5,
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      // Skip S3 when no bucket is configured so the app still runs locally
      enabled: Boolean(process.env.S3_BUCKET),
      collections: {
        media: { prefix: 'media' },
        documents: { prefix: 'documents' },
      },
      bucket: process.env.S3_BUCKET || '',
      // Browser uploads straight to S3, avoiding Vercel's 4.5 MB request limit
      clientUploads: true,
      config: {
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
