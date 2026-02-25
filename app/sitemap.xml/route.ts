import { NextResponse } from 'next/server';

// Redirect /sitemap.xml to /sitemap-index.xml
export async function GET() {
  return NextResponse.redirect('https://podshrink.com/sitemap-index.xml', 301);
}
