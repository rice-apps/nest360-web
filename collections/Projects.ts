import type { CollectionConfig } from 'payload'

// One resources/project page, e.g. nest360.org/project/clinical-job-aids.
// The page doesn't hold files: its resourceGroups link to entries in the Resources collection, so the
// same resource can be on several pages. `layout` picks how they're shown: one plain list (each with its
// preview) or titled groups. File previews live on Documents, made automatically from each PDF's first page.
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
      label: 'How should the resources be shown?',
      required: true,
      defaultValue: 'list',
      options: [
        { label: 'One list, each resource with its preview', value: 'list' },
        { label: 'Titled groups of plain links (like Clinical Job Aids)', value: 'groups' },
      ],
    },
    {
      name: 'resourceGroups',
      type: 'array',
      label: 'Resource Groups',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Resource Group',
        plural: 'Resource Groups',
      },
      admin: {
        description:
          'With the "one list" layout, add one group: its title and description are not shown, and every group\'s resources form the list.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'For example "Bubble CPAP". Required for the titled-groups layout.',
          },
          // Only titled groups show their title
          validate: (value: unknown, { data }: { data: { layout?: string } }) =>
            data?.layout === 'groups' && !value ? 'Each group needs a title in the titled-groups layout.' : true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          // One row per resource, so "new" can differ between groups and pages
          name: 'resources',
          type: 'array',
          required: true,
          minRows: 1,
          labels: {
            singular: 'Resource',
            plural: 'Resources',
          },
          admin: {
            description: 'Choose resources for this group. Drag rows to set the display order.',
          },
          fields: [
            {
              name: 'resource',
              type: 'relationship',
              relationTo: 'resources',
              required: true,
              admin: {
                allowCreate: false,
              },
            },
            {
              name: 'isNew',
              type: 'checkbox',
              label: 'Mark as new',
              defaultValue: false,
              admin: {
                description: 'Shows a NEW badge next to this resource in this group only.',
              },
            },
          ],
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
