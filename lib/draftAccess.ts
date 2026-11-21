import { draftMode, headers } from 'next/headers'
import type { Payload } from 'payload'

import { isApprovedStaff } from './staffAccess'

// A draft-mode cookie alone is insufficient after a staff account has been disabled.
export async function canPreviewDrafts(payload: Payload): Promise<boolean> {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return false
  const { user } = await payload.auth({ headers: await headers() })
  return isApprovedStaff(user)
}
