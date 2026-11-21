import { RichText } from '@/components/RichText';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

import { ResourceGrid } from '@/components/ResourceGrid';
import {
  FileSections,
  filePreview,
  fileOf,
  groupItems,
  itemLink,
  populated,
  previewSizeFor,
} from '@/components/ResourceList';
import { firstSentence, getProjectBySlug, projectFiles, projectToResource } from '@/lib/data/projects';
import { AUDIENCE_TAGS, tagColor } from '@/lib/tagColors';
import type { Project } from '@/payload-types';

// Tab title and search-result text: the project's title and the first sentence of its description
export async function generateMetadata({ params }: PageProps<'/resources/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return { title: project.title, description: firstSentence(project.description) };
}

export default async function ProjectPage({ params }: PageProps<'/resources/[slug]'>) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  // The card's fields, so the page's tags match the card that was clicked
  const card = projectToResource(project);
  const audience = AUDIENCE_TAGS[project.category];
  // The files "Download all" zips up: the same ones listed below, once each
  const fileTotal = projectFiles(project).length;
  const related = (project.relatedProjects ?? [])
    .map((other) => populated<Project>(other))
    .filter((other) => other !== null);
  // Each group's resources, skipping any the visitor can't see (unpublished ones arrive as bare IDs)
  const groups = groupItems(project.resourceGroups);
  // The "one list" layout shows every group's resources together, without group titles
  const files = project.layout === 'list' ? groups.flatMap((group) => group.resources) : [];
  const titledGroups = project.layout === 'groups' ? groups : [];
  const allItems = groups.flatMap((group) => group.resources);

  // 1-2 files: a large preview for each. More, in one list: a small preview for each.
  // More, in groups: only the first PDF's preview, shown at the top.
  const previewSize = previewSizeFor(allItems, project.layout);
  const topPreview = previewSize
    ? null
    : allItems
        .filter((item) => fileOf(item)?.mimeType === 'application/pdf')
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
            {/* The same pills as this project's card: audience, the page tag, then its resources' tags */}
            <div className="flex flex-wrap gap-1.5">
              {audience && (
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${audience.className}`}>
                  {audience.label}
                </span>
              )}
              {card.tags?.map((tag) => (
                <span key={tag} className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tagColor(tag)}`}>
                  {tag}
                </span>
              ))}
            </div>
            <RichText
              data={project.description}
              className="space-y-3 text-sm leading-relaxed text-gray-600 [&_a]:text-[#41B6C4] [&_a]:underline"
            />
            {/* One .zip of every file on this page, saved to the visitor's downloads (see download/route.ts) */}
            {fileTotal > 0 && (
              <a
                href={`/resources/${project.slug}/download`}
                download
                className="inline-block rounded-md bg-[#41B6C4] px-6 py-3 text-sm font-medium text-white hover:bg-[#3298a4]"
              >
                Download all ({fileTotal} {fileTotal === 1 ? 'file' : 'files'}, .zip)
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
        {/* Rows with no link (e.g. a video with no URL) aren't shown, so count only the ones that are */}
        {!allItems.some((item) => itemLink(item)) && (
          <p className="rounded-lg border border-gray-100 bg-white p-6 text-center text-gray-600 shadow-sm">
            No resources have been published on this page yet.
          </p>
        )}

        {files.length > 0 && (
          <section className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <FileSections items={files} previewSize={previewSize} />
          </section>
        )}

        {titledGroups.map((group) => (
          <section key={group.id} className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-[#0A4162]">{group.title}</h2>
            <FileSections items={group.resources} previewSize={previewSize} small />
          </section>
        ))}

        <ResourceGrid
          title="Related resources"
          columns={3}
          resources={related.map(projectToResource)}
        />
      </div>
    </main>
  );
}
