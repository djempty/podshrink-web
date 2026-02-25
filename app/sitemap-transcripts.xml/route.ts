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
  const shrinks = await fetchJson('/api/shrinks?public=true');

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const shrink of shrinks) {
    const lastmod = shrink.createdAt ? new Date(shrink.createdAt).toISOString() : new Date().toISOString();
    xml += `
  <url>
    <loc>${BASE}/shrinks/${shrink.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
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
