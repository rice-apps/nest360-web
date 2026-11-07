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
    // Only the fields the page reads from each linked document. Without this, related projects come
    // with all their groups and resources, and every resource with its "used on" list of projects.
    populate: {
      projects: { title: true, slug: true, featuredImage: true, description: true },
      resources: {
        title: true,
        resourceType: true,
        document: true,
        videoUrl: true,
        externalUrl: true,
        thumbnail: true,
        language: true,
        tags: true,
      },
      // Payload builds url from filename, so both are needed
      documents: { filename: true, url: true, mimeType: true, preview: true },
      media: {
        filename: true,
        url: true,
        alt: true,
        width: true,
        height: true,
        sizes: { thumbnail: { filename: true, url: true } },
      },
      tags: { name: true },
    },
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
    // Only what projectToResource reads from each linked document, so the page doesn't load every related
    // project, and every resource's "used on" list, in full
    populate: {
      projects: { title: true },
      resources: { resourceType: true, document: true, thumbnail: true, tags: true, publicationDate: true },
      documents: { filename: true, url: true, preview: true },
      media: { filename: true, url: true, alt: true, sizes: { thumbnail: { filename: true, url: true } } },
      tags: { name: true },
    },
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
// - lastModified: when the project was last saved
export function projectToResource(project: Project): Resource {
  // Each row holds a resource and that group's "new" setting. Unpublished resources arrive as bare IDs and
  // are skipped.
  const rows = (project.resourceGroups ?? []).flatMap((group) => group.resources ?? []);
  const items = rows
    .map((row) => populated<ResourceEntry>(row.resource))
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

  const badgeText = rows.some((row) => row.isNew && populated<ResourceEntry>(row.resource))
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
    lastModified: project.updatedAt,
    linkUrl: `/resources/${project.slug}`,
    downloadUrl: populated<Document>(project.downloadAll)?.url ?? undefined,
    tags: [...new Set(tagNames)],
  };
}
