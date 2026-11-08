import type { Block } from 'payload'
import { backgroundColor } from '../fields/backgroundColor'

// A section with a required title and an optional subtitle, text and images (e.g. the Jobs page)
export const Subsection: Block = {
  slug: 'subsection',
  interfaceName: 'SubsectionBlock',
  labels: { singular: 'Subsection', plural: 'Subsections' },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle', // Smaller line under the title
      type: 'text',
    },
    {
      name: 'text', // Rich text so editors can add links, e.g. to a job posting
      type: 'richText',
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    backgroundColor, // The backgroundColor option
  ],
}
