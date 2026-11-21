import type { CollectionConfig } from 'payload'

import { resourceGroupsField, slugField } from '../fields/resourceGroups'
import { staffWrites } from '../lib/staffAccess'
import { TECHNOLOGY_CATEGORIES } from '../lib/technologyCategories'

const httpsUrl = (value: unknown) =>
  !value || (typeof value === 'string' && /^https?:\/\//.test(value)) ? true : 'Enter a full web address, starting with https://'

// One kind of NEST360 Qualified Technology, e.g. "Syringe Pump", shown as a card on /technology and as its
// own page at /technology/<slug> (app/(frontend)/technology/[slug]/page.tsx).
// Built like a project page (collections/Projects.ts): it doesn't hold files, its resourceGroups link to
// entries in the Resources collection, so a training video or clinical module is saved once and can be listed
// on both a technology page and a project page. What it adds is the device information and the list of
// qualified products, each with its regulatory and power details.
export const Technologies: CollectionConfig = {
  slug: 'technologies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'categoryOfCare', 'updatedAt'],
    group: 'Content',
    description: 'NEST360 Qualified Technologies, shown in the gallery at /technology.',
  },
  // Public can read; only approved staff can create, edit and delete
  access: {
    ...staffWrites,
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The kind of device, e.g. "Syringe Pump" or "CPAP".',
      },
    },
    slugField,
    {
      name: 'categoryOfCare',
      type: 'select',
      label: 'Category of care',
      required: true,
      index: true,
      options: TECHNOLOGY_CATEGORIES.map(({ value, label }) => ({ value, label })),
      admin: {
        position: 'sidebar',
        description: 'Groups the technology in the gallery and is shown on its page.',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Shown on the gallery card and at the top of the page. Falls back to the first product’s photo.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'About the device',
      required: true,
      admin: {
        description: 'What the device does and who it helps. The first sentence is also used in search results.',
      },
    },
    {
      name: 'qualifiedProducts',
      type: 'array',
      label: 'NEST360 Qualified Products',
      labels: {
        singular: 'Qualified Product',
        plural: 'Qualified Products',
      },
      admin: {
        description: 'Each manufacturer’s model that passed NEST360 qualification. Listed on the gallery card and the page.',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: { description: 'Manufacturer and model, e.g. "Mindray BeneFusion SP3".', width: '60%' },
            },
            {
              name: 'regulation',
              type: 'text',
              admin: { description: 'e.g. "CE Mark, ISO 13485".', width: '40%' },
            },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'price',
          type: 'textarea',
          admin: { description: 'e.g. "Price optimized for low-resource settings."' },
        },
        {
          name: 'consumables',
          type: 'textarea',
          label: 'Consumables required',
          admin: { description: 'One per line, e.g. "Any brand syringe 5-60cc".' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'powerSource',
              type: 'text',
              admin: { description: 'e.g. "Battery or Mains power".', width: '34%' },
            },
            {
              name: 'voltage',
              type: 'text',
              admin: { description: 'e.g. "230 V 50 Hz".', width: '33%' },
            },
            {
              name: 'warranty',
              type: 'text',
              admin: { description: 'e.g. "2 years".', width: '33%' },
            },
          ],
        },
        {
          name: 'productUrl',
          type: 'text',
          label: 'Manufacturer’s product page',
          validate: httpsUrl,
        },
      ],
    },
    resourceGroupsField({
      titles: 'always',
      required: false,
      description:
        'Resources about this device, e.g. "Training materials", "Training videos" and "Qualification documents". Add the resources themselves under Resources first.',
    }),
    {
      name: 'purchaseUrl',
      type: 'text',
      label: 'Purchase link',
      defaultValue: 'https://www.hatch-tech.org/',
      validate: httpsUrl,
      admin: {
        position: 'sidebar',
        description: 'Where the "Purchase NEST360 Qualified Products" button goes. Leave blank to hide it.',
      },
    },
  ],
}
