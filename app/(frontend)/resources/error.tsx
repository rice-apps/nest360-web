'use client'; // Error boundaries must be Client Components

import { SearchPageError } from '@/components/SearchError';

// Anything unexpected that breaks /resources while rendering: a message and Try again instead of a broken page.
// A failed search or database is handled by the page itself (lib/searchLoaders.ts); this is the safety net.
export default function ResourcesError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <SearchPageError noun="resources" {...props} />;
}
