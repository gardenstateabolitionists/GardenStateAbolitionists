import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.org';

/**
 * True while the site is still running on its Vercel deployment domain rather
 * than a real one. Search engines treat a *.vercel.app deployment as its own
 * site, so letting it get indexed creates a duplicate that competes with the
 * real domain later and has to be manually removed from the index.
 *
 * This guard lifts itself: the moment NEXT_PUBLIC_SITE_URL points at the
 * production domain, indexing is allowed with no code change.
 */
const IS_DEPLOYMENT_DOMAIN = BASE_URL.includes('.vercel.app');

export default function robots(): MetadataRoute.Robots {
  if (IS_DEPLOYMENT_DOMAIN) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

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
