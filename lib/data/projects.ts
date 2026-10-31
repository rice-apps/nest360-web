import config from "@payload-config";
import { getPayload } from "payload";

import type { Project } from "@/payload-types";

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
