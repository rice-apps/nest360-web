import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug: string }>
}

// Placeholder destination until country pages exist.
const PLACEHOLDER_HREF = '#'

const css = `
.pg-section { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }
.pg-heading { text-align: center; font-size: 2.25rem; font-weight: 600; color: #333; margin: 2rem 0 3rem; }
.pg-body { font-size: 1.15rem; line-height: 1.7; color: #111; }
.pg-body p { margin: 0 0 1.25rem; }
.pg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3.5rem 4rem; padding: 3rem 2rem 4rem; max-width: 1400px; margin: 0 auto; }
.pg-card { display: block; background: #fff; padding: 1rem 1rem 1.25rem; box-shadow: 0 10px 25px rgba(0,0,0,0.12); text-decoration: none; color: inherit; transition: transform .2s ease, box-shadow .2s ease; }
.pg-card:hover { transform: translateY(-4px); box-shadow: 0 14px 30px rgba(0,0,0,0.18); }
.pg-image { aspect-ratio: 3 / 2; overflow: hidden; }
.pg-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pg-country { margin: 1rem 0 0; font-size: 1.5rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: #1a4a72; }
@media (max-width: 1024px) { .pg-grid { grid-template-columns: repeat(2, 1fr); gap: 2.5rem; } }
@media (max-width: 640px) { .pg-grid { grid-template-columns: 1fr; } .pg-heading { font-size: 1.75rem; } }
`

async function getPage(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 1, // populates each country's image
    limit: 1,
  })
  return docs[0]
}

export default async function PageRoute({ params }: Args) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()

  return (
    <main>
      <style>{css}</style>

      <section className="pg-section">
        <h1 className="pg-heading">{page.title}</h1>
        {page.intro && (
          <div className="pg-body">
            <RichText data={page.intro} />
          </div>
        )}
      </section>

      <div className="pg-grid">
        {(page.countries ?? []).map((country, i) => {
          const image = typeof country.image === 'object' ? country.image : null
          const href = country.link || PLACEHOLDER_HREF
          const isExternal = /^https?:\/\//.test(href)

          const content = (
            <>
              {image?.url && (
                <div className="pg-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.url} alt={image.alt || country.name} />
                </div>
              )}
              <h2 className="pg-country">{country.name}</h2>
            </>
          )

          return isExternal ? (
            <a key={country.id ?? i} href={href} className="pg-card">
              {content}
            </a>
          ) : (
            <Link key={country.id ?? i} href={href} className="pg-card">
              {content}
            </Link>
          )
        })}
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: Args) {
  const { slug } = await params
  const page = await getPage(slug)
  return { title: page?.title ?? 'NEST360' }
}
