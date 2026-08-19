import { getAllNewsArticles } from '@/lib/data/news-store';

// Google News Sitemap format — separate from the main sitemap.xml.
//
// Google News's Top Stories carousel only surfaces articles from the last
// 48 hours regardless of what's in this file, but the sitemap itself must
// always contain at least one <url> element to validate in Search Console.
// So: we include the N most recent published articles (up to MAX_ARTICLES).
// Older articles beyond the 48h window are harmlessly ignored by Google News
// for ranking but keep the sitemap syntactically valid.
//
// After submitting the site to Google Publisher Center + this sitemap URL in
// Search Console, fresh news articles become eligible for Top Stories and
// google.com/news surfaces.
//
// Reference: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.com';
const PUBLICATION_NAME = 'Garden State Abolitionists';
const PUBLICATION_LANGUAGE = 'en';
const MAX_ARTICLES = 20; // Google News sitemap spec: max 1,000; we cap lower for freshness

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  let articles: Awaited<ReturnType<typeof getAllNewsArticles>> = [];
  try {
    const all = await getAllNewsArticles(true);
    // Newest first, cap at MAX_ARTICLES
    articles = [...all]
      .filter((a) => a.created_at)
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, MAX_ARTICLES);
  } catch (error) {
    console.error('news-sitemap: failed to load articles, serving stub sitemap:', error instanceof Error ? error.message : 'Unknown error');
  }

  const items = articles.map((article) => {
    const pubDate = article.created_at
      ? new Date(article.created_at).toISOString()
      : new Date().toISOString();
    return `  <url>
    <loc>${BASE_URL}/news/${escapeXml(article.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(PUBLICATION_NAME)}</news:name>
        <news:language>${PUBLICATION_LANGUAGE}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
    </news:news>
  </url>`;
  });

  // If the DB is down or there are literally no articles yet, emit a single
  // fallback <url> pointing at /news so the sitemap still validates in Google
  // Search Console. Google will simply skip it for Top Stories (no news:news
  // block), but the sitemap won't throw a "Missing XML tag" error.
  const body = items.length > 0
    ? items.join('\n')
    : `  <url>
    <loc>${BASE_URL}/news</loc>
  </url>`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${body}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // Fresh — Google News should re-crawl often
      'Cache-Control': 'public, max-age=600, s-maxage=600',
    },
  });
}
