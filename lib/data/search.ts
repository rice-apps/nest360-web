import config from '@payload-config'
import { getPayload, type Where } from 'payload'

export type SearchOptions = {
  // Words to look for in the title, the text, or a tag's name. All words must appear (Payload's `like`).
  query?: string
  // Only results with at least one of these tags (tag slugs, e.g. from a filter in the URL)
  tags?: string[]
  // Only these kinds of results
  collections?: ('resources' | 'projects' | 'articles')[]
  limit?: number
}

// Searches published resources, projects and articles (the index kept by the search plugin, see
// lib/searchIndex.ts). Each result has its title, slug, summary, kind (doc.relationTo) and tags.
export async function search({ query = '', tags = [], collections = [], limit = 20 }: SearchOptions = {}) {
  const payload = await getPayload({ config })
  const words = query.trim()

  // Tags are matched by their current name, so renaming a tag needs no re-indexing
  const tagIdsWhere = async (where: Where) =>
    (await payload.find({ collection: 'tags', where, depth: 0, limit: 100, select: {} })).docs.map((tag) => tag.id)

  const conditions: Where[] = []
  if (words) {
    const tagsNamed = await tagIdsWhere({ name: { like: words } })
    conditions.push({
      or: [
        { title: { like: words } },
        { content: { like: words } },
        ...(tagsNamed.length ? [{ tags: { in: tagsNamed } }] : []),
      ],
    })
  }
  if (tags.length) {
    conditions.push({ tags: { in: await tagIdsWhere({ slug: { in: tags } }) } })
  }
  if (collections.length) {
    // `in` isn't supported on doc.relationTo, so match each kind separately
    conditions.push({ or: collections.map((collection) => ({ 'doc.relationTo': { equals: collection } })) })
  }

  const { docs } = await payload.find({
    collection: 'search',
    where: { and: conditions },
    sort: '-priority',
    limit,
    depth: 1,
    overrideAccess: false,
    select: { title: true, slug: true, summary: true, doc: true, tags: true },
    populate: { tags: { name: true, slug: true } },
  })
  return docs
}
