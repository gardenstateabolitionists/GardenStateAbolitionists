'use server';

import { getAuthToken, verifyToken } from './auth-actions';
import { NewsArticle } from '@/types';
import {
  getAllNewsArticles,
  getNewsArticleBySlug,
  createNewsArticle as createArticle,
  updateNewsArticle as updateArticle,
  deleteNewsArticle as deleteArticle,
  slugExists,
} from '@/lib/data/news-store';
import { getSubscribedEmails } from '@/lib/data/petition-store';
import { sendNewsletterToAll, sendNewsletterNotification } from '@/lib/email';
import { sanitizeHtml } from '@/lib/sanitize';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.org';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

async function pingSitemapToSearchEngines() {
  const sitemapUrl = encodeURIComponent(`${BASE_URL}/sitemap.xml`);
  const pings = [
    `https://www.google.com/ping?sitemap=${sitemapUrl}`,
    `https://www.bing.com/ping?sitemap=${sitemapUrl}`,
  ];

  await Promise.allSettled(
    pings.map((url) =>
      fetch(url, { method: 'GET' }).catch(() => {})
    )
  );
}

export async function fetchNewsArticles(publishedOnly = false) {
  try {
    // If requesting all articles (admin view), verify auth
    if (!publishedOnly) {
      const admin = await isAdmin();
      if (!admin) {
        // Return only published for non-admins
        return await getAllNewsArticles(true);
      }
    }

    return await getAllNewsArticles(publishedOnly);
  } catch {
    return { error: 'Failed to fetch news' };
  }
}

export async function fetchNewsArticle(slug: string) {
  try {
    const article = await getNewsArticleBySlug(slug);

    if (!article) {
      return { error: 'Article not found' };
    }

    // If not published, require admin auth
    if (!article.published) {
      const admin = await isAdmin();
      if (!admin) {
        return { error: 'Article not found' };
      }
    }

    return article;
  } catch {
    return { error: 'Failed to fetch article' };
  }
}

export async function createNewsArticle(data: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    // Validate required fields
    if (!data.title || !data.slug || !data.excerpt || !data.content) {
      return { error: 'Title, slug, excerpt, and content are required' };
    }

    // Check for duplicate slug
    if (await slugExists(data.slug)) {
      return { error: 'Slug already exists' };
    }

    const newArticle = await createArticle({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: sanitizeHtml(data.content),
      image: data.image || '',
      published: data.published || false,
    });

    // Send newsletter to subscribers if article is published
    if (data.published) {
      const subscribers = await getSubscribedEmails();
      if (subscribers.length > 0) {
        const articleData = { title: data.title, slug: data.slug, excerpt: data.excerpt, image: data.image };
        const result = await sendNewsletterToAll(articleData, subscribers);
        await sendNewsletterNotification(articleData, result.sent, result.failed);
      }
      // Notify search engines of new content
      pingSitemapToSearchEngines();
    }

    return newArticle;
  } catch {
    return { error: 'Failed to create article' };
  }
}

export async function updateNewsArticle(id: string, data: Partial<NewsArticle>) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    // If updating slug, check for duplicates
    if (data.slug && await slugExists(data.slug, id)) {
      return { error: 'Slug already exists' };
    }

    // Check if article is being published for the first time
    // Default to true (safe: skip newsletter) so lookup failures don't send duplicates
    let wasPublished = true;
    if (data.published === true) {
      const existing = await getNewsArticleBySlug(id);
      if (existing && !existing.published) {
        wasPublished = false; // It wasn't published before, so this is a new publish
      }
    }

    // Sanitize content if being updated
    const sanitizedData = data.content
      ? { ...data, content: sanitizeHtml(data.content) }
      : data;

    const updated = await updateArticle(id, sanitizedData);

    if (!updated) {
      return { error: 'Article not found' };
    }

    // Send newsletter when article transitions from draft to published
    if (data.published === true && !wasPublished) {
      const subscribers = await getSubscribedEmails();
      if (subscribers.length > 0) {
        const articleData = { title: updated.title, slug: updated.slug, excerpt: updated.excerpt, image: updated.image };
        const result = await sendNewsletterToAll(articleData, subscribers);
        await sendNewsletterNotification(articleData, result.sent, result.failed);
      }
      // Notify search engines of new content
      pingSitemapToSearchEngines();
    }

    return updated;
  } catch {
    return { error: 'Failed to update article' };
  }
}

export async function deleteNewsArticle(id: string) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    const deleted = await deleteArticle(id);

    if (!deleted) {
      return { error: 'Article not found' };
    }

    return { success: true };
  } catch {
    return { error: 'Failed to delete article' };
  }
}
