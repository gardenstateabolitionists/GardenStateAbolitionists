import { MetadataRoute } from 'next';
import { getAllNewsArticles } from '@/lib/data/news-store';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/the-petition`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/donate`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/who-we-are`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/media`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/non-violence-statement`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/financial-transparency`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/delete-my-data`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    // The Gospel section
    { url: `${BASE_URL}/the-gospel`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/the-gospel/gospel`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/the-gospel/great-commission`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/the-gospel/incarnation`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/the-gospel/kingdom-of-god`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/the-gospel/message-of-reconciliation`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/the-gospel/answer-to-abortion`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    // What We Believe section
    { url: `${BASE_URL}/what-we-believe`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/what-we-believe/abolitionist-not-pro-life`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/what-we-believe/biblical-not-secular`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/what-we-believe/criminalization`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/what-we-believe/ignore-roe`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/what-we-believe/immediate-not-gradual`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/what-we-believe/no-exceptions`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    // Allied abolition groups directory — backlink hub
    { url: `${BASE_URL}/partners`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // NOTE: legislator, city, abortion-facility and abolition-bill URLs are
  // deliberately absent. Those routes live in `staged-for-nj/` until the
  // New Jersey datasets behind them are researched — see that folder's
  // README. Re-add the entries here in the same change that restores
  // the routes, or the sitemap will advertise 404s.

  // Add dynamic news article URLs
  let newsPages: MetadataRoute.Sitemap = [];
  try {
    const articles = await getAllNewsArticles(true);
    newsPages = articles.map((article) => ({
      url: `${BASE_URL}/news/${article.slug}`,
      lastModified: article.updated_at ? new Date(article.updated_at) : new Date(article.created_at || ''),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {
    // If news fetch fails, just skip dynamic pages
  }

  return [...staticPages, ...newsPages];
}
