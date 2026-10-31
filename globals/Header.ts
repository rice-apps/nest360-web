import type {GlobalConfig} from 'payload'

export const Header: GlobalConfig = {
    slug: 'header',
    access: {
    read: () => true, // the public site needs to read it
  },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'menus', // e.g. "Who We Are" → About, Leadership, Contact us
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true }, // "/jobs" or a full external link
          ],
        },
      ],
    },
    { name: 'donateUrl', type: 'text' },
  ],
}
