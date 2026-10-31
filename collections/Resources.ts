import type { CollectionConfig } from 'payload'

import { publishedOrLoggedIn } from '../lib/preview'

type Sibling = { resourceType?: string } | undefined

const showFor =
  (...types: string[]) =>
  (_: unknown, siblingData: Sibling) =>
    types.includes(siblingData?.resourceType ?? '')

// One file, video, outside link or publication, saved once and searchable on its own.
// Project pages don't hold resources: they list them in their resourceGroups, so one resource can
// appear on several pages, and editing it here updates every page that shows it.
export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'resourceType', 'language', 'updatedAt'],
    group: 'Content',
    description: 'Individual searchable documents, videos, links, and publications.',
  },
  // Staff see drafts and published resources; the public only sees published ones
  access: {
    read: publishedOrLoggedIn,
  },
  versions: {
    drafts: true,
  },
  fields: [
    // Basic information
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'The link text visitors see, e.g. "Canta V8-WN-NS".',
      },
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
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description: 'One or two sentences on what this is and who it is for. Used in search results.',
      },
    },

    // Resource type. Only the fields for the chosen type are shown, and hidden ones are not validated.
    {
      name: 'resourceType',
      type: 'select',
      required: true,
      index: true,
      defaultValue: 'document',
      options: [
        { label: 'Document / PDF', value: 'document' },
        { label: 'Video', value: 'video' },
        { label: 'External Link', value: 'link' },
        { label: 'Publication', value: 'publication' },
      ],
    },
    {
      name: 'document',
      type: 'upload',
      relationTo: 'documents',
      admin: {
        condition: showFor('document', 'publication'),
        description: 'The uploaded file. A publication needs this or an external URL.',
      },
      validate: (value: unknown, { siblingData }: { siblingData: Sibling & { externalUrl?: string } }) => {
        if (siblingData?.resourceType === 'document' && !value) return 'Choose or upload a file.'
        if (siblingData?.resourceType === 'publication' && !value && !siblingData.externalUrl)
          return 'A publication needs a file or an external URL.'
        return true
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        condition: showFor('video'),
        description: 'YouTube, Vimeo, or another video URL.',
      },
      validate: (value: unknown, { siblingData }: { siblingData: Sibling }) =>
        siblingData?.resourceType === 'video' && !value ? 'Enter the video URL.' : true,
    },
    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        condition: showFor('link', 'publication'),
        description: 'Full web address, starting with https://',
      },
      validate: (value: unknown, { siblingData }: { siblingData: Sibling }) =>
        siblingData?.resourceType === 'link' && !value ? 'Enter the web address.' : true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional. PDFs already get a preview of their first page; set this to use a different picture.',
      },
    },

    // Classification
    {
      name: 'language',
      type: 'select',
      required: true,
      index: true,
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
        description: 'Add relevant country, subject, and audience tags. Only tags set to be used for files are offered.',
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
        description: 'Shows a NEW badge next to the resource on project pages.',
      },
    },

    // Publication details
    {
      name: 'authors',
      type: 'text',
      admin: {
        condition: showFor('publication'),
        description: 'Author names, entered in a consistent citation format.',
      },
    },
    {
      name: 'journalOrPublisher',
      type: 'text',
      admin: {
        condition: showFor('publication'),
      },
    },
    {
      name: 'publicationDate',
      type: 'date',
      admin: {
        condition: showFor('publication'),
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMMM yyyy',
        },
      },
    },
    {
      name: 'doi',
      type: 'text',
      admin: {
        condition: showFor('publication'),
        description: 'Digital Object Identifier, if available.',
      },
    },
    {
      name: 'citation',
      type: 'textarea',
      admin: {
        condition: showFor('publication'),
        description: 'Full citation, if different from the fields above.',
      },
    },

    // The other direction of each project's resourceGroups. Read-only: nothing is stored here,
    // so adding a resource to a project is done on the project.
    {
      name: 'projects',
      type: 'join',
      collection: 'projects',
      on: 'resourceGroups.resources',
      // Payload 3.92 returns a project once per resource group it has (a join into an array repeats the
      // parent per array row), so drop the repeats. The higher limit keeps repeats from crowding real
      // projects off the first page.
      defaultLimit: 100,
      hooks: {
        afterRead: [
          ({ value }) => {
            if (!value?.docs) return value
            const seen = new Set()
            const docs = value.docs.filter((doc: number | { id: number }) => {
              const id = typeof doc === 'object' ? doc.id : doc
              return seen.has(id) ? false : (seen.add(id), true)
            })
            return { ...value, docs }
          },
        ],
      },
      admin: {
        description: 'Project pages that list this resource. Add it to a page from that project.',
      },
    },
  ],
}
