'use client';

// The filter sidebar on /resources. The choices live in the URL
// (/resources?q=oxygen&sort=az&tag=Training), the page filters on the server, and a
// filtered view can be shared. Ticking a box updates the URL with router.replace (no page reload) and keeps
// the search term. Without JavaScript the form still works as a plain GET form: Apply submits it.

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useTransition } from 'react';

import { SORTS, type Sort } from '@/lib/resourceFilters';

interface ResourceFiltersProps {
  sort: Sort;
  // Leave empty to hide the Audience group
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const q = searchParams.get('q') ?? '';
  const filtered = selectedAudiences.length > 0 || selectedTags.length > 0 || sort !== 'newest';
  // "Clear all" removes the filters but keeps the search term
  const clearHref = q ? `/resources?q=${encodeURIComponent(q)}` : '/resources';

  function onChange(event: React.ChangeEvent<HTMLFormElement>) {
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(event.currentTarget)) {
      if (typeof value === 'string') params.append(key, value);
    }
    if (q) params.set('q', q);
    startTransition(() => {
      router.replace(`/resources?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <form
      action="/resources"
      method="get"
      onChange={onChange}
      // rounded-[10px]: the Figma card corner
      className={`space-y-6 rounded-[10px] border border-gray-200 bg-white p-5 ${isPending ? 'opacity-70' : ''}`}
    >
      {/* Only used by the no-JavaScript fallback; with JavaScript, onChange adds q itself */}
      {q ? <input type="hidden" name="q" value={q} /> : null}

      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-nest-blue">Filter resources</h2>
        {filtered && (
          <Link href={clearHref} className="text-sm text-nest-blue underline hover:no-underline">
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

      {audiences.length > 0 && (
        <fieldset>
          <GroupHeading>Audience</GroupHeading>
          {audiences.map(({ value, label }) => (
            <Option key={value} type="checkbox" name="audience" value={value} label={label} checked={selectedAudiences.includes(value)} />
          ))}
        </fieldset>
      )}

      {tags.length > 0 && (
        <fieldset>
          <GroupHeading>Tags</GroupHeading>
          {tags.map((tag) => (
            <Option key={tag} type="checkbox" name="tag" value={tag} label={tag} checked={selectedTags.includes(tag)} />
          ))}
        </fieldset>
      )}

      {/* Only needed when JavaScript is off; otherwise every change updates the URL */}
      <noscript>
        <button className="w-full rounded-[30px] bg-nest-light-blue px-4 py-2 text-sm font-semibold text-nest-blue">
          Apply
        </button>
      </noscript>
    </form>
  );
}