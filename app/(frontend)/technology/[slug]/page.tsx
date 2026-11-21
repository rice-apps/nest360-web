import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

import { LightboxProvider, LightboxTrigger, type LightboxImage } from '@/components/Lightbox';
import { groupItems, itemLink, populated, ResourceTiles } from '@/components/ResourceList';
import { Tabs } from '@/components/Tabs';
import { RichText } from '@/components/RichText';
import { firstSentence, projectFiles } from '@/lib/data/projects';
import { getTechnologyBySlug } from '@/lib/data/technologies';
import { categoryLabel } from '@/lib/technologyCategories';
import type { Media, Technology } from '@/payload-types';

type Product = NonNullable<Technology['qualifiedProducts']>[number];

// The page's main actions: large, and on hover they lift with a stronger shadow while their icon moves
const BIG_BUTTON =
  'group inline-flex items-center gap-3 rounded-lg px-8 py-4 text-lg font-semibold shadow-md transition duration-300 hover:shadow-xl motion-safe:hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nest-blue';
const PRIMARY = `${BIG_BUTTON} bg-[#41B6C4] text-white hover:bg-[#3298a4]`;
const SECONDARY = `${BIG_BUTTON} border-2 border-[#41B6C4] bg-white text-[#2a8f9b] hover:bg-[#41B6C4] hover:text-white`;

// Small inline icons, so the buttons need no icon library
function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-5 w-5 transition-transform duration-300 motion-safe:group-hover:translate-x-1"
    >
      <path
        d="M4 10h11m-4-5 5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-5 w-5 transition-transform duration-300 motion-safe:group-hover:translate-y-0.5"
    >
      <path
        d="M10 3v10m-4-4 4 4 4-4M4 16h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Every photo on the page, once each, in the order they appear: the technology's own photo, then each product's.
// productPhoto maps a product's position to its photo's, so its row can open the lightbox at the right one.
// A product whose photo is the same upload as the featured image shares that entry.
function devicePhotos(technology: Technology) {
  const photos: LightboxImage[] = [];
  const indexById = new Map<number, number>();
  const add = (value: Technology['featuredImage'], caption: string) => {
    const media = populated<Media>(value);
    if (!media?.url) return undefined;
    if (!indexById.has(media.id)) {
      indexById.set(media.id, photos.length);
      photos.push({
        url: media.url,
        alt: media.alt,
        caption,
        width: media.width,
        height: media.height,
      });
    }
    return indexById.get(media.id);
  };
  add(technology.featuredImage, technology.title);
  const productPhoto = (technology.qualifiedProducts ?? []).map((product) => {
    const index = add(product.image, product.name);
    // The featured image is often one product's photo: name the product, which says more than the technology
    if (index === 0 && photos[0].caption === technology.title) photos[0].caption = product.name;
    return index;
  });
  return { photos, productPhoto };
}

// The label/value rows under each qualified product, in the order nest360.org lists them. Empty ones are left out.
function productDetails(product: Product): { label: string; value: React.ReactNode }[] {
  const consumables = (product.consumables ?? '')
    .split('\n')
    .map((line) => line.replace(/^[\s•*-]+/, '').trim())
    .filter(Boolean);
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: 'Regulation', value: product.regulation },
    { label: 'Price', value: product.price },
    {
      label: 'Consumables required',
      value: consumables.length ? (
        <ul className="list-disc space-y-1 pl-5">
          {consumables.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null,
    },
    { label: 'Voltage', value: product.voltage },
    { label: 'Power source', value: product.powerSource },
    { label: 'Warranty', value: product.warranty },
  ];
  return rows.filter((row) => row.value);
}

// The round +/- icon on each product row: the vertical bar folds away when the row is open, turning + into -
function ToggleIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-nest-blue text-white transition-transform duration-300 motion-safe:group-hover:scale-110"
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
        <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M8 3v10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="origin-center transition-transform duration-300 group-open:scale-y-0"
        />
      </svg>
    </span>
  );
}

// One qualified product as a collapsible row, as on nest360.org: closed, a grey bar with its name and a +;
// open, a white panel with a two-column table of its details. A native <details>, so it opens and closes
// without JavaScript and with the keyboard; globals.css animates the height where the browser supports it.
function ProductAccordion({ product, open, photoIndex }: { product: Product; open: boolean; photoIndex?: number }) {
  const image = populated<Media>(product.image);
  const details = productDetails(product);

  return (
    <details
      open={open}
      className="product-accordion group border border-gray-200 bg-[#F3F3F3] transition-colors duration-300 open:bg-white hover:border-[#41B6C4]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-heading text-xl text-gray-600 transition-colors duration-300 hover:text-nest-blue group-open:text-nest-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-nest-blue [&::-webkit-details-marker]:hidden">
        {product.name}
        <ToggleIcon />
      </summary>

      <div className="flex flex-col gap-6 px-6 pb-8 sm:flex-row">
        {image?.url && photoIndex !== undefined && (
          // Click to see it larger
          <LightboxTrigger index={photoIndex} label={product.name} className="h-40 w-40 shrink-0 self-start">
            <Image
              src={image.url}
              alt={image.alt}
              width={image.width ?? 160}
              height={image.height ?? 160}
              className="h-40 w-40 object-contain"
            />
          </LightboxTrigger>
        )}
        <div className="min-w-0 flex-1">
          {details.length > 0 && (
            <table className="w-full border-collapse border border-gray-200 text-base text-gray-600">
              <tbody>
                {details.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-gray-200 transition-colors duration-200 last:border-b-0 hover:bg-nest-neutral-100"
                  >
                    <th
                      scope="row"
                      className="w-1/3 border-r border-gray-400 px-6 py-4 text-left align-middle font-normal"
                    >
                      {row.label}
                    </th>
                    <td className="px-6 py-4 align-middle">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {product.productUrl && (
            <a
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2a8f9b] underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:decoration-current"
            >
              Manufacturer’s product page
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 motion-safe:group-hover/link:-translate-y-0.5 motion-safe:group-hover/link:translate-x-0.5"
              >
                ↗
              </span>
            </a>
          )}
        </div>
      </div>
    </details>
  );
}

// Tab title and search-result text: the technology's name and the first sentence of "About the device"
export async function generateMetadata({ params }: PageProps<'/technology/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const technology = await getTechnologyBySlug(slug);
  if (!technology) return {};
  return {
    title: technology.title,
    description: firstSentence(technology.description),
  };
}

// One technology's landing page, e.g. /technology/syringe-pump, laid out like the device pages on nest360.org:
// breadcrumb, category of care and "About the device", one tab per resource group (tiles from
// components/ResourceList.tsx), then the NEST360 Qualified products and where to buy them.
export default async function TechnologyDetailPage({ params }: PageProps<'/technology/[slug]'>) {
  const { slug } = await params;
  const technology = await getTechnologyBySlug(slug);
  if (!technology) notFound();

  const category = categoryLabel(technology.categoryOfCare);
  const { photos, productPhoto } = devicePhotos(technology);
  const products = technology.qualifiedProducts ?? [];
  // Groups with nothing the visitor can open (e.g. every resource unpublished) are left out
  const groups = groupItems(technology.resourceGroups).filter((group) => group.resources.some(itemLink));
  const fileTotal = projectFiles(technology).length;

  return (
    // Any photo on the page can open the large view (components/Lightbox.tsx)
    <LightboxProvider images={photos}>
      <main className="min-h-screen bg-white pb-16">
        {/* Breadcrumb, as on nest360.org */}
        <nav aria-label="Breadcrumb" className="border-b border-gray-200">
          <ol className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-4 text-base text-gray-500">
            <li>
              <Link
                href="/technology"
                className="text-[#41B6C4] underline underline-offset-2 transition-colors duration-300 hover:text-nest-blue"
              >
                Technology
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li>
              <span aria-current="page" className="text-[#41B6C4] underline underline-offset-2">
                {technology.title}
              </span>
            </li>
          </ol>
        </nav>

        <div className="mx-auto max-w-5xl px-4">
          <section className="space-y-5 border-b border-gray-200 py-10 text-gray-600">
            <h1 className="font-heading text-3xl font-semibold text-nest-neutral-900">{technology.title}</h1>
            {category && (
              <p className="text-lg">
                <strong className="font-semibold text-gray-700">Category of care:</strong> {category}
              </p>
            )}
            {/* The label runs into the first paragraph, like "About the device: Syringe pumps enable..." */}
            <div className="text-lg leading-relaxed">
              <strong className="font-semibold text-gray-700">About the device:</strong>{' '}
              <RichText
                data={technology.description}
                className="inline [&>p+p]:mt-3 [&>p:first-child]:inline [&_a]:text-[#41B6C4] [&_a]:underline"
              />
            </div>
          </section>

          <div className="space-y-12 py-10">
            {groups.length > 0 ? (
              <div>
                <Tabs
                  label={`${technology.title} resources`}
                  tabs={groups.map((group) => ({
                    id: group.id ?? group.title ?? '',
                    label: group.title ?? '',
                    content: (
                      <>
                        {group.description && <p className="mb-6 text-gray-600">{group.description}</p>}
                        <ResourceTiles items={group.resources} />
                      </>
                    ),
                  }))}
                />
                {/* One .zip of every file on this page, saved to the visitor's downloads (see download/route.ts) */}
                {fileTotal > 0 && (
                  <a href={`/technology/${technology.slug}/download`} download className={`mt-8 ${SECONDARY}`}>
                    <DownloadIcon />
                    Download all files ({fileTotal}, .zip)
                  </a>
                )}
              </div>
            ) : (
              <p className="rounded-lg border border-gray-100 bg-nest-neutral-100 p-6 text-center text-gray-600">
                No resources have been published for this technology yet.
              </p>
            )}

            {/* The device photos, side by side above the products as on nest360.org. Each opens a larger view. */}
            {photos.length > 0 && (
              <ul className="flex flex-wrap justify-center gap-6">
                {photos.map((photo, index) => (
                  <li key={photo.url}>
                    <LightboxTrigger
                      index={index}
                      label={photo.caption}
                      className="rounded-lg border border-gray-200 p-4 shadow-sm transition-shadow duration-300 hover:shadow-xl"
                    >
                      <Image
                        src={photo.url}
                        alt={photo.alt}
                        width={photo.width ?? 288}
                        height={photo.height ?? 288}
                        sizes="288px"
                        className="h-64 w-64 object-contain sm:h-72 sm:w-72"
                      />
                    </LightboxTrigger>
                  </li>
                ))}
              </ul>
            )}

            {products.length > 0 && (
              <section>
                <h2 className="mb-6 font-heading text-2xl font-semibold text-nest-blue">
                  NEST360 Qualified {technology.title} Products
                </h2>
                {/* The first product starts open, the rest closed */}
                <div className="space-y-6">
                  {products.map((product, index) => (
                    <ProductAccordion
                      key={product.id ?? index}
                      product={product}
                      open={index === 0}
                      photoIndex={productPhoto[index]}
                    />
                  ))}
                </div>
              </section>
            )}

            {technology.purchaseUrl && (
              <div className="flex justify-center">
                <a href={technology.purchaseUrl} target="_blank" rel="noopener noreferrer" className={PRIMARY}>
                  Purchase NEST360 Qualified Products
                  <ArrowIcon />
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </LightboxProvider>
  );
}
