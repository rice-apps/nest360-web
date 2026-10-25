import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'usedFor'],
  },
  // Public can read; creating, editing and deleting require login (Payload's default)
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      // Keeps page tags and file tags apart: each tag field only offers tags meant for it
      name: 'usedFor',
      type: 'radio',
      label: 'Use this tag for',
      required: true,
      defaultValue: 'pages',
      options: [
        { label: 'Pages', value: 'pages' },
        { label: 'Files', value: 'files' },
        { label: 'Both pages and files', value: 'both' },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Used in URLs. Filled in from the name if left blank.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) =>
            value ||
            data?.name
              ?.toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, ''),
        ],
      },
    },
  ],
}
