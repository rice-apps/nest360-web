import config from "@payload-config";
import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";
import { getPayload } from "payload";

import type { Resource } from "@/app/(frontend)/resources/types";
import type { Document, Media, Project, Tag } from "@/payload-types";

// depth 2 fills in files, images and tags, plus the featured images of related projects
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "projects",
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  });
  return docs[0] ?? null;
}

// CLAUDE CHANGE: new. Every project for the resource library, newest first. depth 2 fills in the featured
// image, tags, and each file's document and preview, which the cards need.
export async function getProjects(): Promise<Project[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "projects",
    depth: 2,
    limit: 100,
    sort: "-createdAt",
  });
  return docs;
}

// Relationships are IDs until populated; the queries above use enough depth to populate them
function populated<T extends object>(value: number | T | null | undefined): T | null {
  return value && typeof value === "object" ? value : null;
}

// CLAUDE CHANGE: moved here from resources/[slug]/page.tsx so the library cards can use it too.
// Card text for a project: the first sentence of its description
export function firstSentence(description: Project["description"]) {
  const text = convertLexicalToPlaintext({ data: description }).trim();
  return text.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? text;
}

// CLAUDE CHANGE: new. Turns a project from the admin into the card fields in resources/types.ts:
// - image: the featured image, or else the preview of the project's first PDF
// - badgeText: "New" when any file is marked new, otherwise "Video" when the project has a video
// - tags: the page tag, then the file tags, without repeats
// - downloadUrl: the "Download all" file
// Projects have no published date or author yet, so cards from the admin don't show that line.
export function projectToResource(project: Project): Resource {
  const items = [
    ...(project.files ?? []),
    ...(project.fileGroups ?? []).flatMap((group) => group.files),
  ];

  const featured = populated<Media>(project.featuredImage);
  const preview = items
    .map((item) => populated<Media>(populated<Document>(item.file)?.preview))
    .find((media) => media?.url);
  const image = featured?.url
    ? { url: featured.sizes?.thumbnail?.url ?? featured.url, alt: featured.alt }
    : preview?.url
      ? { url: preview.url, alt: preview.alt }
      : undefined;

  const badgeText = items.some((item) => item.isNew)
    ? "New"
    : items.some((item) => item.kind === "video")
      ? "Video"
      : undefined;

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
    linkUrl: `/resources/${project.slug}`,
    downloadUrl: populated<Document>(project.downloadAll)?.url ?? undefined,
    tags: [...new Set(tagNames)],
  };
}
