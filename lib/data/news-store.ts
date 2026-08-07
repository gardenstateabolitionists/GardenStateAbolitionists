// News articles store
// Uses Prisma/PostgreSQL when DATABASE_URL is set, otherwise in-memory

import { NewsArticle } from '@/types';
import prisma, { isDatabaseConnected } from '@/lib/prisma';

export type NewsArticleData = NewsArticle;

// In-memory fallback store with default article
const memoryStore: NewsArticleData[] = [
  {
    id: '1',
    title: 'Abolitionists of New Jersey Launch a Website',
    slug: 'abolitionists-of-new-jersey-launch-a-website',
    excerpt: 'Garden State Abolitionists is proud to announce the launch of our website. Hooray, and congrats! We hope to continue improving the website and adding content for many years from now.',
    content: '<p>Garden State Abolitionists is proud to announce the launch of our website. Hooray, and congrats!</p><p>We hope to continue improving the website and adding content for many years from now. Hopefully this will help outsiders understand who we are, and help insiders in some other way.</p><p>Thanks to Abolish Abortion North Carolina for the hard work they put into their website, which we were able to derive much of our content and design from.</p>',
    image: '',
    published: true,
    created_at: '2024-11-09T00:00:00.000Z',
    updated_at: '2024-11-09T00:00:00.000Z',
  },
];

export async function getAllNewsArticles(publishedOnly = false): Promise<NewsArticleData[]> {
  if (isDatabaseConnected) {
    const items = await prisma.newsArticle.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { created_at: 'desc' },
    });
    return items.map(mapDbArticle);
  }

  const articles = [...memoryStore].sort((a, b) =>
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
  if (publishedOnly) {
    return articles.filter((a) => a.published);
  }
  return articles;
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticleData | undefined> {
  if (isDatabaseConnected) {
    const item = await prisma.newsArticle.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
    });
    return item ? mapDbArticle(item) : undefined;
  }
  return memoryStore.find((a) => a.slug === slug || a.id === slug);
}

export async function createNewsArticle(data: Omit<NewsArticleData, 'id' | 'created_at' | 'updated_at'>): Promise<NewsArticleData> {
  if (isDatabaseConnected) {
    const item = await prisma.newsArticle.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image || null,
        published: data.published || false,
        auto_post_to_social: data.auto_post_to_social ?? true,
      },
    });
    return mapDbArticle(item);
  }

  const newArticle: NewsArticleData = {
    id: Date.now().toString(),
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    image: data.image || '',
    published: data.published || false,
    auto_post_to_social: data.auto_post_to_social ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  memoryStore.unshift(newArticle);
  return newArticle;
}

export async function updateNewsArticle(id: string, data: Partial<NewsArticleData>): Promise<NewsArticleData | null> {
  if (isDatabaseConnected) {
    try {
      const item = await prisma.newsArticle.update({
        where: { id },
        data: {
          ...(data.title !== undefined && { title: data.title }),
          ...(data.slug !== undefined && { slug: data.slug }),
          ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
          ...(data.content !== undefined && { content: data.content }),
          ...(data.image !== undefined && { image: data.image }),
          ...(data.published !== undefined && { published: data.published }),
          ...(data.auto_post_to_social !== undefined && {
            auto_post_to_social: data.auto_post_to_social,
          }),
        },
      });
      return mapDbArticle(item);
    } catch {
      return null;
    }
  }

  const index = memoryStore.findIndex((a) => a.id === id || a.slug === id);
  if (index === -1) return null;

  memoryStore[index] = {
    ...memoryStore[index],
    ...data,
    updated_at: new Date().toISOString(),
  };
  return memoryStore[index];
}

export async function deleteNewsArticle(id: string): Promise<boolean> {
  if (isDatabaseConnected) {
    try {
      await prisma.newsArticle.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  const index = memoryStore.findIndex((a) => a.id === id || a.slug === id);
  if (index === -1) return false;
  memoryStore.splice(index, 1);
  return true;
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  if (isDatabaseConnected) {
    const item = await prisma.newsArticle.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    return !!item;
  }
  return memoryStore.some((a) => a.slug === slug && a.id !== excludeId);
}

function mapDbArticle(item: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string | null;
  published: boolean;
  // Optional so this stays working before the DB migration lands — old
  // rows without the column will just show `undefined`, which callers
  // treat as "true" per the field docs.
  auto_post_to_social?: boolean;
  created_at: Date;
  updated_at: Date;
}): NewsArticleData {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    content: item.content,
    image: item.image || '',
    published: item.published,
    auto_post_to_social: item.auto_post_to_social ?? true,
    created_at: item.created_at.toISOString(),
    updated_at: item.updated_at.toISOString(),
  };
}
