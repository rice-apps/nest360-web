'use client';

// Connects ResourceFilters to the URL. The choices live in the URL
// (/resources?q=oxygen&tag=Videos&topic=Clinical+Care+%26+CPAP), the page filters on the
// server, and a filtered view can be shared. Ticking a box updates the URL with
// router.replace (no reload) and keeps the search term and sort.

import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { ResourceFilters } from '@/components/ResourceFilters';
import {
  NO_FILTERS,
  USER_TYPES,
  filtersToQuery,
  type Filters,
} from '@/lib/resourceFilters';

interface ResourceFiltersPanelProps {
  initial: Filters;
  contentTypes: readonly string[];
  topics: readonly string[];
  // Off until resources in the CMS have a category to filter on
  showUserTypes?: boolean;
}

export function ResourceFiltersPanel({
  initial,
  contentTypes,
  topics,
  showUserTypes = false,
}: ResourceFiltersPanelProps) {

  const router = useRouter();
  const [filters, setFilters] = useState(initial);
  const [isPending, startTransition] = useTransition();

  function navigate(next: Filters) {
    // Update the boxes straight away; the results follow when the server responds
    setFilters(next);
    startTransition(() => {
      router.replace(`/resources${filtersToQuery(next)}`, { scroll: false });
    });
  }

  return (
    <ResourceFilters
      userTypes={showUserTypes ? USER_TYPES : []}
      contentTypes={contentTypes}
      topics={topics}
      selected={{ audiences: filters.audiences, tags: filters.tags, topics: filters.topics }}
      q={filters.query}
      isPending={isPending}
      onToggle={(group, value) => {
        const current = filters[group];
        navigate({
          ...filters,
          [group]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        });
      }}
      onSubmit={() => navigate(filters)}
      // Reset clears the filters and sort but keeps the search term
      onReset={() => navigate({ ...NO_FILTERS, query: filters.query })}
    />
  );
}
