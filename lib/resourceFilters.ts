import type { Resource, ResourceCategory } from '@/app/(frontend)/resources/types';

export const FILTER_FORM_ID = 'resource-filters';

export const SORTS = {
  newest: 'Most Recent',
  oldest: 'Oldest',
  az: 'Alphabetical (A–Z)',
} as const;

export type Sort = keyof typeof SORTS;

export const CONTENT_TYPES = [
  'Job Aids & Posters',
  'Training Modules & Scenarios',
  'Videos',
  'Forms & Surveys',
  'Toolkits & Dashboards',
  'Reports & Frameworks',
] as const;

export const TOPICS = [
  'Technology Landscapes',
  'Clinical Care & CPAP',
  'Technical & Equipment Maintenance',
  'Safety & Infection Control (IPC)',
  'Quality Improvement & Data',
] as const;

export const USER_TYPES: { value: ResourceCategory; label: string }[] = [
  { value: 'healthcare', label: 'Healthcare Professionals & BMETs' },
  { value: 'innovators', label: 'Innovators & Manufacturers' },
  { value: 'implementors', label: 'Implementers' },
  { value: 'families', label: 'Families' },
];

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

const list = (value: string | string[] | undefined): string[] =>
  value === undefined ? [] : [value].flat();

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

export const NO_FILTERS: Filters = {
  query: '',
  sort: 'newest',
  audiences: [],
  tags: [],
  topics: [],
};

export function filtersToQuery({
  query,
  sort,
  audiences,
  tags,
  topics,
}: Filters) {
  const params = new URLSearchParams();

  if (query.trim()) params.set('q', query.trim());
  if (sort !== 'newest') params.set('sort', sort);

  audiences.forEach((value) => params.append('audience', value));
  tags.forEach((value) => params.append('tag', value));
  topics.forEach((value) => params.append('topic', value));

  const text = params.toString();
  return text ? `?${text}` : '';
}

function matchesQuery(resource: Resource, query: string) {
  const words = lower(query).split(/\s+/).filter(Boolean);

  if (!words.length) return true;

  const text = lower([
    resource.title,
    resource.description,
    ...(resource.tags ?? []),
  ].join(' '));

  return words.every((word) => text.includes(word));
}

function hasAnyTag(resource: Resource, wanted: string[]) {
  if (!wanted.length) return true;

  const names = wanted.map(lower);

  return Boolean(
    resource.tags?.some((tag) => names.includes(lower(tag))),
  );
}

export function applyFilters(
  items: Listed[],
  { query, sort, audiences, tags, topics }: Filters,
): Resource[] {
  const kept = items.filter(
    ({ resource }) =>
      matchesQuery(resource, query) &&
      (!audiences.length || audiences.includes(resource.category)) &&
      hasAnyTag(resource, tags) &&
      hasAnyTag(resource, topics),
  );

  const byTitle = (a: Listed, b: Listed) =>
    a.resource.title.localeCompare(b.resource.title);

  const byDate = (a: Listed, b: Listed) => {
    if (!a.date || !b.date) {
      return Number(!a.date) - Number(!b.date);
    }

    return sort === 'newest'
      ? b.date.localeCompare(a.date)
      : a.date.localeCompare(b.date);
  };

  return kept
    .sort(sort === 'az' ? byTitle : byDate)
    .map(({ resource }) => resource);
}