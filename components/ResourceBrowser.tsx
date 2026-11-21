'use client';

// The search bar, filter sidebar, sort menu and cards on /resources. The server page loads every resource
// once; after that, pressing Search, ticking a box or changing the sort filters them right here in the browser,
// with no page reload. Each change also updates the URL (without a reload), so a filtered view can be shared
// and reopens filtered.

import React, { useEffect, useMemo, useState } from 'react';

import {
  applyFilters,
  CONTENT_TYPES,
  FILTER_FORM_ID,
  filtersToQuery,
  NO_FILTERS,
  TOPICS,
  USER_TYPES,
  type Filters,
  type Listed,
} from '@/lib/resourceFilters';

import { ResourceFilters, type FilterGroup } from './ResourceFilters';
import { ResourceGrid } from './ResourceGrid';
import { SortSelect } from './SortSelect';

interface ResourceBrowserProps {
  items: Listed[];
  // The choices in the URL the page was opened with
  initialFilters: Filters;
}

export function ResourceBrowser({ items, initialFilters }: ResourceBrowserProps) {
  const [filters, setFilters] = useState(initialFilters);
  // What's typed in the search box; it only becomes the search (filters.query) on Search or Enter
  const [draftQuery, setDraftQuery] = useState(initialFilters.query);
  const resources = useMemo(() => applyFilters(items, filters), [items, filters]);

  // replaceState rather than router.replace: the router would ask the server to render the page again
  useEffect(() => {
    window.history.replaceState(null, '', `/resources${filtersToQuery(filters)}`);
  }, [filters]);

  const toggle = (group: FilterGroup, value: string) =>
    setFilters((current) => ({
      ...current,
      [group]: current[group].includes(value)
        ? current[group].filter((item) => item !== value)
        : [...current[group], value],
    }));

  return (
    <>
      {/* Part of the sidebar's filter form (via `form`), so without JavaScript a search keeps the filters */}
      <div role="search" className="mx-auto flex max-w-[630px] px-4 pb-8">
        <label htmlFor="resource-search" className="sr-only">
          Search resources
        </label>
        <input
          id="resource-search"
          type="search"
          name="q"
          form={FILTER_FORM_ID}
          value={draftQuery}
          onChange={(event) => setDraftQuery(event.target.value)}
          placeholder="Search resources..."
          className="min-w-0 flex-1 rounded-l-[4px] border border-r-0 border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-nest-accent"
        />
        {/* Submits the filter form, which applies the typed search (see onSubmit below) */}
        <button
          type="submit"
          form={FILTER_FORM_ID}
          className="rounded-r-[4px] bg-nest-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-nest-light-blue"
        >
          Search
        </button>
      </div>

      {/* results: the sidebar against the left edge, a divider, then the count, sort menu and cards */}
      <div className="mx-auto max-w-[1440px] border-t border-gray-200 md:flex md:items-stretch">
        <aside className="border-b border-gray-200 md:w-64 md:shrink-0 md:border-b-0 md:border-r">
          <ResourceFilters
            userTypes={USER_TYPES}
            contentTypes={CONTENT_TYPES}
            topics={TOPICS}
            selected={filters}
            onToggle={toggle}
            // The Search button and Enter in the search box submit the form
            onSubmit={() => setFilters((current) => ({ ...current, query: draftQuery }))}
            onReset={() => {
              setFilters(NO_FILTERS);
              setDraftQuery('');
            }}
          />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-4 sm:px-6">
            <p className="text-xl font-bold text-nest-neutral-900 sm:text-2xl" aria-live="polite">
              {resources.length} {resources.length === 1 ? 'resource' : 'resources'} found
            </p>
            <SortSelect sort={filters.sort} onChange={(sort) => setFilters((current) => ({ ...current, sort }))} />
          </div>

          <div className="px-4 py-6 sm:px-6">
            {resources.length === 0 ? (
              <p className="rounded-[10px] border border-gray-200 bg-white p-8 text-center text-gray-600">
                No resources match your search and filters.
              </p>
            ) : (
              <ResourceGrid columns={3} resources={resources} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
