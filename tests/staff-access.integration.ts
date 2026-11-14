import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { buildConfig, createLocalReq, getPayload, registerFirstUserOperation, type RequiredDataFromCollectionSlug } from 'payload'

import { Tags } from '../collections/Tags'
import { Users } from '../collections/Users'
import { isApprovedStaff } from '../lib/staffAccess'

// Deliberately do not import payload.config or use DATABASE_URL / S3 configuration.
const directory = await mkdtemp(path.join(os.tmpdir(), 'nest360-staff-access-'))
const config = buildConfig({
  secret: randomBytes(32).toString('hex'),
  db: sqliteAdapter({ client: { url: `file:${path.join(directory, 'test.db')}` } }),
  collections: [Users, Tags],
  admin: { user: 'users', disable: true },
  typescript: { autoGenerate: false },
})
const payload = await getPayload({ config })
const password = randomBytes(24).toString('base64url')
const bootstrap = { staffBootstrap: true }
try {
  // Exercise the actual Payload first-registration operation, which bypasses collection access.
  await assert.rejects(registerFirstUserOperation({
    collection: payload.collections.users,
    data: { email: 'outsider@example.test', password, role: 'admin' },
    req: await createLocalReq({}, payload),
  }))
  assert.equal((await payload.count({ collection: 'users', overrideAccess: true })).totalDocs, 0)
  await assert.rejects(payload.create({
    collection: 'users', data: { email: 'public@example.test', password, role: 'admin' }, overrideAccess: false,
  }))
  // Also deny create operations that bypass access, as first-register does.
  await assert.rejects(payload.create({
    collection: 'users', data: { email: 'bypass@example.test', password, role: 'admin' }, overrideAccess: true,
  }))
  const adminRecord = await payload.create({
    collection: 'users', data: { email: 'admin@example.test', password, role: 'admin' }, context: bootstrap,
  })
  const admin = { ...adminRecord, collection: 'users' as const }
  const editorRecord = await payload.create({
    collection: 'users', data: { email: 'editor@example.test', password, role: 'editor' },
    user: admin, overrideAccess: false,
  })
  const editor = { ...editorRecord, collection: 'users' as const }
  const pendingRecord = await payload.create({
    collection: 'users', data: { email: 'pending@example.test', password } as RequiredDataFromCollectionSlug<'users'>, user: admin, overrideAccess: false,
  })
  assert.equal(pendingRecord.role, 'pending')
  const pending = { ...pendingRecord, collection: 'users' as const }
  assert.ok((await payload.login({ collection: 'users', data: { email: admin.email, password } })).token)
  const editorLogin = await payload.login({ collection: 'users', data: { email: editor.email, password } })
  assert.ok(editorLogin.token)
  await assert.rejects(payload.login({ collection: 'users', data: { email: pending.email, password } }))

  const own = await payload.update({
    collection: 'users', id: editor.id, data: { name: 'Approved Editor', role: 'admin' },
    user: editor, overrideAccess: false,
  })
  assert.equal(own.name, 'Approved Editor')
  assert.equal(own.role, 'editor', 'Field access must prevent self-promotion')
  await assert.rejects(payload.update({
    collection: 'users', id: admin.id, data: { name: 'Changed by editor' }, user: editor, overrideAccess: false,
  }))
  await assert.rejects(payload.create({
    collection: 'users', data: { email: 'editor-created@example.test', password, role: 'editor' }, user: editor, overrideAccess: false,
  }))
  await assert.rejects(payload.delete({ collection: 'users', id: pending.id, user: editor, overrideAccess: false }))
  const visible = await payload.find({ collection: 'users', user: editor, overrideAccess: false })
  assert.deepEqual(visible.docs.map((user) => user.id), [editor.id])

  const tag = await payload.create({
    collection: 'tags', data: { name: 'Training', slug: 'training', usedFor: 'files' },
    user: editor, overrideAccess: false,
  })
  await assert.rejects(payload.create({
    collection: 'tags', data: { name: 'Unapproved', slug: 'unapproved', usedFor: 'files' },
    user: pending, overrideAccess: false,
  }))
  await payload.update({
    collection: 'users', id: editor.id, data: { role: 'pending' }, user: admin, overrideAccess: false,
  })
  // A real token issued before disabling must resolve to the current database role.
  const { user: disabled } = await payload.auth({ headers: new Headers({ authorization: `JWT ${editorLogin.token}` }) })
  assert.equal(isApprovedStaff(disabled), false)
  await assert.rejects(payload.update({
    collection: 'tags', id: tag.id, data: { name: 'Unauthorized edit' }, user: disabled, overrideAccess: false,
  }))
  await assert.rejects(payload.login({ collection: 'users', data: { email: editor.email, password } }))
  await payload.update({
    collection: 'users', id: editor.id, data: { role: 'editor' }, user: admin, overrideAccess: false,
  })
  assert.ok((await payload.login({ collection: 'users', data: { email: editor.email, password } })).token)
  await payload.delete({ collection: 'users', id: pending.id, user: admin, overrideAccess: false })
  console.log('PASS: first registration, public/editor account creation, login approval, self-promotion, profile isolation, content permissions, revocation and administrator management.')
} finally {
  await payload.destroy()
  await rm(directory, { recursive: true, force: true })
}
