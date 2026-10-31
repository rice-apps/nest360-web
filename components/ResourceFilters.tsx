'use client';

// The filter sidebar on /resources. A plain GET form, so the choices live in the URL
// (/resources?sort=az&audience=healthcare&tag=Training), the page filters on the server, and a filtered view
// can be shared. The only JavaScript submits the form as soon as a box is ticked; without it, Apply does.

import Link from 'next/link';
import React from 'react';

import { SORTS, type Sort } from '@/lib/resourceFilters';

interface ResourceFiltersProps {
  sort: Sort;
  audiences: { value: string; label: string }[];
  selectedAudiences: string[];
  tags: string[];
  selectedTags: string[];
}

// Figma "Subtitle 2" (bold uppercase), scaled down for a sidebar
function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <legend className="mb-2 font-heading text-xs font-bold uppercase tracking-wider text-nest-neutral-900">
      {children}
    </legend>
  );
}

function Option({ type, name, value, label, checked }: { type: 'radio' | 'checkbox'; name: string; value: string; label: string; checked: boolean }) {
  return (
    // items-start + mt-0.5 keeps the box beside the first line when a label wraps
    <label className="flex cursor-pointer items-start gap-2 py-1 text-sm text-gray-700 hover:text-nest-blue">
      <input type={type} name={name} value={value} defaultChecked={checked} className="mt-0.5 h-4 w-4 shrink-0 accent-nest-blue" />
      {label}
    </label>
  );
}

export function ResourceFilters({ sort, audiences, selectedAudiences, tags, selectedTags }: ResourceFiltersProps) {
  const filtered = selectedAudiences.length > 0 || selectedTags.length > 0 || sort !== 'newest';

  return (
    <form
      action="/resources"
      method="get"
      onChange={(event) => event.currentTarget.requestSubmit()}
      // rounded-[10px]: the Figma card corner
      className="space-y-6 rounded-[10px] border border-gray-200 bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-nest-blue">Filter resources</h2>
        {filtered && (
          <Link href="/resources" className="text-sm text-nest-blue underline hover:no-underline">
            Clear all
          </Link>
        )}
      </div>

      <fieldset>
        <GroupHeading>Sort by</GroupHeading>
        {Object.entries(SORTS).map(([value, label]) => (
          <Option key={value} type="radio" name="sort" value={value} label={label} checked={sort === value} />
        ))}
      </fieldset>

      <fieldset>
        <GroupHeading>Audience</GroupHeading>
        {audiences.map(({ value, label }) => (
          <Option key={value} type="checkbox" name="audience" value={value} label={label} checked={selectedAudiences.includes(value)} />
        ))}
      </fieldset>

      {tags.length > 0 && (
        <fieldset>
          <GroupHeading>Tags</GroupHeading>
          {tags.map((tag) => (
            <Option key={tag} type="checkbox" name="tag" value={tag} label={tag} checked={selectedTags.includes(tag)} />
          ))}
        </fieldset>
      )}

      {/* Only needed when JavaScript is off; otherwise every change submits the form */}
      <noscript>
        <button className="w-full rounded-[30px] bg-nest-light-blue px-4 py-2 text-sm font-semibold text-nest-blue">
          Apply
        </button>
      </noscript>
    </form>
  );
}
