'use client';

// The search box on /resources. Clicking Search (or pressing Enter) updates ?q= in the URL with
// router.replace, so the server page re-renders with new results and the browser never reloads.
// Every other URL param (the sidebar's filters) is kept. Nothing runs while you type.

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useTransition } from 'react';

export function ResourceSearchBox({ initialQuery = '' }: { initialQuery?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  // Keeps the box in step with the URL when it changes elsewhere (Back button, a shared link)
  useEffect(() => setValue(initialQuery), [initialQuery]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault(); // stops the browser's full page load

    const params = new URLSearchParams(searchParams.toString());
    const term = value.trim();
    if (term) params.set('q', term);
    else params.delete('q');

    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }

  return (
    <form action="/resources" method="GET" onSubmit={onSubmit} className="flex max-w-2xl mx-auto mt-6 gap-2">
      <input
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search..."
        aria-busy={isPending}
        className="min-w-0 flex-1 rounded-[10px] border border-gray-200 bg-white px-4 py-3 text-base text-gray-700 placeholder-gray-400 outline-none focus:border-nest-light-blue"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-[30px] bg-nest-light-blue px-8 text-base font-semibold text-nest-blue transition-colors hover:bg-nest-accent disabled:opacity-70"
      >
        {isPending ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}