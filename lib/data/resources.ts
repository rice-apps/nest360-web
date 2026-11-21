import config from '@payload-config';
import { getPayload } from 'payload';

import type { Resource } from '@/app/(frontend)/resources/types';
import type { Listed } from '@/lib/resourceFilters';
import type { Document, Media, Tag } from '@/payload-types';

// Relationships are IDs until populated; the query below uses enough depth to populate them
function populated<T extends object>(value: number | T | null | undefined): T | null {
  return value && typeof value === 'object' ? value : null;
}

// Every published publication (Resources with type "Publication"), most recently updated first. The same records feed
// /publications and the publication cards on /resources, so staff enter each paper once.
// depth 2 fills in the file, its PDF preview, the thumbnail and the tags.
// overrideAccess: false applies the public's read rules, so drafts and unpublished entries are left out.
export async function getPublications() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'resources',
    where: { resourceType: { equals: 'publication' } },
    depth: 2,
    limit: 500,
    sort: '-updatedAt',
    overrideAccess: false,
    // Only what publicationToListed reads. Leaves out `projects` (the "used on" join).
    select: {
      title: true,
      slug: true,
      summary: true,
      resourceType: true,
      document: true,
      externalUrl: true,
      thumbnail: true,
      tags: true,
      authors: true,
      journalOrPublisher: true,
      doi: true,
      citation: true,
      updatedAt: true,
    },
    populate: {
      // Payload builds url from filename, so both are needed
      documents: { filename: true, url: true, preview: true },
      media: { filename: true, url: true, alt: true },
      tags: { name: true },
    },
  });
  return docs;
}

// One publication as getPublications returns it (only the selected fields)
export type Publication = Awaited<ReturnType<typeof getPublications>>[number];

// Turns a publication from the admin into a card (resources/types.ts) plus the date it sorts by:
// - image: its own thumbnail, else the picture made from its PDF's first page
// - linkUrl: the paper's page (Springer, Google Scholar, ...), else the uploaded file; opens in a new tab
// - publishedDate: when it was last saved in the admin, shown as "Posted: Month Year"
// - searchText: authors, journal, DOI and citation, so the search box finds them (tags/topics are searched too)
export function publicationToListed(publication: Publication): Listed {
  const file = populated<Document>(publication.document);
  const picture = populated<Media>(publication.thumbnail) ?? populated<Media>(file?.preview);
  const date = publication.updatedAt;

  const resource: Resource = {
    // Prefixed so it can't clash with project cards or the hard-coded cards on /resources
    id: `publication-${publication.id}`,
    title: publication.title,
    description: publication.summary,
    image: picture?.url ? { url: picture.url, alt: picture.alt } : undefined,
    linkUrl: publication.externalUrl ?? file?.url ?? undefined,
    opensInNewTab: true,
    publishedDate: date,
    authorOrOrganization: publication.authors ?? undefined,
    searchText: [publication.authors, publication.journalOrPublisher, publication.doi, publication.citation]
      .filter(Boolean)
      .join(' '),
    tags: (publication.tags ?? [])
      .map((tag) => populated<Tag>(tag)?.name)
      .filter((name): name is string => Boolean(name)),
  };

  return { resource, date };
}
