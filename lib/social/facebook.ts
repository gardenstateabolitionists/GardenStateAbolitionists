/**
 * Facebook Page auto-post for Garden State Abolitionists news articles.
 *
 * Requires env vars:
 *   FB_PAGE_ID              - Facebook Page numeric id (public, saved server-side)
 *   FB_PAGE_ACCESS_TOKEN    - non-expiring Page token derived from the app-
 *                             secret exchange (see docs/social-auto-post-setup.md)
 *
 * If either is missing this module no-ops silently. That way the site works
 * in preview/dev environments where the tokens aren't configured, and if a
 * token ever gets revoked, article publishing keeps working — the post just
 * doesn't happen and the failure gets logged.
 */

const GRAPH_API_VERSION = 'v20.0';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.org';

export interface FacebookPostInput {
  title: string;
  excerpt: string;
  slug: string;
  imageUrl?: string | null;
}

export interface PostResult {
  posted: boolean;
  id?: string;
  error?: string;
}

function getConfig() {
  const pageId = process.env.FB_PAGE_ID;
  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!pageId || !token) return null;
  return { pageId, token };
}

/**
 * Post an article to the Facebook Page.
 * - With an image: uses /photos endpoint (image + caption + link back)
 * - Without an image: uses /feed endpoint (link + caption)
 *
 * The `link` param on FB posts is what generates the rich preview card.
 * Article URL is UTM-tagged so PostHog can attribute referrer traffic.
 */
export async function postToFacebook(input: FacebookPostInput): Promise<PostResult> {
  const config = getConfig();
  if (!config) return { posted: false, error: 'FB env vars not configured' };

  const articleUrl = new URL(`/news/${input.slug}`, BASE_URL);
  articleUrl.searchParams.set('utm_source', 'facebook');
  articleUrl.searchParams.set('utm_medium', 'social');
  articleUrl.searchParams.set('utm_campaign', 'news_autopost');

  const caption = `${input.title}\n\n${input.excerpt}\n\n${articleUrl.toString()}`;

  const endpoint = input.imageUrl ? 'photos' : 'feed';
  const params = new URLSearchParams({
    access_token: config.token,
    ...(input.imageUrl
      ? { url: input.imageUrl, caption }
      : { message: caption, link: articleUrl.toString() }),
  });

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${config.pageId}/${endpoint}`;

  try {
    const res = await fetch(url, { method: 'POST', body: params });
    const json = (await res.json()) as { id?: string; error?: { message: string } };
    if (!res.ok || json.error) {
      return {
        posted: false,
        error: json.error?.message ?? `HTTP ${res.status}`,
      };
    }
    return { posted: true, id: json.id };
  } catch (e) {
    return { posted: false, error: e instanceof Error ? e.message : 'unknown error' };
  }
}
