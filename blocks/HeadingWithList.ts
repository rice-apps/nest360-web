import type { Block } from 'payload'
import {backgroundColor} from '../fields/backgroundColor'


// A heading, an optional intro, then a list of items (e.g. the pillars on What We Do)
export const HeadingWithList: Block = {
  slug: 'headingWithList',
  interfaceName: 'HeadingWithListBlock',
  labels: { singular: 'Heading with list', plural: 'Headings with lists' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'intro', // Optional text between the heading and the list
      type: 'textarea',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
    backgroundColor,
  ],
}
