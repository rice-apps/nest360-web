import type { GlobalConfig } from 'payload'

// Site-wide footer shown on every public page. Edited once under Globals → Footer in the admin.
// Basic structure for now; logos, a newsletter signup and other design details can be added later.
export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true, // the public site needs to read it
  },
  fields: [
    {
      name: 'columns', // Groups of links, e.g. "Who We Are" → About, Leadership, Careers
      type: 'array',
      labels: { singular: 'Column', plural: 'Columns' },
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: ['Facebook', 'X', 'Instagram', 'LinkedIn', 'YouTube'],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'contactEmail',
      type: 'email',
      defaultValue: 'info@nest360.org',
    },
    {
      name: 'legalLinks', // Small links on the bottom line, e.g. Privacy Policy, Cookie Policy
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
