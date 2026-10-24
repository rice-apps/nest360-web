
import type { Access, CollectionConfig } from 'payload'

// Staff to see drafts and publishedarticles: 
// the public only sees published articles

const publishedOrLoggedIn: Access = ({ req: { user } }) => {
    if (user)
        return true
    return { _status: { equals: 'published' } }
}

// A NEST360 article
export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title', // must match a field name below
    defaultColumns: ['title', 'publishedDate', '_status'],
  },

  access: {
    read: publishedOrLoggedIn,
  },
  
  versions: {
    drafts: true, // adds _status plus the Save Draft and Publish buttons
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
        },
      },
    },
    {
      name: 'authors', // The author/s related to the article card.
      type: 'array',
      admin: {
        description: 'People or organizations credited on the article.',
      },
      fields: [
        {
          name: 'name', // The name of the author or organization.
          type: 'text',
          required: true,
        },
        {
          name: 'role', // The role of the author or organization.
          type: 'text',
          admin: {
            description: 'Job title or organization, e.g. "Neonatal Nurse, Lagos University Teaching Hospital".',
          },
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