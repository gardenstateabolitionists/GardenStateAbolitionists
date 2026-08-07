import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.org';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Note: /manage-7x9k intentionally NOT listed here — the admin login page
        // sets `robots: { index: false }` on its own metadata instead, so we don't
        // disclose the obscured URL through a publicly-readable robots.txt.
        disallow: ['/admin/', '/api/', '/unsubscribe'],
      },
    ],
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/news-sitemap.xml`,
    ],
  };
}
