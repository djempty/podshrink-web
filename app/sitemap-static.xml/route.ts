import { NextResponse } from 'next/server';

const BASE = 'https://podshrink.com';

export async function GET() {
  const now = new Date().toISOString();

  const staticPages = [
    { url: BASE, priority: '1.0', changefreq: 'daily' },
    { url: `${BASE}/shows`, priority: '0.9', changefreq: 'daily' },
    { url: `${BASE}/categories`, priority: '0.8', changefreq: 'weekly' },
    { url: `${BASE}/pricing`, priority: '0.7', changefreq: 'monthly' },
    { url: `${BASE}/transcripts`, priority: '0.8', changefreq: 'daily' },
    { url: `${BASE}/support`, priority: '0.5', changefreq: 'monthly' },
    { url: `${BASE}/login`, priority: '0.3', changefreq: 'monthly' },
    { url: `${BASE}/signup`, priority: '0.4', changefreq: 'monthly' },
    { url: `${BASE}/browse`, priority: '0.7', changefreq: 'daily' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const page of staticPages) {
    xml += `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
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
