import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

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

export async function GET(
  request: NextRequest,
  { params }: { params: { page: string } }
) {
  const page = parseInt(params.page, 10);
  
  if (isNaN(page) || page < 1) {
    return new NextResponse('Invalid page number', { status: 400 });
  }

  // Fetch episodes for this page (10k per page)
  const episodesPerPage = 10000;
  const episodes = await fetchJson(`/api/episodes?page=${page}&limit=${episodesPerPage}`);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const episode of episodes) {
    const lastmod = episode.pubDate 
      ? new Date(episode.pubDate).toISOString() 
      : episode.createdAt 
      ? new Date(episode.createdAt).toISOString() 
      : new Date().toISOString();
    
    xml += `
  <url>
    <loc>${BASE}/shows/${episode.showId}/episodes/${episode.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
  }

  xml += `
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
