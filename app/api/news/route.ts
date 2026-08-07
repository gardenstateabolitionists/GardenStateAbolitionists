import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getAllNewsArticles,
  createNewsArticle,
  slugExists,
} from '@/lib/data/news-store';
import { getAuthToken, verifyToken } from '@/lib/actions/auth-actions';
import { sanitizeHtml } from '@/lib/sanitize';
import { validateCsrf } from '@/lib/csrf';
import { pingIndexNow } from '@/lib/indexnow';
import { postArticleToSocial } from '@/lib/social/post-to-social';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.org';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;
  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') === 'true';

    if (publishedOnly) {
      return NextResponse.json(await getAllNewsArticles(true));
    }

    // For admin view, verify auth
    if (!await isAdmin()) {
      // Return only published articles for non-admins
      return NextResponse.json(await getAllNewsArticles(true));
    }

    return NextResponse.json(await getAllNewsArticles(false));
  } catch (error) {
    console.error('GET /api/news failed, returning empty list:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    if (!data.title || !data.slug || !data.excerpt || !data.content) {
      return NextResponse.json({ error: 'Title, slug, excerpt, and content are required' }, { status: 400 });
    }

    // Check for duplicate slug
    if (await slugExists(data.slug)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const newArticle = await createNewsArticle({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: sanitizeHtml(data.content),
      image: data.image || '',
      published: data.published || false,
      // Defaults to true if omitted; false means "publish silently, no
      // social post". Only meaningful when published=true.
      auto_post_to_social: data.auto_post_to_social !== false,
    });

    // Kick the cached pages that surface this article so it appears
    // immediately without waiting for the next 24hr ISR window.
    if (newArticle.published) {
      revalidatePath('/');
      revalidatePath('/news');
      revalidatePath(`/news/${newArticle.slug}`);
    }

    // Ping IndexNow (Bing/Yandex/DuckDuckGo) if the article shipped public.
    // Fire-and-forget: doesn't block the response and swallows failures.
    if (newArticle.published) {
      pingIndexNow([
        `${SITE_URL}/news/${newArticle.slug}`,
        `${SITE_URL}/news`,
        `${SITE_URL}/news-sitemap.xml`,
      ]);
      // Auto-post to Facebook + Instagram — only if the "Also post to
      // social" checkbox was on. Fire-and-forget; if any social platform
      // fails the article still publishes fine (see
      // lib/social/post-to-social.ts).
      if (newArticle.auto_post_to_social !== false) {
        postArticleToSocial({
          title: newArticle.title,
          excerpt: newArticle.excerpt,
          slug: newArticle.slug,
          imageUrl: newArticle.image || null,
        });
      }
    }

    return NextResponse.json(newArticle, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
