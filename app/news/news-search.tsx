'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import NewsCard from '@/components/NewsCard';

interface Article {
  title: string;
  excerpt: string;
  slug: string;
  image?: string;
  created_at?: Date | string;
  readingTime?: string;
}

export default function NewsSearch({ articles }: { articles: Article[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Seed from `?q=` so the Google Sitelinks Searchbox (which points at
  // /news?q={search_term_string}) lands on a pre-filtered view.
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('q') ?? '');

  // Keep the URL query string in sync with the input so users can share links.
  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (searchTerm) params.set('q', searchTerm); else params.delete('q');
    const qs = params.toString();
    router.replace(qs ? `/news?${qs}` : '/news', { scroll: false });
  }, [searchTerm, router, searchParams]);

  const filtered = articles.filter((article) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      article.title.toLowerCase().includes(search) ||
      article.excerpt.toLowerCase().includes(search)
    );
  });

  return (
    <>
      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search articles..."
            aria-label="Search news articles"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
          />
        </div>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <>
          {/* Visually-hidden H2 so the H3 headings inside each NewsCard have
              a proper parent in the outline (fixes Lighthouse heading-order). */}
          <h2 className="sr-only">News Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => (
            <NewsCard
              key={article.slug}
              title={article.title}
              excerpt={article.excerpt}
              date={
                article.created_at
                  ? new Date(article.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : ''
              }
              slug={article.slug}
              image={article.image}
              readingTime={article.readingTime}
            />
          ))}
          </div>
        </>
      ) : searchTerm ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No Results</h2>
          <p className="text-gray-600 mb-4">
            No articles found matching &ldquo;{searchTerm}&rdquo;
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="text-red-600 font-semibold hover:text-red-700 transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Nothing Found</h2>
          <p className="text-gray-600">
            It seems we can&apos;t find any posts. Perhaps searching will help.
          </p>
        </div>
      )}
    </>
  );
}
