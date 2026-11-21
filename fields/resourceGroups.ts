import type { ArrayField, FieldHook, TextField } from 'payload'

// Fields shared by Projects and Technologies: both are pages that list entries from the Resources collection
// instead of holding files themselves, so the same resource can appear on several pages.

// Fills the slug in from the title when it's left blank, e.g. "Syringe Pump" -> "syringe-pump"
const slugFromTitle: FieldHook = ({ value, data }) =>
  value ||
  data?.title
    ?.toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const slugField: TextField = {
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
    beforeValidate: [slugFromTitle],
  },
}

type ResourceGroupsOptions = {
  // 'always': every group needs a title (technology pages show each group as its own section).
  // 'groupsLayout': only when the page's layout is "groups" (project pages can show one untitled list).
  titles: 'always' | 'groupsLayout'
  // At least one group. Technologies can be saved before any resources exist.
  required: boolean
  description?: string
}

// Titled groups of resources, each row a link to a Resources entry plus a per-page "new" flag
export function resourceGroupsField({ titles, required, description }: ResourceGroupsOptions): ArrayField {
  return {
    name: 'resourceGroups',
    type: 'array',
    label: 'Resource Groups',
    required,
    minRows: required ? 1 : undefined,
    labels: {
      singular: 'Resource Group',
      plural: 'Resource Groups',
    },
    admin: { description },
    fields: [
      {
        name: 'title',
        type: 'text',
        admin: {
          description:
            titles === 'always'
              ? 'For example "Training materials", "Training videos" or "Qualification documents".'
              : 'For example "Bubble CPAP". Required for the titled-groups layout.',
        },
        validate: (value: unknown, { data }: { data: { layout?: string } }) => {
          if (value) return true
          if (titles === 'always') return 'Each group needs a title.'
          return data?.layout === 'groups' ? 'Each group needs a title in the titled-groups layout.' : true
        },
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
  }
}
