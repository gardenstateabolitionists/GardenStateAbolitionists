import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getNewsArticleBySlug,
  updateNewsArticle,
  deleteNewsArticle,
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await getNewsArticleBySlug(slug);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // If not published, require admin auth
    if (!article.published) {
      if (!await isAdmin()) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
    }

    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const data = await request.json();

    // Only allow updating known fields
    const allowedFields = ['title', 'slug', 'excerpt', 'content', 'image', 'published', 'auto_post_to_social'];
    const filtered: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in data) filtered[key] = data[key];
    }

    // Validate field lengths
    if (typeof filtered.title === 'string' && filtered.title.length > 200) {
      return NextResponse.json({ error: 'Title must be 200 characters or less' }, { status: 400 });
    }
    if (typeof filtered.slug === 'string' && filtered.slug.length > 200) {
      return NextResponse.json({ error: 'Slug must be 200 characters or less' }, { status: 400 });
    }
    if (typeof filtered.excerpt === 'string' && filtered.excerpt.length > 1000) {
      return NextResponse.json({ error: 'Excerpt must be 1000 characters or less' }, { status: 400 });
    }
    if (typeof filtered.content === 'string' && filtered.content.length > 50000) {
      return NextResponse.json({ error: 'Content must be 50000 characters or less' }, { status: 400 });
    }
    if (filtered.published !== undefined && typeof filtered.published !== 'boolean') {
      return NextResponse.json({ error: 'Published must be a boolean' }, { status: 400 });
    }

    const existingArticle = await getNewsArticleBySlug(slug);
    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // If updating slug, check for duplicates
    if (filtered.slug && filtered.slug !== existingArticle.slug && await slugExists(filtered.slug as string)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Sanitize content if provided
    if (filtered.content) {
      filtered.content = sanitizeHtml(filtered.content as string);
    }

    const updated = await updateNewsArticle(slug, filtered);

    if (!updated) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Kick the cached pages that surface this article so edits appear
    // immediately without waiting for the next 24hr ISR window. Also
    // invalidate the OLD slug when the article was renamed.
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath(`/news/${updated.slug}`);
    if (updated.slug !== existingArticle.slug) {
      revalidatePath(`/news/${existingArticle.slug}`);
    }

    // Fire IndexNow when EITHER a draft goes public OR a public article is
    // edited. Uses the new slug if the article was renamed.
    const nowPublic = updated.published;
    const justPublished = nowPublic && !existingArticle.published;
    const editedWhilePublic = nowPublic && existingArticle.published;
    if (justPublished || editedWhilePublic) {
      const urls = [
        `${SITE_URL}/news/${updated.slug}`,
        `${SITE_URL}/news`,
        `${SITE_URL}/news-sitemap.xml`,
      ];
      // If the slug changed on an already-public article, also flag the old
      // URL so Bing knows to drop the stale entry.
      if (existingArticle.published && updated.slug !== existingArticle.slug) {
        urls.push(`${SITE_URL}/news/${existingArticle.slug}`);
      }
      pingIndexNow(urls);
    }

    // Auto-post to FB + IG only on the DRAFT -> PUBLIC transition, AND
    // only if the "Also post to social" checkbox was on. Editing an
    // already-public article never reposts — that would double-post every
    // small typo fix and annoy followers.
    if (justPublished && updated.auto_post_to_social !== false) {
      postArticleToSocial({
        title: updated.title,
        excerpt: updated.excerpt,
        slug: updated.slug,
        imageUrl: updated.image || null,
      });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const deleted = await deleteNewsArticle(slug);

    if (!deleted) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Kick the cached pages so the deleted article disappears immediately.
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath(`/news/${slug}`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
