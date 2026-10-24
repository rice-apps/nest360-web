import type { CollectionConfig } from 'payload'

// PDFs such as job aids, care modules and guides
export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
  },
  // Public can read; creating, editing and deleting require login (Payload's default)
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['application/pdf'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}
