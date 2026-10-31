import type {GlobalConfig} from 'payload'

export const Footer: GlobalConfig = {
    slug: 'footer',
    access: {
    read: () => true,
  },
  fields: [
    {
      name: 'links', // About us, Leadership, Careers, ...
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
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
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'contactEmail', type: 'email', defaultValue: 'info@nest360.org' },
  ],
}
