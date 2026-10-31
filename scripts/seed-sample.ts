// Fills a LOCAL database with real sample content from nest360.org, so there is something to look at and test.
// Run: npm run seed:sample   (safe to run more than once; needs an internet connection the first time)
//
// Creates:
// - Resources: the files, a video, a link and a publication. Files are downloaded from nest360.org on the
//   first run and uploaded like an admin would, so PDFs get their first-page previews.
// - Two project pages that share resources, as on the real site:
//     /resources/warming-series-guidelines   the "one list" layout
//     /resources/clinical-job-aids           the titled-groups layout, reusing the two Warming Series files
// - One unpublished (draft) resource listed on Clinical Job Aids, which the public page must not show.
import { getPayload } from 'payload'

import config from '../payload.config'

const databaseUrl = process.env.DATABASE_URL
if (process.env.NODE_ENV === 'production' || (databaseUrl && !/@(localhost|127\.0\.0\.1)[:/]/.test(databaseUrl))) {
  throw new Error('Refusing to run: sample content only goes into a local database (local.db or Postgres on localhost).')
}

const UPLOADS = 'https://nest360.org/wp-content/uploads'

type SampleResource = {
  title: string
  summary: string
  resourceType: 'document' | 'video' | 'link' | 'publication'
  file?: string // URL of the file to download and upload to Documents
  videoUrl?: string
  externalUrl?: string
  language: 'en' | 'fr' | 'pt' | 'sw'
  tags?: string[] // file tags, created if missing
  isNew?: boolean
  publication?: { authors: string; journalOrPublisher: string; publicationDate: string; doi: string }
  draft?: boolean // left unpublished
}

const resources = {
  keepingBabiesWarm: {
    title: 'Warming Series: Keeping Babies Warm',
    summary: 'Ward poster on preventing hypothermia in newborns, for labour and newborn care units.',
    resourceType: 'document',
    file: `${UPLOADS}/2025/07/Job-Aid_Warming-Series_keeping-babies-warm_2025-07-21-2.pdf`,
    language: 'en',
    tags: ['Thermal Care'],
  },
  roomTemperature: {
    title: 'Warming Series: Maintaining Room Temperature',
    summary: 'Ward poster on keeping newborn care rooms at a safe temperature, and why it matters.',
    resourceType: 'document',
    file: `${UPLOADS}/2025/07/Job-Aid_Warming-Series_maintain-room-temp_2025-07-21.pdf`,
    language: 'en',
    tags: ['Thermal Care'],
  },
  diamedica: {
    title: 'Diamedica Baby CPAP',
    summary: 'Clinical job aid for setting up and using the Diamedica Baby CPAP.',
    resourceType: 'document',
    file: `${UPLOADS}/2024/07/Clinical-Job-Aid_bCPAP-Diamedica_Final_07-05-2024.pdf`,
    language: 'en',
    tags: ['Respiratory Support'],
  },
  pumani: {
    title: 'Pumani bubbleCPAP',
    summary: 'Clinical job aid for setting up and using the Pumani bubbleCPAP.',
    resourceType: 'document',
    file: `${UPLOADS}/2024/07/Clinical-Job-Aid_bCPAP-Pumani_Final_07-05-2024.pdf`,
    language: 'en',
    tags: ['Respiratory Support'],
  },
  celsi: {
    title: 'Celsi Warmer',
    summary: 'Clinical job aid for using the Celsi conductive warmer.',
    resourceType: 'document',
    file: `${UPLOADS}/2026/01/Clinical-Job-Aid_Conductive-Warmer-Celsi_Final-WEB_01-28-2026.pdf`,
    language: 'en',
    tags: ['Thermal Care'],
    isNew: true,
  },
  airsep: {
    title: 'CAIRE AirSep NewLife Intensity 10',
    summary: 'Clinical job aid for using the CAIRE AirSep NewLife Intensity 10 oxygen concentrator.',
    resourceType: 'document',
    file: `${UPLOADS}/2024/12/Clinical-Job-Aid_Oxygen-Concentrator-Airsep_Final_12-02-2024.pdf`,
    language: 'en',
    tags: ['Respiratory Support'],
  },
  canta: {
    title: 'Canta V8-WN-NS',
    summary: 'Clinical job aid for using the Canta V8-WN-NS oxygen concentrator.',
    resourceType: 'document',
    file: `${UPLOADS}/2024/11/Clinical-Job-Aid_Oxygen-Concentrator-Canta_Final_09-25-2024.pdf`,
    language: 'en',
    tags: ['Respiratory Support'],
  },
  cantaPortuguese: {
    title: 'Canta V8-WN-NS (Portuguese)',
    summary: 'Portuguese translation of the clinical job aid for the Canta V8-WN-NS oxygen concentrator.',
    resourceType: 'document',
    file: `${UPLOADS}/2024/11/Clinical-Job-Aid_Oxygen-Concentrator-Canta_PT-Final_11-25-2024.pdf`,
    language: 'pt',
    tags: ['Respiratory Support'],
  },
  // Not on the real Clinical Job Aids page: one of each other file format and resource type
  courseTemplate: {
    title: 'Course Allocations Template (Word)',
    summary: 'Word template for allocating participants to training courses.',
    resourceType: 'document',
    file: `${UPLOADS}/2025/08/GIC-Course-Allocation-Template_Aug2025.docx`,
    language: 'en',
  },
  variableList: {
    title: 'NID Detailed Variable List (Excel)',
    summary: 'Spreadsheet listing every variable in the NEST360 Neonatal Inpatient Dataset.',
    resourceType: 'document',
    file: `${UPLOADS}/2026/10/NEST360-Neonatal-Inpatient-Dataset-Detailed-Variable-List.xlsx`,
    language: 'en',
  },
  certificateTemplate: {
    title: 'GIC ToT Certificate Template (PowerPoint)',
    summary: 'PowerPoint template for training-of-trainers completion certificates.',
    resourceType: 'document',
    file: `${UPLOADS}/2025/08/GIC-ToT-Certificate-Template_Aug2025.pptx`,
    language: 'en',
  },
  cpapVideo: {
    title: 'CPAP: Introduction',
    summary: 'Training video introducing CPAP for newborns.',
    resourceType: 'video',
    videoUrl: 'https://vimeo.com/573937994',
    language: 'en',
    tags: ['Respiratory Support'],
  },
  cpapProfile: {
    title: 'CPAP Target Product Profile (UNICEF)',
    summary: 'UNICEF target product profile describing the requirements for CPAP devices.',
    resourceType: 'link',
    externalUrl: 'https://www.unicef.org/supply/media/2896/file/CPAP-TPP.pdf',
    language: 'en',
  },
  readinessPaper: {
    title: 'Quantifying health facility service readiness for small and sick newborn care',
    summary:
      'Compares standards-based and WHO level-2+ readiness scoring for 64 hospitals implementing with NEST360 in Kenya, Malawi, Nigeria, and Tanzania.',
    resourceType: 'publication',
    externalUrl: 'https://bmcpediatr.biomedcentral.com/articles/10.1186/s12887-024-04578-5',
    language: 'en',
    tags: ['Health Systems'],
    publication: {
      authors: 'Penzias RE, Bohne C, Gicheha E, et al.',
      journalOrPublisher: 'BMC Pediatrics',
      publicationDate: '2024-03-12',
      doi: '10.1186/s12887-024-04578-5',
    },
  },
  unpublished: {
    title: 'Draft job aid (unpublished)',
    summary: 'A draft resource. It is listed on Clinical Job Aids but must not appear on the public page.',
    resourceType: 'link',
    externalUrl: 'https://nest360.org/',
    language: 'en',
    draft: true,
  },
} satisfies Record<string, SampleResource>

type ResourceKey = keyof typeof resources
type Text = { text: string; url?: string }
type SampleProject = {
  title: string
  slug: string
  featuredImage?: { url: string; alt: string }
  description: Text[][] // paragraphs made of text runs, some of them links
  tag: string // the page's one tag
  layout: 'list' | 'groups'
  resourceGroups: { title?: string; description?: string; resources: ResourceKey[] }[]
  relatedProjects?: string[] // slugs
}

const projects: SampleProject[] = [
  // First: Clinical Job Aids lists it as a related project
  {
    title: 'Warming Series Guidelines',
    slug: 'warming-series-guidelines',
    description: [
      [
        {
          text: 'The Warming Series posters are for use in labour and newborn care unit wards. The guidelines recommend how to prevent hypothermia in the labour ward, how to keep babies warm, how to maintain room temperature, and why it matters.',
        },
      ],
    ],
    tag: 'Safety',
    layout: 'list',
    resourceGroups: [{ resources: ['keepingBabiesWarm', 'roomTemperature'] }],
  },
  {
    title: 'Clinical Job Aids',
    slug: 'clinical-job-aids',
    featuredImage: {
      url: `${UPLOADS}/2024/12/Newborn-Maternal-Technology-Landscape-Survey_thumbnail.jpg`,
      alt: 'Preview of Job Aids',
    },
    description: [
      [
        {
          text: 'Our clinical job aids act as a reference for hospital staff and students during practical demonstrations, learning, and clinical use. These materials include guidance on using essential equipment in newborn care units with model-specific images.',
        },
      ],
      [
        { text: 'If you would like to obtain editable or high-resolution job aid files, please contact ' },
        { text: 'info@nest360.org', url: 'mailto:info@nest360.org' },
        { text: '.' },
      ],
    ],
    tag: 'Training Materials',
    layout: 'groups',
    resourceGroups: [
      { title: 'Bubble CPAP', resources: ['diamedica', 'pumani'] },
      { title: 'Conductive Warmer', resources: ['celsi'] },
      { title: 'Oxygen Concentrator', resources: ['airsep', 'canta', 'cantaPortuguese'] },
      // The same two resources as Warming Series Guidelines, as on the real site
      { title: 'Warming Series', resources: ['keepingBabiesWarm', 'roomTemperature'] },
      {
        title: 'Extras (sample only)',
        description: 'Not on the real page: one of each other file format and resource type.',
        resources: [
          'courseTemplate',
          'variableList',
          'certificateTemplate',
          'cpapVideo',
          'cpapProfile',
          'readinessPaper',
          'unpublished',
        ],
      },
    ],
    relatedProjects: ['warming-series-guidelines'],
  },
]

const MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  jpg: 'image/jpeg',
}

const payload = await getPayload({ config })

async function download(url: string) {
  const name = url.split('/').pop()!
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Could not download ${url}: ${response.status}`)
  const data = Buffer.from(await response.arrayBuffer())
  payload.logger.info(`Downloaded ${name}`)
  return { data, mimetype: MIME_TYPES[name.split('.').pop()!.toLowerCase()], name, size: data.length }
}

// Callers pass the file already attached to the resource or project, so a second run doesn't download
// again. (Matching by filename doesn't work: Payload renames an upload whose name is already taken.)
async function upload(
  collection: 'documents' | 'media',
  url: string,
  existing: number | { id: number } | null | undefined,
  data: { alt?: string } = {},
) {
  if (existing) return typeof existing === 'object' ? existing.id : existing
  return (await payload.create({ collection, data: data as { alt: string }, file: await download(url) })).id
}

// Cached so resources sharing a tag don't race to create it twice (tag names are unique)
const tagIds = new Map<string, Promise<number>>()
function tagId(name: string, usedFor: 'pages' | 'files') {
  if (!tagIds.has(name)) {
    tagIds.set(
      name,
      payload.find({ collection: 'tags', where: { name: { equals: name } }, limit: 1 }).then(async ({ docs }) =>
        docs[0]?.id ?? (await payload.create({ collection: 'tags', data: { name, slug: '', usedFor } })).id,
      ),
    )
  }
  return tagIds.get(name)!
}

const slugify = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

async function saveResource(sample: SampleResource) {
  const slug = slugify(sample.title)
  const { docs } = await payload.find({ collection: 'resources', where: { slug: { equals: slug } }, limit: 1, draft: true })
  const status = sample.draft ? 'draft' : 'published'
  const data = {
    title: sample.title,
    slug,
    summary: sample.summary,
    resourceType: sample.resourceType,
    document: sample.file ? await upload('documents', sample.file, docs[0]?.document) : null,
    videoUrl: sample.videoUrl ?? null,
    externalUrl: sample.externalUrl ?? null,
    language: sample.language,
    tags: await Promise.all((sample.tags ?? []).map((name) => tagId(name, 'files'))),
    isNew: sample.isNew ?? false,
    authors: sample.publication?.authors ?? null,
    journalOrPublisher: sample.publication?.journalOrPublisher ?? null,
    publicationDate: sample.publication?.publicationDate ?? null,
    doi: sample.publication?.doi ?? null,
    _status: status,
  } as const
  const draft = status === 'draft'
  return docs[0]
    ? payload.update({ collection: 'resources', id: docs[0].id, data, draft })
    : payload.create({ collection: 'resources', data, draft })
}

// Turns paragraphs of text runs into the Lexical JSON that the richText field stores
function richText(paragraphs: Text[][]) {
  const text = (value: string) => ({ type: 'text', text: value, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
  return {
    root: {
      type: 'root',
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      children: paragraphs.map((runs) => ({
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        textFormat: 0,
        textStyle: '',
        children: runs.map((run) =>
          run.url
            ? {
                type: 'link',
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 3,
                fields: { linkType: 'custom', url: run.url, newTab: run.url.startsWith('http') },
                children: [text(run.text)],
              }
            : text(run.text),
        ),
      })),
    },
  }
}

// One at a time: SQLite allows a single writer
const resourceIds = {} as Record<ResourceKey, number>
for (const key of Object.keys(resources) as ResourceKey[]) {
  const sample: SampleResource = resources[key]
  const saved = await saveResource(sample)
  resourceIds[key] = saved.id
  payload.logger.info(`Saved resource: ${saved.title}${sample.draft ? ' (draft)' : ''}`)
}

for (const sample of projects) {
  const { docs } = await payload.find({ collection: 'projects', where: { slug: { equals: sample.slug } }, limit: 1 })
  const data = {
    title: sample.title,
    slug: sample.slug,
    featuredImage: sample.featuredImage
      ? await upload('media', sample.featuredImage.url, docs[0]?.featuredImage, { alt: sample.featuredImage.alt })
      : null,
    description: richText(sample.description),
    tag: await tagId(sample.tag, 'pages'),
    layout: sample.layout,
    resourceGroups: sample.resourceGroups.map((group) => ({
      title: group.title,
      description: group.description,
      resources: group.resources.map((key) => resourceIds[key]),
    })),
    relatedProjects: await Promise.all(
      (sample.relatedProjects ?? []).map(async (slug) => {
        const { docs } = await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, limit: 1 })
        if (!docs[0]) throw new Error(`Related project not found: ${slug}`)
        return docs[0].id
      }),
    ),
  }
  const doc = docs[0]
    ? await payload.update({ collection: 'projects', id: docs[0].id, data })
    : await payload.create({ collection: 'projects', data })
  payload.logger.info(`Saved project: ${doc.title} (/resources/${doc.slug})`)
}

process.exit(0)
