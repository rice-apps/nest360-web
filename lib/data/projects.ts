import config from "@payload-config";
import { getPayload } from "payload";

import type { Project } from "@/payload-types";

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
