import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

// cache: the page and its metadata both ask for the same page, so look it up once per request
export const getPageBySlug = cache(async (slug: string) => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        depth: 2, // keep your current depth; blocks with images or links need it
        limit: 1,
        draft,                 // latest draft in preview
        overrideAccess: draft, // drafts only after the preview route checked login; otherwise publishedOrLoggedIn applies
    })
    return docs[0] ?? null
})

// The header and footer globals, read once per request by the shared layout
export const getHeader = cache(async () => {
    const payload = await getPayload({ config })
    return payload.findGlobal({ slug: 'header', depth: 1 }) // depth 1 fills in the logo
})

export const getFooter = cache(async () => {
    const payload = await getPayload({ config })
    return payload.findGlobal({ slug: 'footer' })
})
