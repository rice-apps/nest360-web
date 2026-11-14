import { staffWrites } from '../lib/staffAccess'

import type { CollectionConfig } from 'payload'

import { livePreviewFor, previewFor, publishedOrLoggedIn } from '../lib/preview'

const toPath = (slug: string) => `/stories/${slug}`

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedDate', '_status'],
    preview: previewFor('articles', toPath),
    livePreview: livePreviewFor('articles', toPath),
  },

  // Staff see drafts and published articles; the public only sees published ones
  access: {
    ...staffWrites,
    read: publishedOrLoggedIn,
  },
  
  versions: {
    drafts: {
      // Saves a draft shortly after each edit, which is what refreshes the Live Preview pane
      autosave: { interval: 800 },
    },
    maxPerDoc: 50, // autosave creates many versions; keep the newest 50
  },

fields: [
    {
        name: 'title',
        type: 'text',
        required: true,
    },
    {
      name: 'slug', // The URL-friendly version of the title, e.g. "neonatal-nurse-training"
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Used in URLs. Filled in from the title if left blank.',
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
    {
      name: 'publishedDate', // The date the article was published. Used for sorting and filtering.
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM d, yyyy', // e.g. "Sep 17, 2026", matching the stories page
        },
      },
    },
    {
      // Who wrote the article, picked from the Authors collection (labelled "Authors" in the admin).
      // Named byline because `authors` is still taken by the old embedded list below.
      name: 'byline',
      label: 'Authors',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: true,
      admin: {
        description: 'Pick existing authors, or create a new one with the + button. Drag to reorder.',
      },
    },
    {
      // The old embedded author list (name and role typed into each article). Kept unchanged so its
      // database tables and data stay as they are, but hidden from editors. The add_authors migration
      // copies it into Authors and byline. Remove it in a later PR, once that migration has run everywhere.
      name: 'authors',
      label: 'Authors (old)',
      type: 'array',
      admin: {
        hidden: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
        },
      ],
    },
    {
      name: 'tags', // The tags related to a specific article card.
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featuredImage', // The featured image that appears in each article 
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Shown on the article card and at the top of the article.',
      },
    },
    {
      name: 'excerpt', // The description that appears on each card
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short summary that is shown on article cards.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'attachments',
      type: 'upload',
      relationTo: 'documents',
      hasMany: true,
      admin: {
        description: 'PDFs linked from the article, if any.',
      },
    },
// Search results and link previews (WhatsApp, LinkedIn, etc.). All optional:
// the page falls back to the title, excerpt and featured image when blank.
    {
      name: 'meta',
      type: 'group',
      label: 'Search & Sharing',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Title shown in Google and link previews. Keep under about 60 characters.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'One or two sentences shown under the title. Keep under about 160 characters.',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Image shown when the link is shared. Wide images (1200×630) work best.',
          },
        },
      ],
    },
  ],
}