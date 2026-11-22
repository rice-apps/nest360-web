'use client';

// The live search box on /resources and /stories. Once typing pauses for SEARCH_DELAY_MS, it updates ?q= in the
// URL with router.replace, so the server page re-renders with the new results and the browser never reloads.
// Clicking Search (or pressing Enter) applies the text straight away. Every other URL param (the sidebar's
// filters and sort on /resources, the tag on /stories) is kept. Without JavaScript it's a plain GET form that
// also keeps them, so pressing Search still works.

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState, useTransition } from 'react';

// How long typing must pause before the search is applied
const SEARCH_DELAY_MS = 300;

interface SearchBoxProps {
  // ?q= from the URL the page was rendered with
  initialQuery?: string;
  placeholder: string;
  // Read by screen readers, e.g. "Search resources"
  label: string;
}

export function SearchBox({ initialQuery = '', placeholder, label }: SearchBoxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  // The search text this box and the URL last agreed on. When the page comes back with the text this box
  // sent, nothing changes, so letters typed in the meantime are kept. When the URL changes some other way
  // (Back button, a shared link, "Show all"), the box takes the new text.
  const [synced, setSynced] = useState(initialQuery);
  // The ?q= the page was last rendered with, to notice when it changes
  const [seenQuery, setSeenQuery] = useState(initialQuery);
  if (initialQuery !== seenQuery) {
    setSeenQuery(initialQuery);
    if (initialQuery !== synced) {
      setSynced(initialQuery);
      setValue(initialQuery);
    }
  }

  const apply = useCallback(
    (term: string) => {
      setSynced(term); // this also stops the waiting timer below
      const params = new URLSearchParams(searchParams.toString());
      if (term) params.set('q', term);
      else params.delete('q');
      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  // After a pause in typing, put the text in the URL
  useEffect(() => {
    const term = value.trim();
    if (term === synced) return;
    const timer = setTimeout(() => apply(term), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [value, synced, apply]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault(); // stops the browser's full page load
    const term = value.trim();
    if (term !== synced) apply(term);
  }

  return (
    <form action={pathname} method="GET" role="search" onSubmit={onSubmit} className="mx-auto mt-6 flex max-w-2xl gap-2">
      <input
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        aria-busy={isPending}
        className="min-w-0 flex-1 rounded-[10px] border border-gray-200 bg-white px-4 py-3 text-base text-gray-700 placeholder-gray-400 outline-none focus:border-nest-light-blue"
      />
      {/* Without JavaScript, the form only sends its own fields, so carry the other params along */}
      {[...searchParams.entries()]
        .filter(([name]) => name !== 'q')
        .map(([name, paramValue], index) => (
          <input key={`${name}-${index}`} type="hidden" name={name} value={paramValue} />
        ))}
      <button
        type="submit"
        disabled={isPending}
        className="cursor-pointer rounded-[30px] bg-nest-light-blue px-8 text-base font-semibold text-nest-blue transition-colors hover:bg-nest-accent disabled:opacity-70"
      >
        {isPending ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}
