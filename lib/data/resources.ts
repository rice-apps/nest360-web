import config from "@payload-config";
import { getPayload } from "payload";

import type { Resource } from "@/app/(frontend)/resources/types";
import type { Listed } from "@/lib/resourceFilters";
import type { Document, Media, Resource as ResourceEntry, Tag } from "@/payload-types";

// Relationships are IDs until populated; depth 2 populates tags, the file, and the file's preview image
function populated<T extends object>(value: number | T | null | undefined): T | null {
  return value && typeof value === "object" ? value : null;
}

// Published resources, newest first. Drafts are excluded twice: by the explicit _status filter, and by
// overrideAccess: false, which applies the public read rule (publishedOrLoggedIn) with no user.
export async function getResources(): Promise<ResourceEntry[]> {

  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "resources",
    where: { _status: { equals: "published" } },
    depth: 2,
    limit: 100,
    sort: "-createdAt",
    overrideAccess: false,
  });
  return docs;
}

// Turns a resource from the admin into the card fields in resources/types.ts:
// - linkUrl: the video or external link; for a publication its paper page (Springer, Google Scholar, ...);
//   otherwise the uploaded file. Publications open in a new tab, as on /publications.
// - downloadUrl: the uploaded file, when there is one
// - image: the thumbnail, or else the PDF's first-page preview
// - category: 'library', since individual resources have no audience field (projects do)
export function resourceToCard(resource: ResourceEntry): Resource {
  const file = populated<Document>(resource.document);
  const picture = populated<Media>(resource.thumbnail) ?? populated<Media>(file?.preview);

  const linkUrl =
    resource.resourceType === "video"
      ? resource.videoUrl
      : resource.resourceType === "link" || resource.resourceType === "publication"
        ? (resource.externalUrl ?? file?.url)
        : (file?.url ?? resource.externalUrl);

  const tags = (resource.tags ?? [])
    .map((tag) => populated<Tag>(tag)?.name)
    .filter((name): name is string => Boolean(name));

  return {
    id: `resource-${resource.id}`,
    category: "library",
    title: resource.title,
    description: resource.summary,
    badgeText: resource.resourceType === "video" ? "Video" : undefined,
    image: picture?.url
      ? { url: picture.sizes?.thumbnail?.url ?? picture.url, alt: picture.alt ?? undefined }
      : undefined,
    publishedDate: resource.publicationDate ?? undefined,
    authorOrOrganization: resource.authors ?? resource.journalOrPublisher ?? undefined,
    linkUrl: linkUrl ?? undefined,
    opensInNewTab: resource.resourceType === "publication" || undefined,
    downloadUrl: file?.url ?? undefined,
    tags: [...new Set(tags)],
  };
}

// Every published publication (Resources with type "Publication"), most recently updated first, for the
// /publications gallery. The same records also appear in /resources search results, so staff enter each
// paper once. depth 2 fills in the file, its PDF preview, the thumbnail and the tags.
// overrideAccess: false applies the public's read rules, so drafts and unpublished entries are left out.
export async function getPublications() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "resources",
    where: { resourceType: { equals: "publication" } },
    depth: 2,
    limit: 500,
    sort: "-updatedAt",
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

// Turns a publication into a /publications card plus the date it sorts by:
// - image: its own thumbnail, else the picture made from its PDF's first page
// - linkUrl: the paper's page (Springer, Google Scholar, ...), else the uploaded file; opens in a new tab
// - publishedDate: when it was last saved in the admin, shown as "Posted: Month Year"
// - searchText: authors, journal, DOI and citation, so the search box finds them (tags/topics are searched too)
export function publicationToListed(publication: Publication): Listed {
  const file = populated<Document>(publication.document);
  const picture = populated<Media>(publication.thumbnail) ?? populated<Media>(file?.preview);
  const date = publication.updatedAt;

  const resource: Resource = {
    id: `publication-${publication.id}`,
    category: "library",
    title: publication.title,
    description: publication.summary,
    image: picture?.url ? { url: picture.url, alt: picture.alt } : undefined,
    linkUrl: publication.externalUrl ?? file?.url ?? undefined,
    opensInNewTab: true,
    publishedDate: date,
    authorOrOrganization: publication.authors ?? undefined,
    searchText: [publication.authors, publication.journalOrPublisher, publication.doi, publication.citation]
      .filter(Boolean)
      .join(" "),
    tags: (publication.tags ?? [])
      .map((tag) => populated<Tag>(tag)?.name)
      .filter((name): name is string => Boolean(name)),
  };

  return { resource, date };
}
