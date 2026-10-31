import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import fs from 'fs'
import net from 'net'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Pages } from './collections/Pages'
import { Footer } from './globals/Footer'
import { Header } from './globals/Header'
import { Articles } from './collections/Articles'
import { Documents } from './collections/Documents'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProduction = process.env.NODE_ENV === 'production'

// True if something accepts connections at the database URL's host and port within a second
function databaseAnswers(url: string) {
  const { hostname, port } = new URL(url)
  const socket = net.connect({ host: hostname, port: Number(port) || 5432, timeout: 1000 })
  return new Promise<boolean>((resolve) => {
    socket.once('connect', () => resolve(true))
    socket.once('timeout', () => resolve(false))
    socket.once('error', () => resolve(false))
  }).finally(() => socket.destroy())
}

// Postgres when DATABASE_URL is set. In development, a DATABASE_URL with no server behind it (such as a
// leftover .env) falls back to the SQLite file too, so `npm run dev` always starts.
const databaseUrl = process.env.DATABASE_URL
const usePostgres = Boolean(databaseUrl) && (isProduction || (await databaseAnswers(databaseUrl!)))
// Next loads this file in several places, so warn only once per process
const warned = globalThis as { warnedNoDatabase?: boolean }
if (databaseUrl && !usePostgres && !warned.warnedNoDatabase) {
  warned.warnedNoDatabase = true
  console.warn(`Nothing answers at DATABASE_URL (${new URL(databaseUrl).host}), so using local.db (SQLite) instead.`)
}

export default buildConfig({
  admin: {
    user: Users.slug,
    // Skips the login page by signing every visitor in as this user, so it only ever works under `next dev`
    autoLogin:
      process.env.NODE_ENV === 'development' && process.env.PAYLOAD_AUTOLOGIN_EMAIL
        ? { email: process.env.PAYLOAD_AUTOLOGIN_EMAIL }
        : false,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Documents, Tags, Articles, Projects, Pages],
  globals: [Header, Footer],
  editor: lexicalEditor(),
  // Development falls back to a fixed secret so a fresh clone runs without a .env; production must set one
  secret: process.env.PAYLOAD_SECRET || (isProduction ? '' : 'nest360-local-development-only'),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Otherwise a SQLite file in the project, so `npm run dev` works with no database to install
  db: usePostgres
    ? postgresAdapter({
        pool: {
          connectionString: databaseUrl,
          // RDS requires SSL with Amazon's CA; local Postgres doesn't
          ssl:
            process.env.DATABASE_SSL === 'true'
              ? { ca: fs.readFileSync(path.resolve(dirname, 'certs/rds-global-bundle.pem')).toString() }
              : undefined,
          // Keep low: each serverless function instance opens its own pool
          max: 5,
        },
      })
    : sqliteAdapter({
        client: { url: `file:${path.resolve(dirname, 'local.db')}` },
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
