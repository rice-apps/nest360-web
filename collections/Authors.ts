import type { CollectionConfig } from 'payload'

// A person or organization credited on articles. Entered once here and picked on each article
// (the article's "Authors" field), instead of retyping the same name in every article.
export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name', // shown in the article's author picker and in lists
    defaultColumns: ['name', 'updatedAt'],
    group: 'Content',
  },
  // Public can read (article pages and the stories gallery show authors); creating, editing and
  // deleting require login (Payload's default)
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name', // e.g. "Jane Doe" or "NEST360 Alliance"
      type: 'text',
      required: true,
      index: true, // searched by name in the admin picker
    },
    {
      name: 'photo', // Optional profile picture, from the Media (images) collection
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio', // Optional short description, e.g. job title and organization
      type: 'textarea',
      admin: {
        description: 'One or two sentences, e.g. "Neonatal Nurse, Lagos University Teaching Hospital".',
      },
    },
  ],
}
