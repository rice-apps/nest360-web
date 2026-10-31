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
  });
  return docs[0] ?? null;
}
