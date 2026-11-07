'use client';

// The "Sort by" menu above the resource cards. It belongs to the sidebar's filter form (via `form`), so
// without JavaScript the Search button sends it along with the filters.

import React from 'react';

import { FILTER_FORM_ID, SORTS, type Sort } from '@/lib/resourceFilters';

export function SortSelect({ sort, onChange }: { sort: Sort; onChange: (sort: Sort) => void }) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-lg text-gray-600 sm:text-xl">Sort by:</span>
      <select
        name="sort"
        form={FILTER_FORM_ID}
        value={sort}
        onChange={(event) => onChange(event.target.value as Sort)}
        className="rounded-[4px] border border-gray-200 bg-white px-2 py-1.5 text-sm text-nest-neutral-900 outline-none focus:border-nest-accent"
      >
        {Object.entries(SORTS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
