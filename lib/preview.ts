// Shared helper for collections
import type { Access, CollectionAdminOptions } from 'payload'
import { isApprovedStaff } from './staffAccess'

type PreviewDoc = { id?: number | string; slug?: unknown } | null | undefined

// One URL for the Preview button and the Live Preview iframe. Null until the doc has a slug.
function previewPath(collection: string, toPath: (slug: string) => string, doc: PreviewDoc) {
    if (typeof doc?.slug !== 'string' || !doc.slug) return null
    const params = new URLSearchParams({
        path: toPath(doc.slug),
        // Save the doc's edit page so "Exit preview" can send the admin back to it
        returnTo: doc.id ? `/admin/collections/${collection}/${doc.id}` : `/admin/collections/${collection}`,
        previewSecret: process.env.PREVIEW_SECRET || '',
    })
    return `/preview?${params.toString()}`
}

// Builds the admin "Preview" button URL (opens a new tab)
export const previewFor = (
    collection: string,
    toPath: (slug: string) => string,
): NonNullable<CollectionAdminOptions['preview']> =>
    (doc) => previewPath(collection, toPath, doc)

// Builds the "Live Preview" pane URL (iframe beside the editor). Hidden while there's no slug.
export const livePreviewFor = (
    collection: string,
    toPath: (slug: string) => string,
): CollectionAdminOptions['livePreview'] => ({
    url: ({ data }) => previewPath(collection, toPath, data),
})

// Only logged-in admins can see drafts
export const publishedOrLoggedIn: Access = ({ req }) =>
    isApprovedStaff(req.user) ? true : { _status: { equals: 'published' } }


