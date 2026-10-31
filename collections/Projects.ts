import type { CollectionConfig, Field } from 'payload'

// One file, video or outside link on a page. Used in the plain list and inside each group.
const fileFields: Field[] = [
  {
    name: 'label',
    type: 'text',
    required: true,
    admin: {
      description: 'The link text visitors see, e.g. "Canta V8-WN-NS".',
    },
  },
  {
    name: 'kind',
    type: 'select',
    required: true,
    defaultValue: 'file',
    options: [
      { label: 'File', value: 'file' },
      { label: 'Video', value: 'video' },
      { label: 'Outside link', value: 'link' },
    ],
  },
  // Only the field matching `kind` is shown, and hidden fields are not validated
  {
    name: 'file',
    type: 'upload',
    relationTo: 'documents',
    required: true,
    admin: {
      condition: (_, siblingData) => siblingData?.kind === 'file',
    },
  },
  {
    name: 'videoUrl',
    type: 'text',
    required: true,
    admin: {
      condition: (_, siblingData) => siblingData?.kind === 'video',
      description: 'Vimeo or YouTube link.',
    },
  },
  {
    name: 'url',
    type: 'text',
    required: true,
    admin: {
      condition: (_, siblingData) => siblingData?.kind === 'link',
      description: 'Full web address, starting with https://',
    },
  },
  {
    name: 'language',
    type: 'select',
    required: true,
    defaultValue: 'en',
    options: [
      { label: 'English', value: 'en' },
      { label: 'French', value: 'fr' },
      { label: 'Portuguese', value: 'pt' },
      { label: 'Swahili', value: 'sw' },
    ],
  },
  {
    name: 'tags',
    type: 'relationship',
    relationTo: 'tags',
    hasMany: true,
    admin: {
      description: 'Only tags set to be used for files are offered.',
    },
    // Offers only file tags, and rejects others on save
    filterOptions: { usedFor: { in: ['files', 'both'] } },
  },
  {
    name: 'isNew',
    type: 'checkbox',
    label: 'Mark as new',
    defaultValue: false,
    admin: {
      description: 'Shows a NEW badge next to the file.',
    },
  },
]

// One resources/project page, e.g. nest360.org/project/clinical-job-aids.
// Files are either one plain list (each shown with its preview) or sorted into titled groups.
// File previews live on the Documents collection, made automatically from each PDF's first page.
export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  // Public can read; creating, editing and deleting require login (Payload's default)
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Used in URLs. Filled in from the title if left blank.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) =>
            value ||
            data?.title
              ?.toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, ''),
        ],
      },
    },
    // Same values as ResourceCategory in app/(frontend)/resources/types.ts
    {
      name: 'category',
      type: 'select',
      label: 'Audience',
      required: true,
      defaultValue: 'healthcare',
      options: [
        { label: 'Healthcare professionals & BMETs', value: 'healthcare' },
        { label: 'Innovators & manufacturers', value: 'innovators' },
        { label: 'Implementors', value: 'implementors' },
        { label: 'Families', value: 'families' },
        { label: 'Dashboards', value: 'dashboards' },
      ],
      admin: {
        position: 'sidebar',
        description: 'The section of the resource library this page’s card appears in.',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Shown on this page’s card in the resource library.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'tag',
      type: 'relationship',
      relationTo: 'tags',
      required: true,
      admin: {
        description: 'One tag for the whole page. Only tags set to be used for pages are offered.',
      },
      // Offers only page tags, and rejects others on save
      filterOptions: { usedFor: { in: ['pages', 'both'] } },
    },
    {
      name: 'layout',
      type: 'radio',
      label: 'How should the files be shown?',
      required: true,
      defaultValue: 'list',
      options: [
        { label: 'One list, each file with its preview', value: 'list' },
        { label: 'Titled groups of plain links (like Clinical Job Aids)', value: 'groups' },
      ],
    },
    // Only the section matching `layout` is shown, and the hidden one is not validated
    {
      name: 'files',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'File',
        plural: 'Files',
      },
      admin: {
        condition: (data) => data?.layout === 'list',
      },
      fields: fileFields,
    },
    {
      name: 'fileGroups',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'File group',
        plural: 'File groups',
      },
      admin: {
        condition: (data) => data?.layout === 'groups',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'For example "Bubble CPAP".',
          },
        },
        {
          name: 'files',
          type: 'array',
          required: true,
          minRows: 1,
          labels: {
            singular: 'File',
            plural: 'Files',
          },
          fields: fileFields,
        },
      ],
    },
    {
      name: 'downloadAll',
      type: 'upload',
      relationTo: 'documents',
      admin: {
        description: 'Optional single file that combines everything on the page.',
      },
    },
    {
      name: 'citation',
      type: 'textarea',
      admin: {
        description: 'How to cite these materials, if the page needs it.',
      },
    },
    {
      name: 'relatedProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      admin: {
        description: 'Other project pages to link to, e.g. a device page linking to Clinical Job Aids.',
      },
    },
  ],
}
