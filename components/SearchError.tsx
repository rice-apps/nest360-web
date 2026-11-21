'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useTransition } from 'react';

import type { SearchFailure } from '@/lib/searchLoaders';

// What visitors see when /resources or /stories can't load: a short explanation and a Try again button,
// instead of a broken page or a "nothing matched" message that isn't true. Shared by both pages so they say
// the same thing (see lib/searchLoaders.ts for when a load counts as failed).

const DETAIL: Record<SearchFailure | 'unexpected', string> = {
  unavailable: 'Our search isn’t responding at the moment. This is usually temporary.',
  timeout: 'It’s taking longer than usual to respond. This is usually temporary.',
  unexpected: 'Something went wrong on our side. This is usually temporary.',
};

function ErrorPanel({
  noun,
  failure,
  retryHref,
  onRetry,
  retrying,
}: {
  // What couldn't load, e.g. "resources" or "stories"
  noun: string;
  failure: SearchFailure | 'unexpected';
  // Without JavaScript, Try again is a plain link to this address (the same page, search and filters)
  retryHref: string;
  onRetry: () => void;
  retrying: boolean;
}) {
  return (
    <div role="alert" className="rounded-[10px] border border-red-200 bg-white p-8 text-center">
      <p className="font-semibold text-red-700">We couldn&apos;t load {noun} right now.</p>
      <p className="mt-1 text-sm text-gray-600">
        {DETAIL[failure]} Your search and filters are kept, so you can try again.
      </p>
      <a
        href={retryHref}
        onClick={(event) => {
          event.preventDefault();
          if (!retrying) onRetry();
        }}
        aria-disabled={retrying}
        className={`mt-4 inline-flex cursor-pointer items-center gap-2 rounded-[30px] bg-nest-light-blue px-6 py-2.5 text-sm font-semibold text-nest-blue transition-colors hover:bg-nest-accent ${
          retrying ? 'opacity-70' : ''
        }`}
      >
        {retrying && (
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 rounded-full border-2 border-nest-blue border-t-transparent motion-safe:animate-spin"
          />
        )}
        {retrying ? 'Trying again…' : 'Try again'}
      </a>
    </div>
  );
}

// Shown by the page itself when its data didn't load. Try again asks the server for the same page again
// (router.refresh), so the visitor keeps their search, filters and scroll position, and the results replace
// this message as soon as the data loads.
export function SearchError({ noun, failure, retryHref }: { noun: string; failure: SearchFailure; retryHref: string }) {
  const router = useRouter();
  const [retrying, startTransition] = useTransition();
  return (
    <ErrorPanel
      noun={noun}
      failure={failure}
      retryHref={retryHref}
      retrying={retrying}
      onRetry={() => startTransition(() => router.refresh())}
    />
  );
}

// For a page's error.tsx: anything else that goes wrong while rendering the page. Uses Next's retry(), which
// re-fetches and re-renders the page.
export function SearchPageError({
  noun,
  error,
  retry,
}: {
  noun: string;
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const [retrying, startTransition] = useTransition();
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="min-h-screen bg-nest-neutral-100 px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <ErrorPanel
          noun={noun}
          failure="unexpected"
          // Reloads the same address, search and filters included
          retryHref=""
          retrying={retrying}
          onRetry={() => startTransition(() => retry())}
        />
      </div>
    </main>
  );
}
