// Builds a /stories link that keeps the current search and/or tag. Shared by the server page (tag buttons)
// and the client search box, so both write the URL the same way.
export function storiesHref(query: string, tag: string) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (tag) params.set('tag', tag);
  const qs = params.toString();
  return qs ? `/stories?${qs}` : '/stories';
}
