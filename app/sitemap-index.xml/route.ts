import { NextResponse } from 'next/server';

const BASE = 'https://podshrink.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://podshrink-production.up.railway.app';

async function fetchJson(path: string) {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function GET() {
  // Get total episode count by fetching pages until empty
  let episodeCount = 0;
  let page = 1;
  const episodesPerPage = 50000;
  
  while (true) {
    const episodes = await fetchJson(`/api/episodes?page=${page}&limit=${episodesPerPage}`);
    if (!episodes || episodes.length === 0) break;
    episodeCount += episodes.length;
    if (episodes.length < episodesPerPage) break; // Last page
    page++;
  }

  const episodesPerSitemap = 10000;
  const episodeSitemapCount = Math.ceil(episodeCount / episodesPerSitemap);

  const now = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE}/sitemap-static.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE}/sitemap-shows.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE}/sitemap-transcripts.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;

  // Add episode sub-sitemaps
  for (let i = 1; i <= episodeSitemapCount; i++) {
    xml += `
  <sitemap>
    <loc>${BASE}/sitemap-episodes-${i}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;
  }

  xml += `
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
