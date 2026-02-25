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
  const shows = await fetchJson('/api/shows');

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const show of shows) {
    const lastmod = show.updatedAt ? new Date(show.updatedAt).toISOString() : new Date().toISOString();
    xml += `
  <url>
    <loc>${BASE}/shows/${show.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
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
