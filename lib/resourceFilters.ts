// Reads the /resources filter choices from the URL and applies them. Not in components/ResourceFilters.tsx:
// that's a client component, and the server page can't read plain values from one.
import type { Resource } from '@/app/(frontend)/resources/types';

export const SORTS = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  az: 'Alphabetical (A–Z)',
} as const;

export type Sort = keyof typeof SORTS;

// A resource plus the date it sorts by: when it was added in the admin, or its published date. Hard-coded
// cards have neither, so they sort after the dated ones either way.
export interface Listed {
  resource: Resource;
  date?: string;
}

export interface Filters {
  sort: Sort;
  audiences: string[];
  tags: string[];
}

type SearchParams = Record<string, string | string[] | undefined>;

const list = (value: string | string[] | undefined) => (value === undefined ? [] : [value].flat());

export function parseFilters(params: SearchParams): Filters {
  const sort = list(params.sort)[0];
  return {
    sort: sort && sort in SORTS ? (sort as Sort) : 'newest',
    audiences: list(params.audience),
    tags: list(params.tag),
  };
}

// Audience and tags each keep a resource when it matches any ticked box; with nothing ticked, everything
// stays. Both together keep resources that match both.
export function applyFilters(items: Listed[], { sort, audiences, tags }: Filters): Resource[] {
  const kept = items.filter(
    ({ resource }) =>
      (!audiences.length || audiences.includes(resource.category)) &&
      (!tags.length || resource.tags?.some((tag) => tags.includes(tag))),
  );

  const byTitle = (a: Listed, b: Listed) => a.resource.title.localeCompare(b.resource.title);
  const byDate = (a: Listed, b: Listed) => {
    if (!a.date || !b.date) return Number(!a.date) - Number(!b.date); // undated last
    return sort === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
  };

  return kept.sort(sort === 'az' ? byTitle : byDate).map(({ resource }) => resource);
}
