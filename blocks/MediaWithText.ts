import type { Block } from "payload";

//Image + a block of text
export const MediaWithText: Block = {
    slug: 'mediaWithText', 
<<<<<<< HEAD
    interfaceName: 'MediaWithTextBlock', 
=======
    interfaceName: 'MediaWithTextBlock',
>>>>>>> 7acaba96e52c4532c07055937cee9449e0e78212
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
