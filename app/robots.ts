import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/account/',
          '/admin/',
          '/saved-shrinks/',
          '/favorites/',
        ],
      },
    ],
    sitemap: 'https://podshrink.com/sitemap-index.xml',
  };
}
