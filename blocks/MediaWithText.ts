import type { Block } from "payload";

//Image + a block of text
export const MediaWithText: Block = {
    slug: 'mediaWithText', 
    interfaceName: 'MediaWithTextBlock',
    labels: { singular: 'Image with text', plural: 'Images with text'},
    fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'content', type: 'richText', required: true },
        {
            name: 'imagePosition',
            type: 'select',
            defaultValue: 'left',
            options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
            ],
        },
    ],
  }
