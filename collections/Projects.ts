import { staffWrites } from '../lib/staffAccess'
import type { CollectionConfig } from 'payload'

import { resourceGroupsField, slugField } from '../fields/resourceGroups'

// One resources/project page, shown at /resources/<slug> (app/(frontend)/resources/[slug]/page.tsx),
// e.g. /resources/clinical-job-aids.
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
    ...staffWrites,
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField,
    // Same values as ResourceCategory in app/(frontend)/resources/types.ts
    {
      name: 'category',
      type: 'select',
      label: 'Audience',
      required: true,
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
      label: 'How should the resources be shown?',
      required: true,
      defaultValue: 'list',
      options: [
        { label: 'One list, each resource with its preview', value: 'list' },
        { label: 'Titled groups of plain links (like Clinical Job Aids)', value: 'groups' },
      ],
    },
    resourceGroupsField({
      titles: 'groupsLayout',
      required: true,
      description:
        'With the "one list" layout, add one group: its title and description are not shown, and every group\'s resources form the list.',
    }),
    // No "Download all" upload: the page's Download all button zips every file it lists
    // (app/(frontend)/resources/[slug]/download/route.ts)
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
