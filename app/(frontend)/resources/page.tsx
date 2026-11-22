import React from 'react';
import { connection } from 'next/server';

import { ResourceGrid } from '@/components/ResourceGrid';
import { ResourceFiltersPanel } from '@/components/ResourceFiltersPanel';
import { SearchBox } from '@/components/SearchBox';
import { SearchError } from '@/components/SearchError';
import { getResources, resourceToCard } from '@/lib/data/resources';
import { search } from '@/lib/data/search';
import { TOPICS, applyFilters, parseFilters, type Listed } from '@/lib/resourceFilters';
import { loadResources, withSimulatedFailure } from '@/lib/searchLoaders';
import { simulatedFailure } from '@/lib/simulatedFailure';

const sortedUnique = (values: string[]) =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b));

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();

  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q.trim() : '';
  const sort = typeof params.sort === 'string' ? params.sort : undefined;

  // Published resources (see getResources), narrowed by the search index when there's a search term. If the
  // database or the search index fails or doesn't answer in time, `loaded` says so and the page shows an error
  // with Try again instead of "no results" (lib/searchLoaders.ts). In development the failure can be simulated.
  const loaded = await loadResources(
    { query: q },
    withSimulatedFailure({ getResources, search }, await simulatedFailure()),
  );
  const failed = !loaded.ok;
  const listed: Listed[] = loaded.ok
    ? loaded.data
        // Publications have their own gallery at /publications, so here they only show up in search results
        .filter((entry) => q || entry.resourceType !== 'publication')
        .map((entry) => ({
          resource: resourceToCard(entry),
          date: entry.publicationDate ?? entry.createdAt,
        }))
    : [];
  // Try again reloads exactly this address, so the search and filters are kept
  const query = new URLSearchParams(
    Object.entries(params).flatMap(([name, value]) => [value ?? []].flat().map((item) => [name, item])),
  ).toString();
  const retryHref = query ? `/resources?${query}` : '/resources';
    // Resources have no audience, so any stale ?audience= in the URL is ignored
  const filters = { ...parseFilters(params), audiences: [] };
  // The search index already narrowed by q (including body text), so don't search again here
  const resources = applyFilters(listed, { ...filters, query: '' });
    // Offer only tags that some matching resource has, A–Z. Tags named like a topic go under
  // Topic / Focus; every other tag goes under Content Type, so no tag is left out.
  const allTags = [...new Set(listed.flatMap(({ resource }) => resource.tags ?? []))].sort((a, b) =>
    a.localeCompare(b),
  );
  const isTopic = (tag: string) =>
    TOPICS.some((topic) => topic.toLowerCase() === tag.toLowerCase());

  const filteredView = Boolean(q) || filters.tags.length > 0 || filters.topics.length > 0;

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
          <SearchBox initialQuery={q} placeholder="Search..." label="Search resources" />
        </div>
      </section>

      {/* results section */}
      {/* 1080px: the width left by the Figma 180px side margins on a 1440px frame */}
      <div className="max-w-[1080px] mx-auto px-4 py-10 md:flex md:items-start md:gap-8">
        {/* Rendered once: the sidebar folds itself with its own Expand/Collapse toggle,
            and FILTER_FORM_ID must only appear once on the page */}
        <aside className="mb-8 rounded-[10px] border border-gray-200 bg-white md:sticky md:top-6 md:mb-0 md:w-60 md:shrink-0">
          <ResourceFiltersPanel
            key={JSON.stringify(filters)}
            initial={filters}
            contentTypes={allTags.filter((tag) => !isTopic(tag))}
            topics={allTags.filter(isTopic)}
          />
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          {/* Error state: the data couldn't be loaded, which is different from "nothing matched" */}
          {!loaded.ok && <SearchError noun="resources" failure={loaded.failure} retryHref={retryHref} />}

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
