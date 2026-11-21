import type { GlobalAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidateLayout: GlobalAfterChangeHook = ({ doc, req }) => {
  // Seed scripts run outside Next, where revalidatePath throws
  if (!req.context?.disableRevalidate) {
    revalidatePath('/', 'layout') // every page under the root layout
  }
  return doc
}