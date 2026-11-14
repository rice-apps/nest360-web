import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

//fetch helpers that respect draft mode
// cache: the page and its metadata both ask for the same article, so look it up once per request
export const getArticleBySlug = cache(async (slug: string) => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
        collection: 'articles',
        where: { slug: { equals: slug } },
        depth: 2, // fills in tags, images, attachments and authors, plus each author's photo
        limit: 1,
        draft, // latest draft instead of the published version
        overrideAccess: draft, // the preview route already checked login
    })
    return docs[0] ?? null
})

// Every published article for the /stories gallery, newest first. Drafts never appear: there's no draft
// option here, and overrideAccess: false applies the public read rule (published only).
export async function getPublishedArticles() {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
        collection: 'articles',
        where: { _status: { equals: 'published' } },
        sort: '-publishedDate',
        depth: 1, // fills in the featured image, tags and authors for the cards
        pagination: false, // all of them, not just the first page of 10
        overrideAccess: false,
    })
    return docs
}
