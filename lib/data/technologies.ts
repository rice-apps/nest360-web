import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";

import { TECHNOLOGY_CATEGORIES } from "@/lib/technologyCategories";
import type { Media, Technology } from "@/payload-types";

// One technology page by slug, e.g. "syringe-pump". Same query shape as getProjectBySlug (lib/data/projects.ts):
// depth 3 fills in each group's resources, their files and tags, each file's preview image, and the product
// photos.
// overrideAccess: false applies the public's read rules, so unpublished resources stay as bare IDs
// (which the page skips).
// cache: the page and its metadata both ask for the same technology, so look it up once per request
export const getTechnologyBySlug = cache(async (slug: string): Promise<Technology | null> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "technologies",
    where: { slug: { equals: slug } },
    depth: 3,
    limit: 1,
    overrideAccess: false,
    // Only the fields the page reads from each linked document
    populate: {
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
});

// What a gallery card shows
export type TechnologyCardData = Pick<Technology, "id" | "title" | "slug" | "categoryOfCare"> & {
  image?: { url: string; alt: string };
  products: string[];
};

// Every technology for the /technology gallery, in category order (as listed in lib/technologyCategories.ts)
// and then by title. depth 1 fills in the featured image and the product photos (the card's fallback image).
export async function getTechnologies(): Promise<TechnologyCardData[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "technologies",
    depth: 1,
    limit: 200,
    sort: "title",
    overrideAccess: false,
    select: { title: true, slug: true, categoryOfCare: true, featuredImage: true, qualifiedProducts: true },
    populate: {
      media: { filename: true, url: true, alt: true, sizes: { thumbnail: { filename: true, url: true } } },
    },
  });

  const order = TECHNOLOGY_CATEGORIES.map((category) => category.value as string);
  return docs
    .map(technologyToCard)
    .sort((a, b) => order.indexOf(a.categoryOfCare) - order.indexOf(b.categoryOfCare));
}

function populated<T extends object>(value: number | T | null | undefined): T | null {
  return value && typeof value === "object" ? value : null;
}

// The featured image, or else the first product photo. Gallery cards use the smaller thumbnail size.
export function technologyImage(technology: Pick<Technology, "featuredImage" | "qualifiedProducts">, size: "thumbnail" | "full") {
  const media = [technology.featuredImage, ...(technology.qualifiedProducts ?? []).map((product) => product.image)]
    .map((value) => populated<Media>(value))
    .find((value) => value?.url);
  if (!media?.url) return undefined;
  const url = size === "thumbnail" ? (media.sizes?.thumbnail?.url ?? media.url) : media.url;
  return { url, alt: media.alt, width: media.width, height: media.height };
}

export function technologyToCard(
  technology: Pick<Technology, "id" | "title" | "slug" | "categoryOfCare" | "featuredImage" | "qualifiedProducts">,
): TechnologyCardData {
  const image = technologyImage(technology, "thumbnail");
  return {
    id: technology.id,
    title: technology.title,
    slug: technology.slug,
    categoryOfCare: technology.categoryOfCare,
    image: image && { url: image.url, alt: image.alt },
    products: (technology.qualifiedProducts ?? []).map((product) => product.name),
  };
}
