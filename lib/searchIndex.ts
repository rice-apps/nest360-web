// Site search, built on Payload's search plugin (https://payloadcms.com/docs/plugins/search).
// The plugin keeps a `search` collection with one entry per published resource, project and article,
// and updates it whenever one of those is saved. Drafts are never added, and unpublishing removes the entry.
// Each entry stores the text to search (`content`) and links to the document's tags, so a search can match
// words in the text or a tag's name. lib/data/search.ts runs the searches.
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import type { SearchPluginConfig } from '@payloadcms/plugin-search/types'

type Relation = number | { id: number } | null | undefined

const idOf = (value: Relation) => (value && typeof value === 'object' ? value.id : value)
const ids = (values: Relation[] | null | undefined) => (values ?? []).map(idOf).filter((id) => id != null)
const plainText = (richText: unknown) =>
  richText ? convertLexicalToPlaintext({ data: richText as Parameters<typeof convertLexicalToPlaintext>[0]['data'] }) : ''
const joinText = (...parts: (string | null | undefined)[]) => parts.filter(Boolean).join('\n')
const shorten = (text: string, length = 200) => (text.length > length ? `${text.slice(0, length).trimEnd()}…` : text)

export const searchPluginConfig: SearchPluginConfig = {
  collections: ['resources', 'projects', 'articles'],
  // Drafts are left out, and a document that is unpublished is removed (both are the plugin's defaults,
  // stated here because the task depends on them)
  syncDrafts: false,
  deleteDrafts: true,
  searchOverrides: {
    admin: { group: 'Content' },
    fields: ({ defaultFields }) => [
      ...defaultFields,
      {
        name: 'slug',
        type: 'text',
        admin: { readOnly: true },
      },
      {
        name: 'summary',
        type: 'textarea',
        admin: { readOnly: true, description: 'Short text to show in search results.' },
      },
      {
        name: 'content',
        type: 'textarea',
        admin: { readOnly: true, description: 'All the searchable text from the document.' },
      },
      {
        name: 'tags',
        type: 'relationship',
        relationTo: 'tags',
        hasMany: true,
        index: true,
        admin: { readOnly: true },
      },
    ],
  },
  // Copies the searchable text and tags from each document into its search entry
  beforeSync: ({ originalDoc: doc, searchDoc, collectionSlug }) => {
    const base = { ...searchDoc, slug: doc.slug }

    if (collectionSlug === 'resources') {
      return {
        ...base,
        summary: doc.summary,
        content: joinText(doc.title, doc.summary, doc.authors, doc.journalOrPublisher, doc.doi, doc.citation),
        tags: ids(doc.tags),
      }
    }

    if (collectionSlug === 'projects') {
      const description = plainText(doc.description)
      const groups = (doc.resourceGroups ?? []) as { title?: string; description?: string }[]
      return {
        ...base,
        summary: shorten(description),
        content: joinText(
          doc.title,
          description,
          doc.citation,
          ...groups.flatMap((group) => [group.title, group.description]),
        ),
        tags: ids([doc.tag]),
      }
    }

    // articles
    const authors = (doc.authors ?? []) as { name?: string }[]
    return {
      ...base,
      summary: doc.excerpt,
      content: joinText(doc.title, doc.excerpt, plainText(doc.content), ...authors.map((author) => author.name)),
      tags: ids(doc.tags),
    }
  },
}
