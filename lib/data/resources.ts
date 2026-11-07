import config from "@payload-config";
import { getPayload } from "payload";

import type { Resource } from "@/app/(frontend)/resources/types";
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
// - linkUrl: the video or external link, or else the uploaded file
// - downloadUrl: the uploaded file, when there is one
// - image: the thumbnail, or else the PDF's first-page preview
// - category: 'library', since individual resources have no audience field (projects do)
export function resourceToCard(resource: ResourceEntry): Resource {
  const file = populated<Document>(resource.document);
  const picture = populated<Media>(resource.thumbnail) ?? populated<Media>(file?.preview);

  const linkUrl =
    resource.resourceType === "video"
      ? resource.videoUrl
      : resource.resourceType === "link"
        ? resource.externalUrl
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
    downloadUrl: file?.url ?? undefined,
    tags: [...new Set(tags)],
  };
}