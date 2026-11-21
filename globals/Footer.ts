import { backgroundColor } from '../fields/backgroundColor'
import { approvedStaff } from '../lib/staffAccess'
import type { GlobalConfig } from 'payload'

// Site-wide footer shown on every public page. Edited once under Globals → Footer in the admin.
// Logo and Donate are optional and set separately from the Header's.
export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    update: approvedStaff,
    read: () => true, // the public site needs to read it
  },
  fields: [
    {
      name: 'logo', // Optional. Shown on the left; hidden when empty.
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'donate', // Optional button under the logo. Hidden until a URL is filled in.
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
        {
          // Same color picker and brand palette as the header button. Blank keeps the default teal.
          ...backgroundColor,
          name: 'color',
          admin: {
            ...backgroundColor.admin,
            description: 'Optional button color. Blank keeps the default teal. Text turns white on dark colors.',
          },
        },
      ],
    },
    {
      name: 'columns', // Groups of links, e.g. About us, Leadership, Knowledge Hub
      type: 'array',
      labels: { singular: 'Column', plural: 'Columns' },
      fields: [
        {
          name: 'heading', // Optional; the current design has no column titles
          type: 'text',
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
              name: 'url', // "/stories" for our pages, or a full link for other sites
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'socialsHeading', // Text above the social icons
      label: 'Social media text',
      type: 'text',
      defaultValue: 'Join the conversation, and follow us on social media!',
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
      name: 'contactLabel', // Text before the email link
      label: 'Email text',
      type: 'text',
      defaultValue: 'Questions? Email us at',
    },
    {
      name: 'contactEmail',
      type: 'email',
      defaultValue: 'info@nest360.org',
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: '© NEST360. All rights reserved.',
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
