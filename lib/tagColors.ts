// Pastel tag pills for the resource cards, as in the Figma mockup: a light tint of a brand color behind dark
// text. Full class names, so Tailwind sees them when it scans the source.
const TAG_COLORS: Record<string, string> = {
  // content types
  'job aids & posters': 'bg-nest-coral/20 text-nest-neutral-900',
  'training modules & scenarios': 'bg-nest-light-blue/25 text-nest-blue',
  videos: 'bg-nest-yellow/30 text-nest-neutral-900',
  'forms & surveys': 'bg-nest-lavender/25 text-nest-neutral-900',
  'toolkits & dashboards': 'bg-nest-yellow/20 text-nest-blue',
  'reports & frameworks': 'bg-nest-blue/10 text-nest-blue',

  // topics: outlined in a brand color, so they read apart from the filled content type pills
  'technology landscapes': 'bg-white text-nest-blue ring-1 ring-inset ring-nest-blue/50',
  'clinical care & cpap': 'bg-white text-nest-blue ring-1 ring-inset ring-nest-accent',
  'technical & equipment maintenance': 'bg-white text-nest-neutral-900 ring-1 ring-inset ring-nest-lavender',
  'safety & infection control (ipc)': 'bg-white text-nest-neutral-900 ring-1 ring-inset ring-nest-coral',
  'quality improvement & data': 'bg-white text-nest-neutral-900 ring-1 ring-inset ring-nest-yellow',
};

// The audience pill, from the resource's Audience in the admin (Resource.category)
export const AUDIENCE_TAGS: Record<string, { label: string; className: string }> = {
  healthcare: { label: 'Healthcare Professionals', className: 'bg-nest-accent/25 text-nest-blue' },
  innovators: { label: 'Innovators', className: 'bg-nest-lavender/35 text-nest-neutral-900' },
  implementors: { label: 'Implementers', className: 'bg-nest-light-blue/40 text-nest-blue' },
  families: { label: 'Families', className: 'bg-nest-coral/30 text-nest-neutral-900' },
  dashboards: { label: 'Dashboards', className: 'bg-nest-yellow/30 text-nest-blue' },
};

// Pastel pills for every other tag (countries, subjects, tags added later in the admin)
const OTHER_TAG_COLORS = [
  'bg-nest-coral/15 text-nest-neutral-900',
  'bg-nest-accent/30 text-nest-blue',
  'bg-nest-lavender/20 text-nest-blue',
  'bg-nest-light-blue/15 text-nest-blue',
  'bg-nest-yellow/40 text-nest-neutral-900',
  'bg-nest-blue/15 text-nest-blue',
];

// A tag in TAG_COLORS gets its own color. Any other tag gets one of OTHER_TAG_COLORS picked from its name,
// so the same tag is always the same color on every card and page, with nothing to set up in the admin.
export function tagColor(tag: string) {
  const name = tag.toLocaleLowerCase('en-US');
  if (TAG_COLORS[name]) return TAG_COLORS[name];
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return OTHER_TAG_COLORS[hash % OTHER_TAG_COLORS.length];
}
