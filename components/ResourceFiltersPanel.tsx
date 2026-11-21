'use client';

// Connects ResourceFilters to the URL. The choices live in the URL
// (/resources?q=oxygen&tag=Training&topic=Oxygen), the page filters on the server, and a
// filtered view can be shared. Ticking a box updates the URL with router.replace (no reload)
// and keeps the search term and sort.

import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { ResourceFilters, type FilterGroup } from '@/components/ResourceFilters';

type Selected = Record<FilterGroup, string[]>;

// URL parameter for each group; these match the checkbox names, so the no-JS GET form agrees
const PARAM: Record<FilterGroup, string> = {
  audiences: 'audience',
  tags: 'tag',
  topics: 'topic',
};

function toHref(selected: Selected, q: string, sort?: string) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (sort) params.set('sort', sort);
  for (const group of Object.keys(PARAM) as FilterGroup[]) {
    for (const value of selected[group]) params.append(PARAM[group], value);
  }
  const query = params.toString();
  return query ? `/resources?${query}` : '/resources';
}

interface ResourceFiltersPanelProps {
  userTypes: { value: string; label: string }[];
  contentTypes: readonly string[];
  topics: readonly string[];
  initialSelected: Selected;
  q: string;
  // Passed through unchanged so filtering doesn't reset the sort order
  sort?: string;
}

export function ResourceFiltersPanel({
  userTypes,
  contentTypes,
  topics,
  initialSelected,
  q,
  sort,
}: ResourceFiltersPanelProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(initialSelected);
  const [isPending, startTransition] = useTransition();

  function navigate(next: Selected) {
    // Update the boxes straight away; the results follow when the server responds
    setSelected(next);
    startTransition(() => {
      router.replace(toHref(next, q, sort), { scroll: false });
    });
  }

  return (
    <ResourceFilters
      userTypes={userTypes}
      contentTypes={contentTypes}
      topics={topics}
      selected={selected}
      q={q}
      isPending={isPending}
      onToggle={(group, value) => {
        const current = selected[group];
        navigate({
          ...selected,
          [group]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        });
      }}
      onSubmit={() => navigate(selected)}
      // Reset clears the filters and sort but keeps the search term, like "Clear all" did
      onReset={() => {
        const empty = { audiences: [], tags: [], topics: [] };
        setSelected(empty);
        startTransition(() => {
          router.replace(toHref(empty, q), { scroll: false });
        });
      }}
    />
  );
}
