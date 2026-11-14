import config from '@payload-config'
import { canPreviewDrafts } from '../draftAccess'
import { getPayload } from 'payload'
import { cache } from 'react'

//fetch helpers that respect draft mode
// cache: the page and its metadata both ask for the same article, so look it up once per request
export const getArticleBySlug = cache(async (slug: string) => {
    const payload = await getPayload({ config })
    const draft = await canPreviewDrafts(payload)

    const { docs } = await payload.find({
        collection: 'articles',
        where: { slug: { equals: slug } },
        depth: 1, // fills in tags, images and attachments
        limit: 1,
        draft, // latest draft instead of the published version
        overrideAccess: draft, // the preview route already checked login
    })
    return docs[0] ?? null
})
