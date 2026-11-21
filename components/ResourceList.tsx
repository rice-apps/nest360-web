import Image from 'next/image';
import React from 'react';

import type { Document, Media, Resource, Tag } from '@/payload-types';

// The list of resources on a project page (/resources/<slug>) and a technology page (/technology/<slug>):
// one row per resource, with its preview, a NEW badge and View / Download / Open buttons, split into
// sections by file tag. Both pages store resources the same way (fields/resourceGroups.ts).

// A resource as listed in one group, with that group's "new" setting
export type Item = Resource & { isNew: boolean };

export type PreviewSize = 'large' | 'small' | null;

// The part of a project or technology the list reads
type GroupRows = {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  resources: { resource: number | Resource; isNew?: boolean | null }[];
}[];

const LANGUAGES: Record<Item['language'], string> = {
  en: 'English',
  fr: 'French',
  pt: 'Portuguese',
  sw: 'Swahili',
};

// Relationships are IDs until populated; the pages query with enough depth to populate them
export function populated<T extends object>(value: number | T | null | undefined): T | null {
  return value && typeof value === 'object' ? value : null;
}

// Each group's resources, skipping any the visitor can't see (unpublished ones arrive as bare IDs)
export function groupItems<G extends GroupRows[number]>(groups: G[] | null | undefined) {
  return (groups ?? []).map((group) => ({
    ...group,
    resources: group.resources
      .map((row) => {
        const resource = populated<Resource>(row.resource);
        return resource ? { ...resource, isNew: Boolean(row.isNew) } : null;
      })
      .filter((item): item is Item => item !== null),
  }));
}

// The uploaded file, if the resource has one (documents always; publications sometimes)
export function fileOf(item: Item) {
  return item.resourceType === 'document' || item.resourceType === 'publication'
    ? populated<Document>(item.document)
    : null;
}

export function itemLink(item: Item): { href: string; details?: string; external: boolean } | null {
  const file = fileOf(item);
  if (file?.url) return { href: file.url, external: false };
  if (item.resourceType === 'video') {
    return item.videoUrl ? { href: item.videoUrl, details: 'Video', external: true } : null;
  }
  const details = item.resourceType === 'publication' ? 'Publication' : 'Outside link';
  return item.externalUrl ? { href: item.externalUrl, details, external: true } : null;
}

// The resource's own thumbnail, else the picture made from its file's first page.
// Uses the full image: the Media thumbnail size crops pages.
export function filePreview(item: Item) {
  const file = fileOf(item);
  if (!file) return null;
  const preview = populated<Media>(item.thumbnail) ?? populated<Media>(file.preview);
  return preview?.url ? preview : null;
}

// The small View / Download / Open buttons under each resource
const ACTION = 'rounded border border-[#41B6C4] px-3 py-1 text-[#41B6C4] hover:bg-[#41B6C4] hover:text-white';

function ItemRow({ item, previewSize }: { item: Item; previewSize: PreviewSize }) {
  const link = itemLink(item);
  if (!link) return null;
  const preview = previewSize ? filePreview(item) : null;
  const details = [link.details, item.language !== 'en' && LANGUAGES[item.language]].filter(Boolean).join(' · ');

  return (
    <li className={`flex gap-4 py-3 ${previewSize === 'large' ? 'flex-col items-start' : 'items-center'}`}>
      {preview && (
        // Pages can be portrait or landscape, so keep each preview's own shape
        <Image
          src={preview.url!}
          alt={preview.alt}
          width={preview.width ?? 90}
          height={preview.height ?? 127}
          className={`h-auto shrink-0 rounded border border-gray-200 ${previewSize === 'large' ? 'w-60 shadow-sm' : 'w-[90px]'}`}
        />
      )}
      <div className="min-w-0">
        <a
          href={link.href}
          {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="font-medium text-[#41B6C4] hover:underline"
        >
          {item.title}
        </a>
        {item.isNew && (
          <span className="ml-2 rounded bg-[#0A4162] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            New
          </span>
        )}
        {details && <p className="text-xs text-gray-500">{details}</p>}
        {/* One file at a time: View opens it in a new tab, Download saves just this file */}
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium">
          {link.external ? (
            <a href={link.href} target="_blank" rel="noopener noreferrer" className={ACTION}>
              Open
            </a>
          ) : (
            <>
              <a href={link.href} target="_blank" rel="noopener noreferrer" className={ACTION}>
                View
              </a>
              <a href={link.href} download className={ACTION}>
                Download
              </a>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

// Splits files into one section per file tag, in the order tags first appear. A file with two tags is in
// both sections; untagged files go last, in a section with no tag.
function sectionsByTag(items: Item[]) {
  const sections = new Map<number, { tag: Tag; items: Item[] }>();
  const untagged: Item[] = [];
  for (const item of items) {
    const itemTags = (item.tags ?? []).map((tag) => populated<Tag>(tag)).filter((tag) => tag !== null);
    if (!itemTags.length) untagged.push(item);
    for (const tag of itemTags) {
      if (!sections.has(tag.id)) sections.set(tag.id, { tag, items: [] });
      sections.get(tag.id)!.items.push(item);
    }
  }
  return [...sections.values(), ...(untagged.length ? [{ tag: null, items: untagged }] : [])];
}

// A list of files under their tag headings. With no file tags at all, just the plain list.
export function FileSections({ items, previewSize, small }: { items: Item[]; previewSize: PreviewSize; small?: boolean }) {
  const sections = sectionsByTag(items);
  const showHeadings = sections.some((section) => section.tag);

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.tag?.id ?? 'other'}>
          {showHeadings && (
            <h3
              className={`border-b border-gray-200 pb-1 font-semibold text-gray-700 ${small ? 'text-sm' : 'text-lg'}`}
            >
              {section.tag?.name ?? 'Other'}
            </h3>
          )}
          <ul className="divide-y divide-gray-100">
            {section.items.map((item, index) => (
              // A resource can be listed twice on one page, so its id alone isn't a unique key
              <ItemRow key={`${item.id}-${index}`} item={item} previewSize={previewSize} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// A grid of resource tiles, as in the tabs on nest360.org's technology pages: a large preview with the
// resource's title as a link underneath, each tile in a thin border (overlapped by 1px so neighbours share a line). Links and videos have no file to make a
// preview from, so they show their own thumbnail if one is set, else a plain box naming what they are.
export function ResourceTiles({ items }: { items: Item[] }) {
  const tiles = items
    .map((item) => ({ item, link: itemLink(item) }))
    .filter((tile): tile is { item: Item; link: NonNullable<ReturnType<typeof itemLink>> } => tile.link !== null);

  return (
    <ul className="grid grid-cols-1 pl-px pt-px sm:grid-cols-2 lg:grid-cols-3">
      {tiles.map(({ item, link }, index) => {
        const preview = populated<Media>(item.thumbnail) ?? filePreview(item);
        const external = link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
        const kind = [link.details ?? 'Document', item.language !== 'en' && LANGUAGES[item.language]]
          .filter(Boolean)
          .join(' · ');
        return (
          // A resource can be listed twice in one group, so its id alone isn't a unique key
          <li
            key={`${item.id}-${index}`}
            // Lifts with a shadow on hover; the preview zooms a little inside its box
            className="group relative -ml-px -mt-px flex flex-col border border-gray-300 bg-white p-6 transition duration-300 hover:z-10 hover:border-[#41B6C4] hover:shadow-xl motion-safe:hover:-translate-y-1"
          >
            <a href={link.href} {...external} tabIndex={-1} aria-hidden="true" className="block overflow-hidden">
              {preview?.url ? (
                <Image
                  src={preview.url}
                  alt=""
                  width={preview.width ?? 300}
                  height={preview.height ?? 400}
                  className="mx-auto h-72 w-full object-contain transition-transform duration-500 motion-safe:group-hover:scale-105"
                />
              ) : (
                <span className="flex h-72 items-center justify-center bg-nest-neutral-100 text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:bg-[#41B6C4]/10 group-hover:text-[#3298a4]">
                  {link.details ?? 'Document'}
                </span>
              )}
            </a>
            <div className="mt-4">
              <a href={link.href} {...external} className="text-lg text-[#41B6C4] underline decoration-transparent underline-offset-4 transition-colors duration-300 group-hover:text-[#3298a4] group-hover:decoration-current">
                {item.title}
              </a>
              {item.isNew && (
                <span className="ml-2 rounded bg-[#0A4162] px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wider text-white">
                  New
                </span>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {kind}
                {!link.external && (
                  <>
                    {' · '}
                    <a href={link.href} download className="underline hover:text-[#41B6C4]">
                      Download
                    </a>
                  </>
                )}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// 1-2 files: a large preview for each. More, in one list: a small preview for each.
// More, in titled groups: none per row (a page can show one at the top instead).
export function previewSizeFor(items: Item[], layout: 'list' | 'groups'): PreviewSize {
  const fileCount = items.filter((item) => fileOf(item)).length;
  return fileCount <= 2 ? 'large' : layout === 'list' ? 'small' : null;
}

