/**
 * Instagram Business auto-post for Garden State Abolitionists news articles.
 *
 * Requires env vars:
 *   IG_BUSINESS_ACCOUNT_ID  - IG business account linked to the Facebook Page
 *   FB_PAGE_ACCESS_TOKEN    - same token as Facebook (Meta unifies Graph API)
 *
 * IG doesn't support clickable links in captions — the bio.link on the
 * profile is the only clickable URL. So the article URL is still included
 * in the caption as plain text (searchable, copyable), but users have to
 * either type it or tap through from bio.
 *
 * IG requires an image (or video). No image = no post. This is different
 * from Facebook, which is happy to post a link with no image.
 *
 * The post is a two-step API dance:
 *   1. Create an IG "media container" pointing at the image URL
 *   2. Publish the container
 *
 * Both steps happen in one function call from the caller's perspective.
 */

const GRAPH_API_VERSION = 'v20.0';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.org';

export interface InstagramPostInput {
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
  const igId = process.env.IG_BUSINESS_ACCOUNT_ID;
  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!igId || !token) return null;
  return { igId, token };
}

export async function postToInstagram(input: InstagramPostInput): Promise<PostResult> {
  const config = getConfig();
  if (!config) return { posted: false, error: 'IG env vars not configured' };
  if (!input.imageUrl) return { posted: false, error: 'Instagram requires an image' };

  const articleUrl = new URL(`/news/${input.slug}`, BASE_URL);
  articleUrl.searchParams.set('utm_source', 'instagram');
  articleUrl.searchParams.set('utm_medium', 'social');
  articleUrl.searchParams.set('utm_campaign', 'news_autopost');

  const caption = `${input.title}\n\n${input.excerpt}\n\nRead the full article: ${articleUrl.toString()}`;

  try {
    // Step 1: create media container
    const createUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/${config.igId}/media`;
    const createRes = await fetch(createUrl, {
      method: 'POST',
      body: new URLSearchParams({
        access_token: config.token,
        image_url: input.imageUrl,
        caption,
      }),
    });
    const createJson = (await createRes.json()) as { id?: string; error?: { message: string } };
    if (!createRes.ok || createJson.error || !createJson.id) {
      return {
        posted: false,
        error: `create: ${createJson.error?.message ?? `HTTP ${createRes.status}`}`,
      };
    }

    // Step 2: publish the container
    const publishUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/${config.igId}/media_publish`;
    const publishRes = await fetch(publishUrl, {
      method: 'POST',
      body: new URLSearchParams({
        access_token: config.token,
        creation_id: createJson.id,
      }),
    });
    const publishJson = (await publishRes.json()) as {
      id?: string;
      error?: { message: string };
    };
    if (!publishRes.ok || publishJson.error) {
      return {
        posted: false,
        error: `publish: ${publishJson.error?.message ?? `HTTP ${publishRes.status}`}`,
      };
    }
    return { posted: true, id: publishJson.id };
  } catch (e) {
    return { posted: false, error: e instanceof Error ? e.message : 'unknown error' };
  }
}
