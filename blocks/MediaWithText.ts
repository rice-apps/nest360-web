import type { Block } from 'payload'
import {backgroundColor} from '../fields/backgroundColor'


// An image beside a block of text
export const MediaWithText: Block = {
  slug: 'mediaWithText',
  interfaceName: 'MediaWithTextBlock',
  labels: { singular: 'Image with text', plural: 'Images with text' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'content', // The text shown next to the image
      type: 'richText',
      required: true,
    },
    {
      name: 'imagePosition', // Which side of the text the image sits on
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    backgroundColor,
  ],
}
