import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext';
import { RichText } from '@payloadcms/richtext-lexical/react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

import { getProjectBySlug } from '@/lib/data/projects';
import type { Document, Media, Project, Tag } from '@/payload-types';

type Item = NonNullable<Project['files']>[number];

const LANGUAGES: Record<Item['language'], string> = {
  en: 'English',
  fr: 'French',
  pt: 'Portuguese',
  sw: 'Swahili',
};

// Relationships are IDs until populated; the page queries with enough depth to populate them
function populated<T extends object>(value: number | T | null | undefined): T | null {
  return value && typeof value === 'object' ? value : null;
}

// Card text for a project: the first sentence of its description
function firstSentence(description: Project['description']) {
  const text = convertLexicalToPlaintext({ data: description }).trim();
  return text.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? text;
}

function itemLink(item: Item): { href: string; details?: string } | null {
  if (item.kind === 'file') {
    const file = populated<Document>(item.file);
    return file?.url ? { href: file.url } : null;
  }
  if (item.kind === 'video') return item.videoUrl ? { href: item.videoUrl, details: 'Video' } : null;
  return item.url ? { href: item.url, details: 'Outside link' } : null;
}

// The picture made from a file's first page. Uses the full image: the Media thumbnail size crops pages.
function filePreview(item: Item) {
  if (item.kind !== 'file') return null;
  const preview = populated<Media>(populated<Document>(item.file)?.preview);
  return preview?.url ? preview : null;
}

type PreviewSize = 'large' | 'small' | null;

function ItemRow({ item, previewSize }: { item: Item; previewSize: PreviewSize }) {
  const link = itemLink(item);
  if (!link) return null;
  const preview = previewSize ? filePreview(item) : null;
  const external = item.kind !== 'file';
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
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="font-medium text-[#41B6C4] hover:underline"
        >
          {item.label}
        </a>
        {item.isNew && (
          <span className="ml-2 rounded bg-[#0A4162] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            New
          </span>
        )}
        {details && <p className="text-xs text-gray-500">{details}</p>}
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
function FileSections({ items, previewSize, small }: { items: Item[]; previewSize: PreviewSize; small?: boolean }) {
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
            {section.items.map((item) => (
              <ItemRow key={item.id} item={item} previewSize={previewSize} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default async function ProjectPage({ params }: PageProps<'/resources/[slug]'>) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const pageTag = populated<Tag>(project.tag);
  const downloadAll = populated<Document>(project.downloadAll);
  const related = (project.relatedProjects ?? [])
    .map((other) => populated<Project>(other))
    .filter((other) => other !== null);
  // Only the section matching the layout counts: the other may hold leftovers from before a switch
  const groups = project.layout === 'groups' ? (project.fileGroups ?? []) : [];
  const files = project.layout === 'list' ? (project.files ?? []) : [];
  const allItems = [...files, ...groups.flatMap((group) => group.files)];

  // 1-2 files: a large preview for each. More, in one list: a small preview for each.
  // More, in groups: only the first PDF's preview, shown at the top.
  const fileCount = allItems.filter((item) => item.kind === 'file').length;
  const previewSize: PreviewSize = fileCount <= 2 ? 'large' : project.layout === 'list' ? 'small' : null;
  const topPreview = previewSize
    ? null
    : allItems
        .filter((item) => populated<Document>(item.file)?.mimeType === 'application/pdf')
        .map(filePreview)
        .find((preview) => preview !== null);

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <section className="bg-white py-12 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col gap-8 md:flex-row">
          <div className="flex-1 space-y-4">
            <Link href="/resources" className="text-sm text-[#41B6C4] hover:underline">
              ← All resources
            </Link>
            <h1 className="text-4xl font-bold text-gray-800">{project.title}</h1>
            {pageTag && (
              <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs text-gray-600">{pageTag.name}</span>
            )}
            <RichText
              data={project.description}
              className="space-y-3 text-sm leading-relaxed text-gray-600 [&_a]:text-[#41B6C4] [&_a]:underline"
            />
            {downloadAll?.url && (
              <a
                href={downloadAll.url}
                className="inline-block rounded-md bg-[#41B6C4] px-6 py-3 text-sm font-medium text-white hover:bg-[#3298a4]"
              >
                Download all
              </a>
            )}
            {project.citation && <p className="text-xs italic text-gray-500">{project.citation}</p>}
          </div>
          {topPreview && (
            <Image
              src={topPreview.url!}
              alt={topPreview.alt}
              width={topPreview.width ?? 240}
              height={topPreview.height ?? 339}
              priority
              className="h-auto w-60 shrink-0 self-start rounded border border-gray-200 shadow-sm"
            />
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {files.length > 0 && (
          <section className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <FileSections items={files} previewSize={previewSize} />
          </section>
        )}

        {groups.map((group) => (
          <section key={group.id} className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-[#0A4162]">{group.title}</h2>
            <FileSections items={group.files} previewSize={previewSize} small />
          </section>
        ))}

        {related.length > 0 && (
          <section>
            <h2 className="mb-6 text-xl font-bold text-[#0A4162]">Related resources</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {related.map((other) => {
                const image = populated<Media>(other.featuredImage);
                return (
                  <Link
                    key={other.id}
                    href={`/resources/${other.slug}`}
                    className="flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    {image?.url ? (
                      <Image
                        src={image.sizes?.thumbnail?.url ?? image.url}
                        alt={image.alt}
                        width={400}
                        height={300}
                        className="h-44 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-[#0A4162] p-4">
                        <span className="text-center text-xs font-semibold uppercase tracking-wider text-white">
                          {other.title}
                        </span>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="mb-2 text-sm font-semibold text-[#41B6C4]">{other.title}</h3>
                      <p className="text-xs leading-relaxed text-gray-600">{firstSentence(other.description)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
