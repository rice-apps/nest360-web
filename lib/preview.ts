//Shared helper for collections 
import type { Access, CollectionAdminOptions } from 'payload'

// Builds the admin "Preview" button URL. Hidden until the doc has a slug.
export const previewFor = (
    collection: string,
    toPath: (slug: string) => string,
): NonNullable<CollectionAdminOptions['preview']> =>
    (doc) => {
        if (typeof doc?.slug !== 'string' || !doc.slug) return null
        const params = new URLSearchParams({
            path: toPath(doc.slug),
            // Save the doc's edit page so "Exit preview" can send the admin back to it
            returnTo: doc.id ? `/admin/collections/${collection}/${doc.id}` : `/admin/collections/${collection}`,
            previewSecret: process.env.PREVIEW_SECRET || '',
        })
        return `/preview?${params.toString()}`
    }

// Only logged-in admins can see drafts
export const publishedOrLoggedIn: Access = ({ req }) =>
    req.user ? true : { _status: { equals: 'published' } }


