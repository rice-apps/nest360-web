import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { Payload } from 'payload'

import type { Project } from '../../payload-types'

type SourceResource = {
  title: string
  group: string
  language: 'en' | 'pt'
  documentType: 'clinical-aid' | 'other'
  fileUrl: string
  file: string
  sha256: string
}
export type Manifest = {
  version: number
  retrievedAt: string
  projects: {
    url: string
    title: string
    category: 'healthcare'
    layout: 'list' | 'groups'
    description: string[]
    resources: SourceResource[]
  }[]
}

const hash = (value: string | Buffer) => createHash('sha256').update(value).digest('hex')
const resourceSlug = (resource: SourceResource) => `wp-${hash(`${resource.fileUrl}|${resource.language}`).slice(0, 24)}`
const projectSlug = (url: string) => `wp-${new URL(url).pathname.split('/').filter(Boolean).at(-1)}-${hash(url).slice(0, 8)}`

function richText(paragraphs: string[]): Project['description'] {
  return { root: {
    type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
    children: paragraphs.map((text) => ({
      type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0,
      children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
    })),
  } }
}

// Validate every cached file before the first database write. A bad download is not a resource.
export async function validateManifest(manifest: Manifest, directory: string) {
  if (manifest.version !== 1 || !Array.isArray(manifest.projects) || !manifest.projects.length) {
    throw new Error('Expected a prepared version-1 manifest with projects.')
  }
  for (const project of manifest.projects) {
    if (!project.title || !project.description?.length || project.category !== 'healthcare' ||
        !['list', 'groups'].includes(project.layout) || !project.resources?.length) {
      throw new Error(`Incomplete project metadata: ${project.url}`)
    }
    for (const resource of project.resources) {
      if (!resource.title || !resource.group || !['en', 'pt'].includes(resource.language) ||
          !['clinical-aid', 'other'].includes(resource.documentType) ||
          !/^downloads\/[a-f0-9]{64}\.pdf$/.test(resource.file) ||
          !/^https:\/\/(www\.)?nest360\.org\//.test(resource.fileUrl)) {
        throw new Error(`Incomplete resource metadata: ${resource.title}`)
      }
      const pdf = await fs.readFile(path.join(directory, resource.file))
      if (pdf.subarray(0, 5).toString() !== '%PDF-' || hash(pdf) !== resource.sha256) {
        throw new Error(`Invalid PDF/checksum: ${resource.file}`)
      }
    }
  }
}

export async function importResources(payload: Payload, manifest: Manifest, directory: string) {
  await validateManifest(manifest, directory)
  const report = {
    importedAt: new Date().toISOString(),
    retrievedAt: manifest.retrievedAt,
    target: 'isolated local SQLite only',
    manualReview: [
      'Partial sample: only the five selected files, not the complete source collections.',
      'Resource summaries inherit the first source-page paragraph; review per-file descriptions.',
      'Language, group and document classification come from the reviewed source plan; verify them.',
      'Publication dates, per-file tags and citations were not inferred from filenames or PDF text.',
      'Featured website images and inline introduction links are not migrated; PDF preview generation is reused.',
      'Projects have no draft status in the current schema. They are local only; all Resources are drafts.',
      'Reruns preserve existing records and manual edits; they do not synchronize source updates.',
    ],
    projects: [] as { sourceUrl: string; id: number; slug: string; action: string }[],
    resources: [] as { sourcePage: string; fileUrl: string; sha256: string; title: string; language: string; id: number; document: number; action: string }[],
  }
  for (const project of manifest.projects) {
    const groups = new Map<string, { resource: number; isNew: boolean }[]>()
    for (const resource of project.resources) {
      const existing = (await payload.find({
        collection: 'resources', where: { slug: { equals: resourceSlug(resource) } }, draft: true, depth: 0, limit: 1,
      })).docs[0]
      let saved = existing
      if (!saved) {
        const filename = `wp-${resource.sha256}.pdf`
        let document = (await payload.find({
          collection: 'documents', where: { filename: { equals: filename } }, depth: 0, limit: 1,
        })).docs[0]
        if (!document) {
          const data = await fs.readFile(path.join(directory, resource.file))
          document = await payload.create({
            collection: 'documents', data: { documentType: resource.documentType },
            file: { data, name: filename, mimetype: 'application/pdf', size: data.length },
          })
        }
        saved = await payload.create({
          collection: 'resources', draft: true,
          data: {
            title: resource.title, slug: resourceSlug(resource), summary: project.description[0],
            resourceType: 'document', document: document.id, language: resource.language, _status: 'draft',
          },
        })
      }
      const documentId = typeof saved.document === 'object' ? saved.document?.id : saved.document
      if (typeof documentId !== 'number') throw new Error(`Existing resource has no document: ${saved.slug}`)
      report.resources.push({
        sourcePage: project.url, fileUrl: resource.fileUrl, sha256: resource.sha256,
        title: saved.title, language: saved.language, id: saved.id, document: documentId,
        action: existing ? 'skipped existing' : 'created draft',
      })
      groups.set(resource.group, [...groups.get(resource.group) ?? [], { resource: saved.id, isNew: false }])
    }
    const slug = projectSlug(project.url)
    let saved = (await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, depth: 0, limit: 1 })).docs[0]
    const action = saved ? 'skipped existing' : 'created local project'
    if (!saved) {
      // The project title supplies its required page tag; do not invent resource topic tags.
      let tag = (await payload.find({ collection: 'tags', where: { name: { equals: project.title } }, limit: 1 })).docs[0]
      if (!tag) tag = await payload.create({
        collection: 'tags', data: { name: project.title, slug: `wp-${hash(project.url).slice(0, 16)}`, usedFor: 'pages' },
      })
      if (tag.usedFor === 'files') throw new Error(`Existing tag '${tag.name}' is file-only; review before importing this project.`)
      saved = await payload.create({
        collection: 'projects', data: {
          title: project.title, slug, category: project.category, description: richText(project.description),
          tag: tag.id, layout: project.layout,
          resourceGroups: [...groups].map(([title, resources]) => ({ title, resources })),
        },
      })
    }
    report.projects.push({ sourceUrl: project.url, id: saved.id, slug, action })
  }
  return report
}
