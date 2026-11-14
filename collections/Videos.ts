import type { CollectionConfig } from 'payload'

// Video files. Downloadable files go in Documents, images in Media.
export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'filename',
  },
  // Public can read; creating, editing and deleting require login (Payload's default)
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['video/mp4'],
  },
  fields: [],
}
