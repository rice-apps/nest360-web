// Mock technologies for trying out the /technology gallery and its landing pages, based on the Syringe Pump
// and CPAP pages on nest360.org. Like seed-resources.ts, every mock title starts with "[Mock]" and every slug
// with "mock-", so they're easy to find and delete in the admin. Safe to run more than once: resources are
// reused and mock technologies are brought up to date.
//
// The technologies are saved as an approved staff account with access rules on (overrideAccess: false), the
// same way an editor saving in the admin would, so the script also checks that staff can add technologies.
// Run seed:resources first to also link its CPAP job aid and video.
//
// The device photos are NEST360's own product photos, downloaded from nest360.org when the script runs (so no
// image files are kept in the repository). Without an internet connection the technologies are still created,
// just without photos.
//
//   npm run seed:technologies
import { getPayload, type Where } from 'payload'

import config from '../payload.config'
import type { Resource, Technology } from '../payload-types'

const payload = await getPayload({ config })

const MOCK_LABEL = '[Mock] '

// An approved staff account to save as: the dev autologin account if it's approved, else any administrator
async function staffUser() {
  const email = process.env.PAYLOAD_AUTOLOGIN_EMAIL
  const where: Where = email
    ? { and: [{ email: { equals: email } }, { role: { in: ['admin', 'editor'] } }] }
    : { role: { equals: 'admin' } }
  const { docs } = await payload.find({ collection: 'users', where, limit: 1 })
  if (!docs[0]) throw new Error('No approved staff account found. Run npm run staff:setup-admin first.')
  return { ...docs[0], collection: 'users' as const }
}

// Rich text with one paragraph per string, the shape Payload's Lexical editor saves
function richText(...paragraphs: string[]): Technology['description'] {
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

// A device photo from nest360.org, uploaded to Media once (found again by its alt text on later runs)
async function photo(url: string, alt: string) {
  const { docs } = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
  if (docs[0]) return docs[0].id
  try {
    const response = await fetch(url)
    const mimetype = response.headers.get('content-type') ?? ''
    if (!response.ok || !mimetype.startsWith('image/')) throw new Error(`${response.status} ${mimetype}`)
    const data = Buffer.from(await response.arrayBuffer())
    const name = decodeURIComponent(new URL(url).pathname.split('/').pop()!)
    const created = await payload.create({ collection: 'media', data: { alt }, file: { data, mimetype, name, size: data.length } })
    payload.logger.info(`Uploaded photo: ${name}`)
    return created.id
  } catch (error) {
    payload.logger.warn(`Could not download ${url} (${error instanceof Error ? error.message : error}), so it has no photo`)
    return undefined
  }
}

// A published link resource, found by slug or created
async function link(data: Pick<Resource, 'title' | 'slug' | 'summary' | 'externalUrl'>) {
  const { docs } = await payload.find({ collection: 'resources', where: { slug: { equals: data.slug } }, limit: 1, draft: true })
  if (docs[0]) return docs[0].id
  const created = await payload.create({
    collection: 'resources',
    data: { ...data, title: MOCK_LABEL + data.title, resourceType: 'link', language: 'en', _status: 'published' },
  })
  payload.logger.info(`Created resource: ${data.slug}`)
  return created.id
}

// An existing resource from seed-resources.ts, if it has been run
async function existing(collection: 'resources', slug: string) {
  const { docs } = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1 })
  return docs[0]?.id
}

const rows = (...ids: (number | undefined)[]) =>
  ids.filter((id): id is number => id !== undefined).map((resource) => ({ resource, isNew: false }))

const user = await staffUser()

// Creates the mock technology as staff, or brings an existing one up to date
async function technology(data: Omit<Technology, 'id' | 'createdAt' | 'updatedAt'>) {
  const full = { ...data, title: MOCK_LABEL + data.title }
  const { docs } = await payload.find({ collection: 'technologies', where: { slug: { equals: data.slug } }, limit: 1 })
  if (docs[0]) {
    await payload.update({ collection: 'technologies', id: docs[0].id, data: full, user, overrideAccess: false })
    return payload.logger.info(`Updated technology: ${data.slug}`)
  }
  await payload.create({ collection: 'technologies', data: full, user, overrideAccess: false })
  payload.logger.info(`Created technology: ${data.slug}`)
}

const mindrayPhoto = await photo(
  'https://nest360.org/wp-content/uploads/2022/07/Mindray-Benefusion-SP3-2.jpg',
  'Mindray BeneFusion SP3 syringe pump',
)
const pumaniPhoto = await photo('https://nest360.org/wp-content/uploads/2021/05/Pumani_BCPAP.png', 'Pumani bubbleCPAP device')
const diamedicaPhoto = await photo(
  'https://nest360.org/wp-content/uploads/2021/05/Diamedica_BCPAP.png',
  'Diamedica UK Baby CPAP 10 device',
)
const landscape = await link({
  title: 'Newborn Technology Landscape',
  slug: 'mock-tech-newborn-technology-landscape',
  summary: 'A compendium of newborn healthcare technologies suited for use in resource-limited settings.',
  externalUrl: 'https://nest360.org/ntl',
})

await technology({
  title: 'Syringe Pump',
  slug: 'mock-syringe-pump',
  categoryOfCare: 'hydration',
  description: richText(
    'Syringe pumps enable clinicians to deliver intravenous rehydration fluids, nutrition, and drugs to infants.',
  ),
  resourceGroups: [
    {
      title: 'Training materials',
      resources: rows(
        await link({
          title: 'Syringe Pump Clinical Module',
          slug: 'mock-syringe-pump-clinical-module',
          summary: 'Clinical education module on when and how to safely use a syringe pump.',
          externalUrl: 'https://nest360.org/wp-content/uploads/2022/12/Clinical-Modules-Syringe-Pump_Final-web_12-2022.pdf',
        }),
      ),
    },
    {
      title: 'Qualification documents',
      resources: rows(
        await link({
          title: 'Syringe Pump Target Product Profile',
          slug: 'mock-syringe-pump-tpp',
          summary: 'The UNICEF and NEST360 target product profile for syringe pumps.',
          externalUrl: 'https://www.unicef.org/supply/media/2956/file/syringe-pump-TPP.pdf',
        }),
        landscape,
      ),
    },
  ],
  qualifiedProducts: [
    {
      name: 'Mindray BeneFusion SP3',
      image: mindrayPhoto,
      regulation: 'CE Mark',
      price: 'Price optimized for low-resource settings',
      consumables: 'Any brand syringe 5-60cc\nGiving set',
      powerSource: 'Battery or Mains power',
      warranty: 'See manufacturer website.',
      productUrl: 'https://www.mindray.com/',
    },
    { name: 'Medcaptain SYS-50', regulation: 'CE Mark', powerSource: 'Battery or Mains power' },
  ],
  purchaseUrl: 'https://www.hatch-tech.org/',
})

await technology({
  title: 'CPAP',
  slug: 'mock-cpap',
  categoryOfCare: 'respiratory',
  featuredImage: pumaniPhoto,
  description: richText(
    'CPAP (continuous positive airway pressure) delivers respiratory support to infants suffering from respiratory infections or respiratory distress syndrome.',
    'It keeps the small airways of the lungs open, and can blend in oxygen when the infant needs it.',
  ),
  resourceGroups: [
    {
      title: 'Training guides',
      resources: rows(await existing('resources', 'mock-bubble-cpap-job-aid')),
    },
    {
      title: 'Training videos',
      resources: rows(await existing('resources', 'mock-bubble-cpap-video')),
    },
    {
      title: 'Qualification documents',
      resources: rows(
        await link({
          title: 'CPAP Target Product Profile',
          slug: 'mock-cpap-tpp',
          summary: 'The UNICEF and NEST360 target product profile for CPAP devices.',
          externalUrl: 'https://www.unicef.org/supply/media/2896/file/CPAP-TPP.pdf',
        }),
        landscape,
      ),
    },
  ].filter((group) => group.resources.length > 0),
  qualifiedProducts: [
    {
      name: 'Diamedica UK Baby CPAP 10',
      image: diamedicaPhoto,
      regulation: 'CE Mark',
      price: 'Price optimized for low-resource settings. Includes 1 set of required consumables: nasal prongs and nasal tubing.',
      voltage: '230 V 50 Hz',
      powerSource: 'Mains power',
      warranty: '1 year',
    },
    {
      name: 'Pumani bubbleCPAP',
      image: pumaniPhoto,
      regulation: 'CE Mark, ISO 13485',
      price: 'Price optimized for low-resource settings. Includes 1 set of required consumables: nasal prongs and nasal tubing.',
      powerSource: 'Mains power',
      warranty: '2 years',
    },
  ],
  purchaseUrl: 'https://www.hatch-tech.org/',
})

await payload.destroy()
