import { getPayload } from 'payload'

// Run by a trusted operator, never from a public endpoint. No client-chosen administrator is hardcoded.
const email = process.env.STAFF_ADMIN_EMAIL?.trim().toLowerCase()
if (!email || !email.includes('@')) throw new Error('Set STAFF_ADMIN_EMAIL to the approved administrator email.')
if (process.env.STAFF_ADMIN_CONFIRM !== 'yes') {
  throw new Error('Verify the target database, then set STAFF_ADMIN_CONFIRM=yes to approve this account.')
}

// Fail instead of silently promoting someone in a fallback SQLite database.
if (process.env.DATABASE_URL) Object.assign(process.env, { NODE_ENV: 'production' })
const { default: config } = await import('../payload.config')
const payload = await getPayload({ config })
try {
  const { docs } = await payload.find({
    collection: 'users', where: { email: { equals: email } }, limit: 1, overrideAccess: true,
  })
  if (docs[0]) {
    await payload.update({
      collection: 'users', id: docs[0].id, data: { role: 'admin' }, overrideAccess: true,
      context: { staffBootstrap: true },
    })
    payload.logger.info('Existing account approved as administrator. Its password was not changed.')
  } else {
    const password = process.env.STAFF_ADMIN_PASSWORD
    if (!password || password.length < 12) {
      throw new Error('For a new account, set STAFF_ADMIN_PASSWORD to a unique password of at least 12 characters.')
    }
    await payload.create({
      collection: 'users',
      data: { email, password, name: process.env.STAFF_ADMIN_NAME || undefined, role: 'admin' },
      overrideAccess: true, context: { staffBootstrap: true },
    })
    payload.logger.info('Administrator account created.')
  }
} finally {
  await payload.destroy()
}
