import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

//fetch helpers that respect draft mode
export async function getArticleBySlug(slug: string) {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
        collection: 'articles',
        where: { slug: { equals: slug } },
        limit: 1,
        draft, // latest draft instead of the published version
        overrideAccess: draft, // the preview route already checked login
    })
    return docs[0] ?? null
}
