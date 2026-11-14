import type { CollectionConfig } from 'payload'

import { staffWrites } from '../lib/staffAccess'

// Small reusable graphics such as section icons and symbols. Photos and logos go in Media.
export const Icons: CollectionConfig = {
  slug: 'icons',
  admin: {
    useAsTitle: 'filename',
  },
  // Public can read; creating, editing and deleting require login (Payload's default)
  access: {
    ...staffWrites,
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/svg+xml', 'image/png'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the icon for screen readers.',
      },
    },
  ],
}
