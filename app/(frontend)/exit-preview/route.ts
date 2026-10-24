//turn preview off
import { cookies, draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(): Promise<Response> {
  ;(await draftMode()).disable()

  // Back to the edit page the admin clicked Preview from (set in /preview)
  const cookieStore = await cookies()
  const returnTo = cookieStore.get('preview-return-to')?.value
  cookieStore.delete('preview-return-to')
  redirect(returnTo?.startsWith('/admin') ? returnTo : '/admin')
}
