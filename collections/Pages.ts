import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'e.g. where-we-work' },
    },
    { name: 'intro', type: 'richText' },
    {
      name: 'countries',
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
  ],
}