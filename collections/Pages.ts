import { staffWrites } from '../lib/staffAccess'
import type { CollectionConfig } from 'payload'

import { pageBlocks } from '../blocks'
import { livePreviewFor, previewFor, publishedOrLoggedIn } from '../lib/preview'

// URLs that already belong to a fixed route, so a page with one of these slugs would never be shown.
// Add to this list when adding a new folder under app/(frontend)/ or app/(payload)/.
const RESERVED_SLUGS = ['admin', 'api', 'preview', 'exit-preview', 'resources', 'stories']

const toPath = (slug: string) => `/${slug}`

// A simple page that staff build from blocks, such as What We Do or Jobs. Shown at /<slug>.
// The header and footer come from the Header and Footer globals, so every page shares them.
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    preview: previewFor('pages', toPath),
    livePreview: livePreviewFor('pages', toPath),
  },

  // Staff see drafts and published pages; the public only sees published ones
  access: {
    ...staffWrites,
    read: publishedOrLoggedIn,
  },

  versions: {
    drafts: { autosave: { interval: 800 } },
    maxPerDoc: 50,
  },

  fields: [
    {
      name: 'title', // Page name, shown as the main heading, e.g. "Careers at NEST360"
      type: 'text',
      required: true,
    },
    {
      name: 'slug', // The page's URL, e.g. "what-we-do" for nest360.org/what-we-do
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Used in the URL, e.g. what-we-do. Filled in from the title if left blank.',
      },
      // Not required on purpose: the admin checks required fields before this hook runs,
      // so a required slug would block Publish whenever it was left blank
      // Runs after the hook below fills in a blank slug
      validate: (value: string | null | undefined) =>
        !value || !RESERVED_SLUGS.includes(value) ||
        `"${value}" is already used by another part of the site. Pick a different slug.`,
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
    { name: 'intro', type: 'richText' }, // from resources-search
    {
      name: 'layout', // The page body: sections stacked in any order
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: pageBlocks,
    },
    {
      name: 'countries', // from resources-search
      type: 'array',
      labels: { singular: 'Country', plural: 'Countries' },
      admin: { initCollapsed: true },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'link',
          type: 'text',
          admin: { description: 'Optional. Internal path (e.g. /countries/kenya) or full URL.' },
        },
      ],
    },
    {
      name: 'description', // Shown in Google results and link previews
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'One or two sentences for search results. Keep under about 160 characters.',
      },
    },
  ],
}