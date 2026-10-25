import { getPayload } from 'payload'

import config from '../payload.config'

// Starting tags from the current nest360.org categories. Safe to run more than once.
const tags = [
  'Kenya',
  'Malawi',
  'Nigeria',
  'Tanzania',
  'Newborn Health',
  'Technology',
  'Training',
  'Stories',
  'News',
  'Research',
]

const payload = await getPayload({ config })

for (const name of tags) {
  const { totalDocs } = await payload.count({ collection: 'tags', where: { name: { equals: name } } })
  if (totalDocs === 0) {
    await payload.create({ collection: 'tags', data: { name, slug: '', usedFor: 'pages' } })
    payload.logger.info(`Created tag: ${name}`)
  }
}

process.exit(0)
