import type { CollectionConfig } from 'payload'

// Images only. PDFs go in Documents.
export const Media: CollectionConfig = {
  slug: 'media',
  // Public can read; creating, editing and deleting require login (Payload's default)
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/*'],
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image for screen readers and slow connections.',
      },
    },
  ],
}
