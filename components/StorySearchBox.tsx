'use client';

// The search box on /stories. Once typing pauses for SEARCH_DELAY_MS, it changes ?q= in the URL with
// router.replace, so the server page renders the matching stories without a full page load. The chosen tag
// (?tag=) is kept. Search and Enter apply the text straight away. Without JavaScript it is still a plain GET
// form, so pressing Search works.

import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useTransition } from 'react';

import { storiesHref } from '@/lib/storiesHref';

// How long typing must pause before the search is applied
const SEARCH_DELAY_MS = 300;

interface StorySearchBoxProps {
  // ?q= and ?tag= from the URL the page was rendered with
  initialQuery: string;
  tag: string;
}

export function StorySearchBox({ initialQuery, tag }: StorySearchBoxProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(initialQuery);
  // The search text this box and the URL last agreed on. When the page comes back with the text this box
  // sent, nothing changes, so letters typed in the meantime are kept. When the URL changes some other way
  // (Back button, "Show all stories"), the box takes the new text.
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

  // After a pause in typing, put the text in the URL
  useEffect(() => {
    const term = value.trim();
    if (term === synced) return;
    const timer = setTimeout(() => {
      setSynced(term);
      startTransition(() => router.replace(storiesHref(term, tag), { scroll: false }));
    }, SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [value, synced, tag, router]);

  return (
    <form
      action="/stories"
      role="search"
      onSubmit={(event) => {
        event.preventDefault(); // apply here instead of a full page load
        const term = value.trim();
        if (term === synced) return;
        setSynced(term); // this also stops the waiting timer above
        startTransition(() => router.replace(storiesHref(term, tag), { scroll: false }));
      }}
      className="flex max-w-2xl mx-4 sm:mx-auto mt-6 shadow-sm rounded-md overflow-hidden border border-gray-200 mb-10"
    >
      <input
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search stories, topics or authors..."
        aria-label="Search stories"
        aria-busy={isPending}
        className="flex-1 min-w-0 px-4 py-3 outline-none text-gray-700 placeholder-gray-400 text-sm"
      />
      {tag && <input type="hidden" name="tag" value={tag} />}
      <button
        type="submit"
        className="bg-[#41B6C4] text-white px-8 font-medium hover:bg-[#3298a4] transition-colors text-sm"
      >
        Search
      </button>
    </form>
  );
}
