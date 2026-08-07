// IndexNow — instant search-index notification for Bing, Yandex, DuckDuckGo, Seznam.
// (Google doesn't support IndexNow yet as of 2026, but is publicly evaluating it.)
//
// Fires a single HTTPS POST to api.indexnow.org listing URL(s) that just
// changed. Bing crawls within minutes instead of the usual days-to-weeks.
//
// Setup:
//   - The key is INTENTIONALLY PUBLIC (per IndexNow spec — not a secret,
//     just a domain-ownership token). It's committed to the repo at
//     public/{key}.txt so IndexNow can fetch it back to verify ownership.
//   - No env var needed. Rotate by generating a new UUID + replacing both
//     the constant below and the file in public/.
//
// Reference: https://www.indexnow.org/documentation

export const INDEXNOW_KEY = 'ea19840a842f58e020f38540804ed83e';

const HOST = 'www.gardenstateabolitionists.org';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

/**
 * Notify IndexNow that one or more URLs on this site were just added or
 * updated. Safe to call from server-side code (route handlers, server
 * actions). No-op if URL list is empty; catches and logs network errors
 * instead of throwing so a failed ping never breaks the publish flow.
 */
export async function pingIndexNow(urls: string[]): Promise<void> {
  if (!urls.length) return;
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
    // IndexNow returns 200 (accepted) or 202 (accepted, queued). Anything
    // else is worth logging — usually 400 (bad URL format) or 422 (host mismatch).
    if (res.status !== 200 && res.status !== 202) {
      console.warn(`IndexNow ping returned ${res.status} for ${urls.length} URL(s)`);
    }
  } catch (err) {
    console.warn('IndexNow ping failed:', err instanceof Error ? err.message : 'Unknown error');
  }
}
