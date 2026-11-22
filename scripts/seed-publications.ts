// Fills a LOCAL database with sample research publications, to test /publications (including its pagination,
// 10 per page) and the publication cards on /resources.
// Run: npm run seed:publications   (safe to run more than once; matches papers by slug; needs internet the first time)
//
// Creates 26 published papers from nest360.org/publications (3 pages in the gallery), each linking to its DOI page, plus one draft that
// must NOT appear on the public pages. The open-access Springer/BMC papers also get their PDF downloaded and
// uploaded like an admin would, so they get a first-page preview picture; the others are links only and show
// the plain color block. Tags use the topic names from lib/resourceFilters.ts, so the Topic filters find them.
import { execFile } from 'child_process'
import path from 'path'
import { getPayload } from 'payload'
import { promisify } from 'util'

import config from '../payload.config'

const databaseUrl = process.env.DATABASE_URL
if (process.env.NODE_ENV === 'production' || (databaseUrl && !/@(localhost|127\.0\.0\.1)[:/]/.test(databaseUrl))) {
  throw new Error('Refusing to run: sample content only goes into a local database (local.db or Postgres on localhost).')
}

type SamplePublication = {
  title: string // the short card heading, as in the Figma design
  fullTitle: string // the paper's own title, used as the card summary
  authors: string
  journal: string
  reference: string // the citation after the title, e.g. "BMC Pediatr. 2023;23(Suppl 2):568. Published 2023 Nov 15."
  date?: string // publication date, when the citation gives one
  doi: string
  springerPdf?: boolean // open-access Springer/BMC paper: download its PDF so it gets a preview picture
  tags: string[]
  draft?: boolean
}

const COUNTRIES = ['Kenya', 'Malawi', 'Nigeria', 'Tanzania']

const publications: SamplePublication[] = [
  {
    title: 'Blood Culture vs. Antibiotics',
    fullTitle:
      'Blood culture versus antibiotic use for neonatal inpatients in 61 hospitals implementing with the NEST360 Alliance in Kenya, Malawi, Nigeria, and Tanzania: a cross-sectional study',
    authors: 'Murless-Collins S, Kawaza K, Salim N, et al.',
    journal: 'BMC Pediatrics',
    reference: 'BMC Pediatr. 2023;23(Suppl 2):568. Published 2023 Nov 15.',
    date: '2023-11-15',
    doi: '10.1186/s12887-023-04343-0',
    springerPdf: true,
    tags: ['Safety & Infection Control (IPC)', ...COUNTRIES],
  },
  {
    title: 'Neonatal Inpatient Dataset',
    fullTitle:
      'Neonatal inpatient dataset for small and sick newborn care in low- and middle-income countries: systematic development and multi-country operationalisation with NEST360',
    authors: 'Cross JH, Bohne C, Ngwala SK, et al.',
    journal: 'BMC Pediatrics',
    reference: 'BMC Pediatr. 2023;23(Suppl 2):567. Published 2023 Nov 15.',
    date: '2023-11-15',
    doi: '10.1186/s12887-023-04341-2',
    springerPdf: true,
    tags: ['Quality Improvement & Data'],
  },
  {
    title: 'Target Product Profiles for Neonatal Care Devices',
    fullTitle:
      'Target product profiles for neonatal care devices: systematic development and outcomes with NEST360 and UNICEF',
    authors: 'Kirby RP, Molyneux EM, Dube Q, et al.',
    journal: 'BMC Pediatrics',
    reference: 'BMC Pediatr. 2023;23(Suppl 2):564. Published 2023 Nov 15.',
    date: '2023-11-15',
    doi: '10.1186/s12887-023-04342-1',
    springerPdf: true,
    tags: ['Technology Landscapes'],
  },
  {
    title: 'Interprofessional Education for Newborn Care',
    fullTitle:
      'Using interprofessional education to build dynamic teams to help drive collaborative, coordinated and effective newborn care',
    authors: 'Langton J, Liaghati-Mobarhan S, Gicheha E, et al.',
    journal: 'BMC Pediatrics',
    reference: 'BMC Pediatr. 2023;23(Suppl 2):565. Published 2023 Nov 15.',
    date: '2023-11-15',
    doi: '10.1186/s12887-023-04373-8',
    springerPdf: true,
    tags: ['Clinical Care & CPAP'],
  },
  {
    title: 'Devices and Furniture Planning Tool',
    fullTitle:
      'Devices and furniture for small and sick newborn care: systematic development of a planning and costing tool',
    authors: 'Tarus A, Msemo G, Kamuyu R, et al.',
    journal: 'BMC Pediatrics',
    reference: 'BMC Pediatr. 2023;23(Suppl 2):566. Published 2023 Nov 15.',
    date: '2023-11-15',
    doi: '10.1186/s12887-023-04363-w',
    springerPdf: true,
    tags: ['Technology Landscapes'],
  },
  {
    title: 'Avoid Equipment Graveyards',
    fullTitle:
      'Avoid equipment graveyards: rigorous process to improve identification and procurement of effective, affordable, and usable newborn devices in low-resource hospital settings',
    authors: 'Asma E, Heenan M, Banda G, et al.',
    journal: 'BMC Pediatrics',
    reference: 'BMC Pediatr. 2023;23(Suppl 2):569. Published 2023 Nov 15.',
    date: '2023-11-15',
    doi: '10.1186/s12887-023-04362-x',
    springerPdf: true,
    tags: ['Technical & Equipment Maintenance'],
  },
  {
    title: 'Protecting Newborn Care in the COVID-19 Pandemic',
    fullTitle:
      'Protecting small and sick newborn care in the COVID-19 pandemic: multi-stakeholder qualitative data from four African countries with NEST360',
    authors: 'Steege R, Mwaniki H, Ogueji IA, et al.',
    journal: 'BMC Pediatrics',
    reference: 'BMC Pediatr. 2023;23(Suppl 2):572. Published 2023 Nov 16.',
    date: '2023-11-16',
    doi: '10.1186/s12887-023-04358-7',
    springerPdf: true,
    tags: ['Safety & Infection Control (IPC)'],
  },
  {
    title: 'Health Facility Assessment Tool',
    fullTitle:
      'Health facility assessment of small and sick newborn care in low- and middle-income countries: systematic tool development and operationalisation with NEST360 and UNICEF',
    authors: 'Penzias RE, Bohne C, Ngwala SK, et al.',
    journal: 'BMC Pediatrics',
    reference: 'BMC Pediatr. 2024;23(Suppl 2):655. Published 2024 Mar 7.',
    date: '2024-03-07',
    doi: '10.1186/s12887-023-04495-z',
    springerPdf: true,
    tags: ['Quality Improvement & Data'],
  },
  {
    title: 'COVID-19 Effects on Neonatal Admissions',
    fullTitle:
      'COVID-19 pandemic effects on neonatal inpatient admissions and mortality: interrupted time series analysis of facilities implementing NEST360 in Kenya, Malawi, Nigeria, and Tanzania',
    authors: 'Malla L, Ohuma EO, Shabani J, et al.',
    journal: 'BMC Pediatrics',
    reference: 'BMC Pediatr. 2023;23(Suppl 2):657.',
    date: '2024-06-01',
    doi: '10.1186/s12887-024-04873-1',
    springerPdf: true,
    tags: ['Quality Improvement & Data', ...COUNTRIES],
  },
  {
    title: 'Point-of-Care Glucometers for Neonatal Hypoglycemia',
    fullTitle:
      'Evaluation of commercial point-of-care glucometers for detection and monitoring of neonatal hypoglycemia in resource-constrained settings',
    authors: 'Bond M, Asma E, Peterson J, et al.',
    journal: 'BMC Pediatrics',
    reference: 'BMC Pediatr. 2025;25(1):624. Published 2025 Aug 16.',
    date: '2025-08-16',
    doi: '10.1186/s12887-025-05934-9',
    springerPdf: true,
    tags: ['Technology Landscapes'],
  },
  // Link-only papers (no PDF), so the gallery shows both kinds of card
  {
    title: 'Neonatal CPAP Across Malawi',
    fullTitle: 'Neonatal CPAP for Respiratory Distress Across Malawi and Mortality',
    authors: 'Carns J, Kawaza K, Liaghati-Mobarhan S, et al.',
    journal: 'Pediatrics',
    reference: 'Pediatrics. 2019;144(4):e20190668.',
    date: '2019-10-01',
    doi: '10.1542/peds.2019-0668',
    tags: ['Clinical Care & CPAP', 'Malawi'],
  },
  {
    title: 'Neonatal Ward-Strengthening Program',
    fullTitle:
      'A neonatal ward-strengthening program improves survival for neonates treated with CPAP at district hospitals in Malawi',
    authors: 'Carns J, Liaghati-Mobarhan S, Asibon A, et al.',
    journal: 'PLOS Global Public Health',
    reference: 'PLOS Glob Public Health. 2022;2(2):e0000195. Published 2022 Feb 18.',
    date: '2022-02-18',
    doi: '10.1371/journal.pgph.0000195',
    tags: ['Clinical Care & CPAP', 'Malawi'],
  },
  {
    title: 'Point-of-Care Bilirubin Device',
    fullTitle: 'Design and field evaluation of a lateral flow cassette device for point-of-care bilirubin measurement',
    authors: 'Shapiro A, Mtenthaonga P, Mjumira R, et al.',
    journal: 'PLOS Global Public Health',
    reference: 'PLOS Glob Public Health. 2023;3(8):e0002262. Published 2023 Aug 8.',
    date: '2023-08-08',
    doi: '10.1371/journal.pgph.0002262',
    tags: ['Technology Landscapes'],
  },
  {
    title: 'Investment Case for Newborn Care in Tanzania',
    fullTitle: 'Investment case for small and sick newborn care in Tanzania: systematic analyses',
    authors: 'Kamuyu R, Tarus A, Bundala F, et al.',
    journal: 'BMC Pediatrics',
    reference: 'BMC Pediatr. 2023;23(Suppl 2):632. Published 2023 Dec 14.',
    date: '2023-12-14',
    doi: '10.1186/s12887-023-04414-2',
    springerPdf: true,
    tags: ['Quality Improvement & Data', 'Tanzania'],
  },
  {
    // Same title as the paper in seed-sample.ts, so both scripts update one record instead of making two
    title: 'Quantifying health facility service readiness for small and sick newborn care',
    fullTitle:
      'Quantifying health facility service readiness for small and sick newborn care: comparing standards-based and WHO level-2 + scoring for 64 hospitals implementing with NEST360 in Kenya, Malawi, Nigeria, and Tanzania',
    authors: 'Penzias RE, Bohne C, Gicheha E, et al.',
    journal: 'BMC Pediatrics',
    reference: 'BMC Pediatr. 2024;23(Suppl 2):656. Published 2024 Mar 12.',
    date: '2024-03-12',
    doi: '10.1186/s12887-024-04578-5',
    springerPdf: true,
    tags: ['Quality Improvement & Data', ...COUNTRIES],
  },
  {
    title: 'Neonatal Indicator Data in Tanzania',
    fullTitle:
      'Neonatal indicator data in Tanzania District Health Information System: evaluation of availability and quality of selected newborn indicators, 2015-2022',
    authors: 'Shabani J, Salim N, Bohne C, et al.',
    journal: 'BMC Pediatrics',
    reference: 'BMC Pediatr. 2025;23(Suppl 2):658. Published 2025 Jan 23.',
    date: '2025-01-23',
    doi: '10.1186/s12887-025-05417-x',
    springerPdf: true,
    tags: ['Quality Improvement & Data', 'Tanzania'],
  },
  {
    title: 'Neonatal Unit Human Resources',
    fullTitle:
      'Neonatal unit human resources: coverage for six cadres and trends for staff-to-baby ratios in 65 neonatal units implementing with NEST360 in Kenya, Malawi, Nigeria, and Tanzania',
    authors: 'Penzias RE, Ohuma EO, Odedere O, et al.',
    journal: 'Human Resources for Health',
    reference: 'Hum Resour Health.',
    doi: '10.1186/s12960-025-01031-1',
    springerPdf: true,
    tags: ['Quality Improvement & Data', ...COUNTRIES],
  },
  {
    title: 'Infection Prevention and Care Bundles',
    fullTitle:
      'Infection prevention and care bundles addressing health care-associated infections in neonatal care in low-middle income countries: a scoping review',
    authors: 'Molina García A, Cross JH, Fitchett EJA, et al.',
    journal: 'EClinicalMedicine',
    reference: 'EClinicalMedicine. 2022;44:101259. Published 2022 Jan 10.',
    date: '2022-01-10',
    doi: '10.1016/j.eclinm.2021.101259',
    tags: ['Safety & Infection Control (IPC)'],
  },
  {
    title: 'Donor Aid for Newborns and Stillbirths',
    fullTitle: 'Donor aid mentioning newborns and stillbirths, 2002-19: an analysis of levels, trends, and equity',
    authors: 'Kumar MB, Bath D, Binyaruka P, Novignon J, Lawn JE, Pitt C.',
    journal: 'The Lancet Global Health',
    reference: 'Lancet Glob Health. 2023;11(11):e1785-e1793.',
    doi: '10.1016/S2214-109X(23)00378-9',
    tags: ['Quality Improvement & Data'],
  },
  {
    title: 'Ending Preventable Neonatal Deaths',
    fullTitle:
      'Ending Preventable Neonatal Deaths: Multicountry Evidence to Inform Accelerated Progress to the Sustainable Development Goal by 2030',
    authors: 'Lawn JE, Bhutta ZA, Ezeaka C, Saugstad O.',
    journal: 'Neonatology',
    reference: 'Neonatology. 2023;120(4):491-499.',
    doi: '10.1159/000530496',
    tags: ['Quality Improvement & Data'],
  },
  {
    title: 'Digital Design Notebook for BME Education',
    fullTitle:
      'Leveraging an Open-Access Digital Design Notebook for Graduate Biomedical Engineering Education in Nigeria',
    authors: 'Casserly P, Dare A, Onuh J, et al.',
    journal: 'Biomedical Engineering Education',
    reference: 'Biomed Eng Education (2024).',
    doi: '10.1007/s43683-024-00136-8',
    tags: ['Technical & Equipment Maintenance', 'Nigeria'],
  },
  {
    title: 'Quality of Inpatient Care in District Hospitals',
    fullTitle: 'Quality of inpatient paediatric and newborn care in district hospitals – Authors\u2019 reply',
    authors: 'English M, Aluvaala J, Maina M, Duke T, Irimu G.',
    journal: 'The Lancet Global Health',
    reference: 'Lancet Glob Health. 2023;11(10):e1514-e1515.',
    doi: '10.1016/S2214-109X(23)00370-4',
    tags: ['Quality Improvement & Data'],
  },
  {
    title: 'Point-of-Care Bilirubin Test in Malawi',
    fullTitle: 'Evaluation of a Point-of-Care Test for Bilirubin in Malawi',
    authors: 'Shapiro A, Anderson J, Mtenthaonga P, et al.',
    journal: 'Pediatrics',
    reference: 'Pediatrics. 2022;150(2):e2021053928.',
    doi: '10.1542/peds.2021-053928',
    tags: ['Technology Landscapes', 'Malawi'],
  },
  {
    title: 'National Scale of Neonatal CPAP in Malawi',
    fullTitle:
      'National scale of neonatal CPAP to district hospitals in Malawi improves survival for neonates weighing between 1.0 and 1.3 kg',
    authors: 'Carns J, Liaghati-Mobarhan S, Asibon A, et al.',
    journal: 'Archives of Disease in Childhood',
    reference: 'Arch Dis Child. 2022;107(6):553-557.',
    doi: '10.1136/archdischild-2021-322964',
    tags: ['Clinical Care & CPAP', 'Malawi'],
  },
  {
    title: 'Diagnostics for Neonatal Sepsis',
    fullTitle:
      'A call to bridge the diagnostic gap: diagnostic solutions for neonatal sepsis in low- and middle-income countries',
    authors: 'Gleeson B, Ferreyra C, Palamountain K, et al.',
    journal: 'BMJ Global Health',
    reference: 'BMJ Global Health. 2024;9:e015862.',
    doi: '10.1136/bmjgh-2024-015862',
    tags: ['Safety & Infection Control (IPC)', 'Technology Landscapes'],
  },
  {
    title: 'Changes in Service Readiness Scoring',
    fullTitle:
      'Small and sick newborn care: Changes in service readiness scoring between baseline and 2023 for 65 neonatal units implementing with NEST360 in Kenya, Malawi, Nigeria, and Tanzania',
    authors: 'Penzias RE, Ogero MO, Tillya R, et al.',
    journal: 'PLOS Global Public Health',
    reference: 'PLOS Glob Public Health.',
    doi: '10.1371/journal.pgph.0004367',
    tags: ['Quality Improvement & Data', ...COUNTRIES],
  },
  {
    title: 'Draft Publication (unpublished)',
    fullTitle: 'A draft publication. It must not appear on /publications or /resources until it is published.',
    authors: 'NEST360 Test Team',
    journal: 'Test',
    reference: '',
    date: '2026-01-01',
    doi: '10.0000/draft-test',
    tags: [],
    draft: true,
  },
]

const payload = await getPayload({ config })

// Finds or creates each tag. Resources only accept tags meant for files, so a tag that was only for pages
// is switched to "both" (local test data only).
async function tagId(name: string) {
  const { docs } = await payload.find({ collection: 'tags', where: { name: { equals: name } }, limit: 1 })
  const tag = docs[0]
  if (!tag) return (await payload.create({ collection: 'tags', data: { name, slug: '', usedFor: 'files' } })).id
  if (tag.usedFor === 'pages') await payload.update({ collection: 'tags', id: tag.id, data: { usedFor: 'both' } })
  return tag.id
}

// Downloads the paper's PDF and uploads it to Documents, which makes its first-page preview.
// Skipped when the resource already has a file, so a second run doesn't download again.
// Uses curl: Springer (BMC's publisher) answers Node's fetch with a cookie page instead of the PDF.
// If the download fails the paper is still saved, just without a file (it shows the plain color block).
async function pdfId(doi: string, existing: number | { id: number } | null | undefined) {
  if (existing) return typeof existing === 'object' ? existing.id : existing
  const url = `https://link.springer.com/content/pdf/${doi}.pdf`
  let data: Buffer
  try {
    const { stdout } = await promisify(execFile)('curl', ['-sfL', '--max-time', '90', url], {
      encoding: 'buffer',
      maxBuffer: 50 * 1024 * 1024,
    })
    data = stdout
  } catch (error) {
    payload.logger.warn({ err: error, msg: `Could not download ${url}; saving the paper without a PDF` })
    return null
  }
  if (data.subarray(0, 5).toString() !== '%PDF-') {
    payload.logger.warn(`${url} did not return a PDF; saving the paper without one`)
    return null
  }
  const name = `${path.basename(doi)}.pdf`
  payload.logger.info(`Downloaded ${name}`)
  const doc = await payload.create({
    collection: 'documents',
    data: { documentType: 'report' },
    file: { data, mimetype: 'application/pdf', name, size: data.length },
  })
  return doc.id
}

const slugify = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

// One at a time: SQLite allows a single writer
for (const sample of publications) {
  const slug = slugify(sample.title)
  const { docs } = await payload.find({ collection: 'resources', where: { slug: { equals: slug } }, limit: 1, draft: true })
  const tags: number[] = []
  for (const name of sample.tags) tags.push(await tagId(name))

  const data = {
    title: sample.title,
    slug,
    summary: sample.fullTitle,
    resourceType: 'publication',
    externalUrl: `https://doi.org/${sample.doi}`,
    document: sample.springerPdf ? await pdfId(sample.doi, docs[0]?.document) : null,
    language: 'en',
    tags,
    authors: sample.authors,
    journalOrPublisher: sample.journal,
    publicationDate: sample.date ? `${sample.date}T12:00:00.000Z` : null,
    doi: sample.doi,
    citation: `${sample.authors} ${sample.fullTitle}. ${sample.reference} doi:${sample.doi}`,
    _status: sample.draft ? 'draft' : 'published',
  } as const
  const draft = Boolean(sample.draft)

  const saved = docs[0]
    ? await payload.update({ collection: 'resources', id: docs[0].id, data, draft })
    : await payload.create({ collection: 'resources', data, draft })
  payload.logger.info(`Saved publication: ${saved.title}${draft ? ' (draft)' : ''}`)
}

process.exit(0)
