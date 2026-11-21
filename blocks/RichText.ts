import type { Block } from 'payload'
import {backgroundColor} from '../fields/backgroundColor'

// A section of formatted text: headings, paragraphs, links, lists
export const RichText: Block = {
  slug: 'richText', // saved on each section as blockType, so the frontend knows which component to draw
  interfaceName: 'RichTextBlock', // name of the generated TypeScript type
  labels: { singular: 'Text', plural: 'Text sections' }, // names shown in the "Add block" menu
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    backgroundColor, // The backgroundColor option
    
  ],
}
