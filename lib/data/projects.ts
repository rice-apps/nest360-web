import config from "@payload-config";
import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";
import { getPayload } from "payload";

import type { Resource } from "@/app/(frontend)/resources/types";
import type { Document, Media, Project, Resource as ResourceEntry, Tag } from "@/payload-types";

// depth 3 fills in each group's resources, their files and tags, and each file's preview image,
// plus the featured images of related projects.
// overrideAccess: false applies the public's read rules, so unpublished resources stay as bare IDs
// (which the page skips).
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "projects",
    where: { slug: { equals: slug } },
    depth: 3,
    limit: 1,
    overrideAccess: false,
  });
  return docs[0] ?? null;
}

// Every project for the resource library, newest first. depth 3 fills in each group's resources, their tags
// and thumbnails, and each file's preview, which the cards need. Like getProjectBySlug, it applies the
// public's read rules, so unpublished resources don't count toward a card.
export async function getProjects(): Promise<Project[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "projects",
    depth: 3,
    limit: 100,
    sort: "-createdAt",
    overrideAccess: false,
  });
  return docs;
}

// Relationships are IDs until populated; the queries above use enough depth to populate them
function populated<T extends object>(value: number | T | null | undefined): T | null {
  return value && typeof value === "object" ? value : null;
}

// Card text for a project: the first sentence of its description
export function firstSentence(description: Project["description"]) {
  const text = convertLexicalToPlaintext({ data: description }).trim();
  return text.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? text;
}

// Turns a project from the admin into the card fields in resources/types.ts, from the resources it lists:
// - image: the featured image, or else the first resource's thumbnail or PDF preview
// - badgeText: "New" when any resource is marked new, otherwise "Video" when one is a video
// - publishedDate: the most recent publication date among its resources, if any have one
// - tags: the page tag, then the resources' tags, without repeats
// - downloadUrl: the "Download all" file
export function projectToResource(project: Project): Resource {
  const items = (project.resourceGroups ?? [])
    .flatMap((group) => group.resources)
    .map((item) => populated<ResourceEntry>(item))
    .filter((item) => item !== null);

  const featured = populated<Media>(project.featuredImage);
  const fallback = items
    .map((item) => populated<Media>(item.thumbnail) ?? populated<Media>(populated<Document>(item.document)?.preview))
    .find((media) => media?.url);
  const image = featured?.url
    ? { url: featured.sizes?.thumbnail?.url ?? featured.url, alt: featured.alt }
    : fallback?.url
      ? { url: fallback.url, alt: fallback.alt }
      : undefined;

  const badgeText = items.some((item) => item.isNew)
    ? "New"
    : items.some((item) => item.resourceType === "video")
      ? "Video"
      : undefined;

  const publishedDate = items
    .map((item) => item.publicationDate)
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1);

  const tagNames = [project.tag, ...items.flatMap((item) => item.tags ?? [])]
    .map((tag) => populated<Tag>(tag)?.name)
    .filter((name): name is string => Boolean(name));

  return {
    // Prefixed so it can't clash with the ids of the hard-coded cards on /resources ("1", "2", ...)
    id: `project-${project.id}`,
    category: project.category,
    title: project.title,
    description: firstSentence(project.description),
    badgeText,
    image,
    publishedDate,
    linkUrl: `/resources/${project.slug}`,
    downloadUrl: populated<Document>(project.downloadAll)?.url ?? undefined,
    tags: [...new Set(tagNames)],
  };
}
