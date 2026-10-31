// Mock resource pages for trying out the resource library cards: a mix of featured images, PDF previews,
// videos, outside links, a publication, "New" badges, publication dates, page and resource tags, both
// layouts and a "Download all" file. Every mock page and resource's title starts with "[Mock]" and its slug
// with "mock-", so they're easy to tell apart from real content and to find and delete in the admin. Safe to
// run more than once: existing tags, files and resources are reused, and mock pages are brought up to date.
//
//   npm run seed:resources
import path from 'path'
import { fileURLToPath } from 'url'

import { getPayload } from 'payload'

import config from '../payload.config'
import type { Project, Resource } from '../payload-types'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(dirname, '../public')

const payload = await getPayload({ config })

// Rich text with one paragraph per string, the shape Payload's Lexical editor saves
function richText(...paragraphs: string[]): Project['description'] {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
      })),
    },
  }
}

// A one-page PDF with a heading, so the Documents upload hook has something to make a preview from
function mockPdf(title: string) {
  const escaped = title.replace(/[()\\]/g, '\\$&')
  const stream = `BT /F1 28 Tf 60 700 Td (${escaped}) Tj ET\nBT /F1 14 Tf 60 660 Td (NEST360 mock document for testing the resource library) Tj ET`
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = objects.map((object, i) => {
    const offset = pdf.length
    pdf += `${i + 1} 0 obj\n${object}\nendobj\n`
    return offset
  })
  const xref = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  pdf += offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return Buffer.from(pdf, 'latin1')
}

async function tag(name: string, usedFor: 'pages' | 'files' | 'both') {
  const { docs } = await payload.find({ collection: 'tags', where: { name: { equals: name } }, limit: 1 })
  if (docs[0]) return docs[0].id
  const created = await payload.create({ collection: 'tags', data: { name, slug: '', usedFor } })
  payload.logger.info(`Created tag: ${name}`)
  return created.id
}

async function image(file: string, alt: string) {
  const { docs } = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
  if (docs[0]) return docs[0].id
  const created = await payload.create({ collection: 'media', data: { alt }, filePath: path.join(publicDir, file) })
  payload.logger.info(`Uploaded image: ${file}`)
  return created.id
}

async function pdf(title: string) {
  const filename = `mock-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`
  const { docs } = await payload.find({ collection: 'documents', where: { filename: { equals: filename } }, limit: 1 })
  if (docs[0]) return docs[0].id
  const data = mockPdf(title)
  const created = await payload.create({
    collection: 'documents',
    data: {},
    file: { data, mimetype: 'application/pdf', name: filename, size: data.length },
  })
  payload.logger.info(`Uploaded PDF: ${filename}`)
  return created.id
}

// Starts every mock title, so nobody mistakes a mock card or resource for real content
const MOCK_LABEL = '[Mock] '

type ResourceData = Pick<Resource, 'title' | 'slug' | 'summary' | 'resourceType' | 'language'> &
  Partial<Pick<Resource, 'document' | 'videoUrl' | 'externalUrl' | 'tags' | 'isNew' | 'authors' | 'publicationDate'>>

// A published resource, found by slug or created. Returns its id for a project's resourceGroups.
async function resource(data: ResourceData) {
  const { docs } = await payload.find({ collection: 'resources', where: { slug: { equals: data.slug } }, limit: 1, draft: true })
  if (docs[0]) return docs[0].id
  const created = await payload.create({
    collection: 'resources',
    data: { ...data, title: MOCK_LABEL + data.title, _status: 'published' },
  })
  payload.logger.info(`Created resource: ${data.slug}`)
  return created.id
}

// Creates the mock page, or brings an existing one up to date. Mock pages are disposable, so edits made to
// them in the admin are overwritten.
async function project(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
  const full = { ...data, title: MOCK_LABEL + data.title }
  const { docs } = await payload.find({ collection: 'projects', where: { slug: { equals: data.slug } }, limit: 1 })
  if (docs[0]) {
    await payload.update({ collection: 'projects', id: docs[0].id, data: full })
    return payload.logger.info(`Updated page: ${data.slug}`)
  }
  await payload.create({ collection: 'projects', data: full })
  payload.logger.info(`Created page: ${data.slug}`)
}

// Page tags (one per page) and resource tags
const training = await tag('Training', 'pages')
const technology = await tag('Technology', 'pages')
const research = await tag('Research', 'pages')
const newbornHealth = await tag('Newborn Health', 'pages')
const kenya = await tag('Kenya', 'pages')
const clinical = await tag('Clinical', 'files')
const biomedical = await tag('Biomedical', 'files')
const jobAid = await tag('Job Aid', 'files')
const bubbleCpap = await tag('Bubble CPAP', 'both')

const bannerImage = await image('story_banner.jpg', 'Mock: health workers caring for a newborn')
const photoA = await image('placeholder1.jpg', 'Mock: newborn care equipment')
const photoB = await image('placeholder2.jpg', 'Mock: hospital ward')

const VIDEO = 'https://vimeo.com/76979871'

// 1. Featured image, "New" badge, document + video + link, page and resource tags, Download all button
await project({
  title: 'Bubble CPAP Clinical Job Aids',
  slug: 'mock-bubble-cpap-job-aids',
  category: 'healthcare',
  featuredImage: bannerImage,
  description: richText(
    'Step-by-step job aids for setting up, using and weaning newborns from bubble CPAP. Print them for the ward or use them in training.',
  ),
  tag: training,
  layout: 'list',
  resourceGroups: [
    {
      resources: [
        await resource({
          title: 'Bubble CPAP job aid',
          slug: 'mock-bubble-cpap-job-aid',
          resourceType: 'document',
          summary: 'One-page job aid for setting up bubble CPAP.',
          document: await pdf('Bubble CPAP Job Aid'),
          language: 'en',
          tags: [clinical, jobAid, bubbleCpap],
          isNew: true,
          publicationDate: '2026-09-17T12:00:00.000Z',
        }),
        await resource({
          title: 'Bubble CPAP setup video',
          slug: 'mock-bubble-cpap-video',
          resourceType: 'video',
          summary: 'Video walkthrough of bubble CPAP setup.',
          videoUrl: VIDEO,
          language: 'en',
          tags: [clinical],
        }),
        await resource({
          title: 'WHO guidance on CPAP',
          slug: 'mock-who-cpap-guidance',
          resourceType: 'link',
          summary: 'WHO guidance on CPAP for newborns.',
          externalUrl: 'https://www.who.int',
          language: 'en',
        }),
      ],
    },
  ],
  downloadAll: await pdf('Bubble CPAP Job Aids Complete Set'),
})

// 2. No images at all: the Nest Blue fallback panel, with a "Video" badge
await project({
  title: 'Neonatal Resuscitation Training Video',
  slug: 'mock-neonatal-resuscitation-video',
  category: 'healthcare',
  description: richText('A short training video on resuscitating newborns who are not breathing at birth. Suitable for refresher sessions.'),
  tag: training,
  layout: 'list',
  resourceGroups: [
    {
      resources: [
        await resource({
          title: 'Neonatal resuscitation (English)',
          slug: 'mock-neonatal-resuscitation-en',
          resourceType: 'video',
          summary: 'Neonatal resuscitation training video.',
          videoUrl: VIDEO,
          language: 'en',
          tags: [clinical],
          publicationDate: '2025-03-02T12:00:00.000Z',
        }),
        await resource({
          title: 'Réanimation néonatale (French)',
          slug: 'mock-neonatal-resuscitation-fr',
          resourceType: 'video',
          summary: 'Vidéo de formation sur la réanimation néonatale.',
          videoUrl: VIDEO,
          language: 'fr',
          tags: [clinical],
        }),
      ],
    },
  ],
})

// 3. No featured image: the card uses the PDF's first-page preview instead
await project({
  title: 'Phototherapy Maintenance Guide',
  slug: 'mock-phototherapy-maintenance',
  category: 'healthcare',
  description: richText('How biomedical technicians check, clean and repair phototherapy units. Includes a monthly maintenance checklist.'),
  tag: technology,
  layout: 'list',
  resourceGroups: [
    {
      resources: [
        await resource({
          title: 'Phototherapy maintenance guide',
          slug: 'mock-phototherapy-maintenance-guide',
          resourceType: 'document',
          summary: 'Maintenance guide for phototherapy units.',
          document: await pdf('Phototherapy Maintenance Guide'),
          language: 'en',
          tags: [biomedical],
          publicationDate: '2024-11-20T12:00:00.000Z',
        }),
      ],
    },
  ],
})

// 4. Grouped layout, a publication and an outside link, a different section (innovators)
await project({
  title: 'Newborn Technology Market Report',
  slug: 'mock-newborn-technology-market-report',
  category: 'innovators',
  featuredImage: photoA,
  description: richText('An overview of the market for newborn care technologies in sub-Saharan Africa. Covers pricing, suppliers and gaps in supply.'),
  tag: research,
  layout: 'groups',
  resourceGroups: [
    {
      title: 'Report',
      resources: [
        await resource({
          title: 'Full market report',
          slug: 'mock-market-report',
          resourceType: 'publication',
          summary: 'Market report on newborn care technologies.',
          document: await pdf('Newborn Technology Market Report'),
          language: 'en',
          tags: [biomedical],
          authors: 'NEST360 Mock Team',
          publicationDate: '2026-06-01T12:00:00.000Z',
        }),
      ],
    },
    {
      title: 'Related links',
      resources: [
        await resource({
          title: 'Technology landscape',
          slug: 'mock-technology-landscape',
          resourceType: 'link',
          summary: 'NEST360 technology landscape.',
          externalUrl: 'https://www.nest360.org',
          language: 'en',
        }),
      ],
    },
  ],
})

// 5. Implementors section, Portuguese and Swahili documents, "New" badge, country tag
await project({
  title: 'Facility Readiness Checklist',
  slug: 'mock-facility-readiness-checklist',
  category: 'implementors',
  featuredImage: photoB,
  description: richText('A checklist hospitals use to see whether a newborn unit is ready for small and sick newborn care. Available in four languages.'),
  tag: kenya,
  layout: 'list',
  resourceGroups: [
    {
      resources: [
        await resource({
          title: 'Facility readiness checklist',
          slug: 'mock-readiness-checklist-en',
          resourceType: 'document',
          summary: 'Facility readiness checklist.',
          document: await pdf('Facility Readiness Checklist'),
          language: 'en',
          tags: [jobAid],
          publicationDate: '2025-08-12T12:00:00.000Z',
        }),
        await resource({
          title: 'Lista de verificação',
          slug: 'mock-readiness-checklist-pt',
          resourceType: 'document',
          summary: 'Lista de verificação de prontidão.',
          document: await pdf('Lista de Verificacao'),
          language: 'pt',
          tags: [jobAid],
          isNew: true,
        }),
        await resource({
          title: 'Orodha ya utayari',
          slug: 'mock-readiness-checklist-sw',
          resourceType: 'document',
          summary: 'Orodha ya utayari wa kituo.',
          document: await pdf('Orodha ya Utayari'),
          language: 'sw',
          tags: [jobAid],
        }),
      ],
    },
  ],
})

// 6. Plain card: one outside link, a page tag only
await project({
  title: 'Small and Sick Newborn Care Implementation Toolkit',
  slug: 'mock-implementation-toolkit',
  category: 'implementors',
  description: richText('An online toolkit, codesigned with UNICEF, that helps implementors plan and scale up newborn care.'),
  tag: newbornHealth,
  layout: 'list',
  resourceGroups: [
    {
      resources: [
        await resource({
          title: 'Open the toolkit',
          slug: 'mock-implementation-toolkit-link',
          resourceType: 'link',
          summary: 'The online implementation toolkit.',
          externalUrl: 'https://www.newborntoolkit.org',
          language: 'en',
        }),
      ],
    },
  ],
})

payload.logger.info('Done. Open /resources to see the cards, or /admin/collections/projects to edit them.')
process.exit(0)
