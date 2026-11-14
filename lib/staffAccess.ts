import type { Access } from 'payload'

type StaffIdentity = { collection?: string; id?: number | string; role?: string | null } | null | undefined

export const isAdministrator = (user: StaffIdentity): boolean =>
  user?.collection === 'users' && user.role === 'admin'

export const isApprovedStaff = (user: StaffIdentity): boolean =>
  user?.collection === 'users' && (user.role === 'admin' || user.role === 'editor')

export const approvedStaff: Access = ({ req }) => isApprovedStaff(req.user)

export const administrators: Access = ({ req }) => isAdministrator(req.user)

export const administratorOrSelf: Access = ({ req }) => {
  if (isAdministrator(req.user)) return true
  if (!isApprovedStaff(req.user)) return false
  return { id: { equals: req.user!.id } }
}

// Reused by content collections: pending accounts (including old sessions) cannot edit content.
export const staffWrites = {
  create: approvedStaff,
  update: approvedStaff,
  delete: approvedStaff,
}
