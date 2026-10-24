import config from '@payload-config'
import { cookies, draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

//An API route that verifies the preview secret, authenticates the user, and enters draft mode
export async function GET(req: Request): Promise<Response> {
    const { searchParams } = new URL(req.url)
    const path = searchParams.get('path')
    if (searchParams.get('previewSecret') !== process.env.PREVIEW_SECRET || !path?.startsWith('/')) {
      return new Response('You are not allowed to preview this page', { status: 403 })
    }
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) return new Response('You are not allowed to preview this page', { status: 403 })

    ;(await draftMode()).enable()

    // Remember where to go on "Exit preview". 
    const returnTo = searchParams.get('returnTo')
    if (returnTo?.startsWith('/admin')) {
      ;(await cookies()).set('preview-return-to', returnTo, { httpOnly: true, sameSite: 'lax', path: '/' })
    }
    redirect(path)
}

