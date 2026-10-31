import type { CollectionConfig } from 'payload'
import { HeadingWithList } from '../blocks/HeadingWithList'
import { MediaWithText } from '../blocks/MediaWithText'
import { RichText } from '../blocks/RichText'
/* 

Payload creator of pages, with different blocks

*/
import { previewFor, publishedOrLoggedIn } from '../lib/preview'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title', // must match a field name below
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    preview: previewFor('pages', (slug) => `/${slug}`),
  },

  access: {
    read: publishedOrLoggedIn,
  },

  versions: {
  drafts: true, // adds _status plus the Save Draft and Publish buttons
  },

  //fields: what every page has
  fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
      },
      {
        name: 'slug',
        type: 'text',
        required: true,
        unique: true,
        index: true,
        admin: {
          position: 'sidebar',
          description: 'Used in the URL, e.g. what-we-do. Filled in from the title if left blank.',
        },
        hooks: {
          beforeValidate: [
            ({ value, data }) =>
              value ||
              data?.title
                ?.toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, ''),
          ],
        },
      },

    //layout -> blocks field
    {
        name: 'layout',
        type: 'blocks', 
        blocks: [RichText,MediaWithText,HeadingWithList]
    }
  ]
    
}
