import config from '@payload-config'
  import { draftMode } from 'next/headers'
  import { getPayload } from 'payload'
  import { cache } from 'react'

  // cache
  export const getPageBySlug = cache(async (slug: string) =>
  {
      const { isEnabled: draft } = await draftMode()
      const payload = await getPayload({ config })

      const { docs } = await payload.find({
          collection: 'pages',
          where: { slug: { equals: slug } },
          depth: 1, // fills in the images inside blocks
          limit: 1,
          draft, // latest draft instead of the published version
          overrideAccess: draft, // the preview route already checked login
      })
      return docs[0] ?? null
  })