import { Metadata } from 'next';
import { Suspense } from 'react';
import CTABanner from '@/components/CTABanner';
import { getAllNewsArticles } from '@/lib/data/news-store';
import NewsSearch from './news-search';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.org';

export const metadata: Metadata = {
  title: 'News',
  description: 'News and updates from New Jersey abolitionists working to end abortion through legislation, education, and outreach across the state.',
  alternates: { canonical: '/news' },
};

// ISR: revalidate every 5 minutes
// 24hr ISR + on-demand rebuild from news mutations. See app/page.tsx note.
export const revalidate = 86400;

const HTML_TAG_REGEX = /<[^>]*>/g;
const WHITESPACE_REGEX = /\s+/;

function getReadingTime(html: string): string {
  const text = html.replace(HTML_TAG_REGEX, '');
  const words = text.split(WHITESPACE_REGEX).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default async function NewsPage() {
  let serialized: { title: string; excerpt: string; slug: string; image?: string; created_at?: string; readingTime: string }[] = [];
  try {
    const articles = await getAllNewsArticles(true);
    serialized = articles.map((a) => ({
      title: a.title,
      excerpt: a.excerpt,
      slug: a.slug,
      image: a.image || undefined,
      created_at: a.created_at ? new Date(a.created_at).toISOString() : undefined,
      readingTime: getReadingTime(a.content),
    }));
  } catch {
    // Database unavailable at build time; ISR will populate on first request
  }

  // ItemList schema — tells Google the /news page is a curated collection
  // of articles, eligible for list-format SERP treatments on news queries.
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: serialized.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/news/${a.slug}`,
      name: a.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">NEWS</h1>
        </div>
      </section>

      {/* News Grid with Search */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Suspense fallback={null}>
            <NewsSearch articles={serialized} />
          </Suspense>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}
