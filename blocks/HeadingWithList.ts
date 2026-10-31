 import type { Block } from 'payload'

  // A heading followed by a list of items
  export const HeadingWithList: Block = {
    slug: 'headingWithList',
    interfaceName: 'HeadingWithListBlock',
    labels: { singular: 'Heading with list', plural: 'Headings with lists' },
    fields: [
      { name: 'heading', type: 'text', required: true },
      { name: 'intro', type: 'textarea' },
      {
        name: 'items',
        type: 'array',
        minRows: 1,
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'textarea' },
        ],
      },
    ],
  }
