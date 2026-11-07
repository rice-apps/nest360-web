import React from 'react';
import Link from 'next/link';
import { connection } from 'next/server';

import { ResourceGrid } from '@/components/ResourceGrid';
import { ResourceFilters } from '@/components/ResourceFilters';
import { ResourceSearchBox } from '@/components/ResourceSearchBox';
import { getResources, resourceToCard } from '@/lib/data/resources';
import { search } from '@/lib/data/search';
import { applyFilters, parseFilters, type Listed } from '@/lib/resourceFilters';

export default async function ResourcesPage({ searchParams }: PageProps<'/resources'>) {
  // Query CMS content at request time, after the deployment has a database available.
  await connection();

  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q.trim() : '';

  let listed: Listed[] = [];
  let failed = false;

  try {
    const [entries, matches] = await Promise.all([
      // Published resources only (see getResources)
      getResources(),
      // The search index covers title, text and tag names. No search term means "don't filter".
      q ? search({ query: q, collections: ['resources'], limit: 100 }) : null,
    ]);

    const matchedSlugs = matches ? new Set(matches.map((match) => match.slug)) : null;

    listed = entries
      .filter((entry) => !matchedSlugs || matchedSlugs.has(entry.slug))
      .map((entry) => ({
        resource: resourceToCard(entry),
        date: entry.publicationDate ?? entry.createdAt,
      }));
  } catch (error) {
    console.error('Failed to load /resources', error);
    failed = true;
  }

  // Resources have no audience, so any stale ?audience= in the URL is ignored
  const filters = { ...parseFilters(params), audiences: [] };
  const resources = applyFilters(listed, filters);
  // Every tag on any matching resource, A–Z, so the sidebar only offers tags that match something
  const allTags = [...new Set(listed.flatMap(({ resource }) => resource.tags ?? []))].sort((a, b) => a.localeCompare(b));

  const sidebar = (
    <ResourceFilters
      // Remounts the form when the URL changes, so "Clear all" also clears the ticked boxes
      key={JSON.stringify({ filters, q })}
      sort={filters.sort}
      audiences={[]}
      selectedAudiences={[]}
      tags={allTags}
      selectedTags={filters.tags}
    />
  );

  const filteredView = Boolean(q) || filters.tags.length > 0;

  return (
    <main className="min-h-screen bg-nest-neutral-100 pb-16">
      {/* search header section */}
      <section className="bg-white py-10 px-4 border-b border-gray-200 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="font-heading text-4xl font-bold text-nest-neutral-900 sm:text-5xl">Resources</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
            Our resources support clinicians, engineers, and administrators to implement an evidence-based model for sustainable, high-quality hospital-based newborn care in limited-resource settings.
          </p>

          {/* Not keyed on q, so it keeps focus and the cursor while you type */}
          <ResourceSearchBox initialQuery={q} />
        </div>
      </section>

      {/* results section */}
      {/* 1080px: the width left by the Figma 180px side margins on a 1440px frame */}
      <div className="max-w-[1080px] mx-auto px-4 py-10 md:flex md:items-start md:gap-8">
        {/* On phones the filters fold into a toggle, so the cards aren't pushed down a screen */}
        <details className="mb-8 md:hidden">
          <summary className="cursor-pointer rounded-[30px] border border-nest-blue px-4 py-2 text-center text-sm font-semibold text-nest-blue">
            Filter and sort
          </summary>
          <div className="mt-3">{sidebar}</div>
        </details>
        <aside className="hidden w-60 shrink-0 md:sticky md:top-6 md:block">{sidebar}</aside>

        <div className="min-w-0 flex-1 space-y-6">
          {/* Error state: the data couldn't be loaded, which is different from "nothing matched" */}
          {failed && (
            <div role="alert" className="rounded-[10px] border border-red-200 bg-white p-8 text-center">
              <p className="font-semibold text-red-700">We couldn&apos;t load resources right now.</p>
              <p className="mt-1 text-sm text-gray-600">Please try again in a moment.</p>
              <Link
                href="/resources"
                className="mt-4 inline-block rounded-[30px] bg-nest-light-blue px-6 py-2 text-sm font-semibold text-nest-blue hover:bg-nest-accent"
              >
                Try again
              </Link>
            </div>
          )}

          {/* Empty state */}
          {!failed && resources.length === 0 && (
            <p className="rounded-[10px] border border-gray-200 bg-white p-8 text-center text-gray-600">
              {q
                ? `No resources match "${q}".`
                : filteredView
                  ? 'No resources match these filters.'
                  : 'No resources have been published yet.'}
            </p>
          )}

          {!failed && resources.length > 0 && (
            <>
              <p className="text-sm text-gray-600" aria-live="polite">
                {resources.length} resource{resources.length === 1 ? '' : 's'}
                {q ? ` matching "${q}"` : ''}
              </p>
              <ResourceGrid columns={3} resources={resources} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}