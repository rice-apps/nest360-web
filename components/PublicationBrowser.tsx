'use client';

// The search bar, sort menu and cards on /publications. Like ResourceBrowser: the server page loads every
// publication once, then searching and sorting happen right here, and the URL is kept in step so a search
// can be shared. Without JavaScript, the form below submits to /publications and the server applies it.
// Shows PAGE_SIZE publications at a time, with page numbers under the cards when there are more.

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { applyFilters, FILTER_FORM_ID, filtersToQuery, type Filters, type Listed } from '@/lib/resourceFilters';

import { Pagination } from './Pagination';
import { PublicationCard } from './PublicationCard';
import { SortSelect } from './SortSelect';

export const PAGE_SIZE = 10;

interface PublicationBrowserProps {
  items: Listed[];
  initialFilters: Filters;
  initialPage: number;
}

// /publications with the search, sort and page, e.g. /publications?q=cpap&page=2 (page 1 is left out)
function publicationsHref(filters: Filters, page: number) {
  const params = new URLSearchParams(filtersToQuery(filters));
  if (page > 1) params.set('page', String(page));
  const text = params.toString();
  return text ? `/publications?${text}` : '/publications';
}

export function PublicationBrowser({ items, initialFilters, initialPage }: PublicationBrowserProps) {
  const [filters, setFiltersOnly] = useState(initialFilters);
  const [page, setPage] = useState(initialPage);
  // What's typed in the search box; it only becomes the search on Search or Enter
  const [draftQuery, setDraftQuery] = useState(initialFilters.query);
  const results = useRef<HTMLElement>(null);
  const publications = useMemo(() => applyFilters(items, filters), [items, filters]);

  // A new search or sort starts again from page 1
  const setFilters: typeof setFiltersOnly = (update) => {
    setFiltersOnly(update);
    setPage(1);
  };

  // A page number past the end (e.g. an old link) shows the last page
  const totalPages = Math.max(1, Math.ceil(publications.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const shown = publications.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // replaceState rather than router.replace, so the server isn't asked to render the page again
  useEffect(() => {
    window.history.replaceState(null, '', publicationsHref(filters, currentPage));
  }, [filters, currentPage]);

  const goToPage = (target: number) => {
    setPage(target);
    // Back to the top of the results, so the new page's first cards are in view
    results.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* The form id is the one SortSelect joins, so without JavaScript the sort is sent with the search */}
      <form
        id={FILTER_FORM_ID}
        action="/publications"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          setFilters((current) => ({ ...current, query: draftQuery.trim() }));
        }}
        className="mx-auto flex max-w-[630px] px-4 pb-8"
      >
        <label htmlFor="publication-search" className="sr-only">
          Search publications
        </label>
        <input
          id="publication-search"
          type="search"
          name="q"
          value={draftQuery}
          onChange={(event) => setDraftQuery(event.target.value)}
          placeholder="Search publications, authors or topics..."
          className="min-w-0 flex-1 rounded-l-[4px] border border-r-0 border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-nest-accent"
        />
        <button
          type="submit"
          className="rounded-r-[4px] bg-nest-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-nest-light-blue"
        >
          Search
        </button>
      </form>

      <section ref={results} className="mx-auto max-w-[1440px] scroll-mt-4 px-4 pb-16 sm:px-6">
        <div className="rounded-sm border border-gray-200">
          <div className="mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 py-4 sm:mx-6">
            <h2 className="text-xl font-bold text-nest-neutral-900 sm:text-2xl" aria-live="polite">
              {publications.length} {publications.length === 1 ? 'publication' : 'publications'} found
            </h2>
            <SortSelect sort={filters.sort} onChange={(sort) => setFilters((current) => ({ ...current, sort }))} />
          </div>

          <div className="px-4 py-6 sm:px-6">
            {publications.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
                {items.length === 0 ? (
                  <p>No publications have been posted yet. Check back soon.</p>
                ) : (
                  <>
                    <p>No publications match &ldquo;{filters.query}&rdquo;.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setDraftQuery('');
                        setFilters((current) => ({ ...current, query: '' }));
                      }}
                      className="mt-2 text-nest-blue underline"
                    >
                      Show all publications
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                {/* A list, so screen readers announce how many publications are on this page */}
                <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {shown.map(({ id, ...publication }) => (
                    <li key={id}>
                      <PublicationCard id={id} {...publication} />
                    </li>
                  ))}
                </ul>
                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  hrefFor={(target) => publicationsHref(filters, target)}
                  onChange={goToPage}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
