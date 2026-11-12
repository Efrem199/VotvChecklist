export type Route = { page: 'journal' | 'fun' | 'achievements'; location?: string; collection?: string; item?: string; query?: string; category?: string; section?: string };
export function parseRoute(hash: string): Route {
  const [path, params = ''] = hash.replace(/^#/, '').split('?');
  const query = new URLSearchParams(params);
  const page = path === '/fun' ? 'fun' : path === '/achievements' ? 'achievements' : 'journal';
  return { page, location: query.get('loc') ?? undefined, collection: query.get('collection') ?? undefined, item: query.get('item') ?? undefined, query: query.get('q') ?? undefined, category: query.get('category') ?? undefined, section: query.get('section') ?? undefined };
}
