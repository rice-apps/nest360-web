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
};

// Any other tag (a topic, a country) gets the quiet neutral pill
export function tagColor(tag: string) {
  return TAG_COLORS[tag.toLocaleLowerCase('en-US')] ?? 'bg-nest-neutral-200 text-gray-700';
}
