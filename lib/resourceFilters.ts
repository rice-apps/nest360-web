// The /resources search, filter and sort choices: reading them from the URL, writing them back, and applying
// them. Plain functions, so the server page (first load) and components/ResourceBrowser.tsx (every click
// after that, in the browser) filter the same way.
import type { Resource, ResourceCategory } from '@/app/(frontend)/resources/types';

// The id of the one filter form. The search box and the sort menu sit elsewhere on the page and join it
// through their `form` attribute, so without JavaScript every choice still ends up in the same URL.
export const FILTER_FORM_ID = 'resource-filters';

export const SORTS = {
  newest: 'Most Recent',
  oldest: 'Oldest',
  az: 'Alphabetical (A–Z)',
} as const;

export type Sort = keyof typeof SORTS;

// "Filter by Content Type": tag names, so a project's or resource's tags in the admin must use these names
export const CONTENT_TYPES = [
  'Job Aids & Posters',
  'Training Modules & Scenarios',
  'Videos',
  'Forms & Surveys',
  'Toolkits & Dashboards',
  'Reports & Frameworks',
] as const;

// "Filter by Topic / Focus": also tag names, matched the same way as content types
export const TOPICS = [
  'Technology Landscapes',
  'Clinical Care & CPAP',
  'Technical & Equipment Maintenance',
  'Safety & Infection Control (IPC)',
  'Quality Improvement & Data',
] as const;

// "Filter by User Type": each project's Audience in the admin
export const USER_TYPES: { value: ResourceCategory; label: string }[] = [
  { value: 'healthcare', label: 'Healthcare Professionals & BMETs' },
  { value: 'innovators', label: 'Innovators & Manufacturers' },
  { value: 'implementors', label: 'Implementers' },
  { value: 'families', label: 'Families' },
];

// A resource plus the date it sorts by (when it was last changed in the admin). Hard-coded cards have none,
// so they sort after the dated ones either way.
export interface Listed {
  resource: Resource;
  date?: string;
}

export interface Filters {
  query: string;
  sort: Sort;
  audiences: string[];
  tags: string[];
  topics: string[];
}

type SearchParams = Record<string, string | string[] | undefined>;

const list = (value: string | string[] | undefined) => (value === undefined ? [] : [value].flat());
const lower = (text: string) => text.toLocaleLowerCase('en-US');

export function parseFilters(params: SearchParams): Filters {
  const sort = list(params.sort)[0];
  return {
    query: (list(params.q)[0] ?? '').trim(),
    sort: sort && sort in SORTS ? (sort as Sort) : 'newest',
    audiences: list(params.audience),
    tags: list(params.tag),
    topics: list(params.topic),
  };
}

export const NO_FILTERS: Filters = { query: '', sort: 'newest', audiences: [], tags: [], topics: [] };

// The reverse of parseFilters, leaving out defaults: e.g. "?q=cpap&tag=Videos", or "" with nothing chosen
export function filtersToQuery({ query, sort, audiences, tags, topics }: Filters) {
  const params = new URLSearchParams();
  if (query.trim()) params.set('q', query.trim());
  if (sort !== 'newest') params.set('sort', sort);
  audiences.forEach((value) => params.append('audience', value));
  tags.forEach((value) => params.append('tag', value));
  topics.forEach((value) => params.append('topic', value));
  const text = params.toString();
  return text ? `?${text}` : '';
}

// Every word of the search must appear somewhere in the card's title, description or tags (any case)
function matchesQuery(resource: Resource, query: string) {
  const words = lower(query).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const text = lower([resource.title, resource.description, ...(resource.tags ?? [])].join(' '));
  return words.every((word) => text.includes(word));
}

// Whether a resource has any of the ticked tags (any case); with nothing ticked, every resource does
function hasAnyTag(resource: Resource, wanted: string[]) {
  if (!wanted.length) return true;
  const names = wanted.map(lower);
  return Boolean(resource.tags?.some((tag) => names.includes(lower(tag))));
}

// Each group keeps a resource when it matches any ticked box in that group; with nothing ticked, everything
// stays. The search and the groups together keep resources that match all of them.
export function applyFilters(items: Listed[], { query, sort, audiences, tags, topics }: Filters): Resource[] {
  const kept = items.filter(
    ({ resource }) =>
      matchesQuery(resource, query) &&
      (!audiences.length || audiences.includes(resource.category)) &&
      hasAnyTag(resource, tags) &&
      hasAnyTag(resource, topics),
  );

  const byTitle = (a: Listed, b: Listed) => a.resource.title.localeCompare(b.resource.title);
  const byDate = (a: Listed, b: Listed) => {
    if (!a.date || !b.date) return Number(!a.date) - Number(!b.date); // undated last
    return sort === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
  };

  return kept.sort(sort === 'az' ? byTitle : byDate).map(({ resource }) => resource);
}
