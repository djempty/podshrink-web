import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://podshrink-production.up.railway.app';
const BASE = 'https://podshrink.com';

async function fetchJson(path: string) {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/shows`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/transcripts`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/support`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ];

  // Dynamic: all shows
  const shows = await fetchJson('/api/shows');
  const showPages: MetadataRoute.Sitemap = (Array.isArray(shows) ? shows : []).map((show: any) => ({
    url: `${BASE}/shows/${show.id}`,
    lastModified: show.updatedAt ? new Date(show.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Dynamic: all completed shrinks (transcripts)
  const shrinks = await fetchJson('/api/shrinks?public=true');
  const transcriptPages: MetadataRoute.Sitemap = (Array.isArray(shrinks) ? shrinks : []).map((shrink: any) => ({
    url: `${BASE}/shrinks/${shrink.id}`,
    lastModified: shrink.createdAt ? new Date(shrink.createdAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...showPages, ...transcriptPages];
}
