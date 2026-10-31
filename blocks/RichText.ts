import type { Block } from "payload";

//Plain section of formatted test
export const RichText: Block = {
    //block name
    slug: 'richTest', 
    //the name of the generated TS type
    interfaceName: 'RichTextBlock', 
    labels: { singular: 'Text', plural: 'Text sections'},
    //the boxes the editor fills in
    fields: [
        { name: 'content', type: 'richText', required: true },
    ],
}
