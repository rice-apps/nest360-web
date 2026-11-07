import type { GlobalConfig } from 'payload'

// Site-wide header shown on every public page. Edited once under Globals → Header in the admin.
export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true, // the public site needs to read it
  },
  fields: [
    {
      name: 'logo', // Shown on the left and links to the homepage. Falls back to "NEST360" text.
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'navItems', // Top-level menu, e.g. "Who We Are", "What We Do"
      type: 'array',
      labels: { singular: 'Menu item', plural: 'Menu items' },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url', // Leave blank if the item only opens its dropdown
          type: 'text',
        },
        {
          name: 'children', // Links in this item's dropdown, e.g. About, Leadership
          type: 'array',
          labels: { singular: 'Dropdown link', plural: 'Dropdown links' },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'url', // "/about" for our pages, or a full link for other sites
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'donate', // The button on the right. Hidden until a URL is filled in.
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Donate',
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
  ],
}
