import type { CollectionConfig } from 'payload'

import { previewFor, publishedOrLoggedIn } from '../lib/preview'

//for testing rn, replace with real one later
export const Articles: CollectionConfig = {
    slug: 'articles',
    admin: {
        useAsTitle: 'title',
        preview: previewFor('articles', (slug) => `/stories/${slug}`),
    },
    versions: {
        drafts: true,
    },
    access: {
        read: publishedOrLoggedIn,
    },
    fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true, index: true },
    ],
}
