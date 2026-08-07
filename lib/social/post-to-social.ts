import { postToFacebook, type FacebookPostInput } from './facebook';
import { postToInstagram } from './instagram';

/**
 * Fire-and-forget social-media publish for a newly-public news article.
 *
 * Called from the news POST/PATCH routes AFTER the DB write succeeds. Never
 * blocks the response — failures are swallowed and logged. Each platform is
 * independent: if FB posts and IG fails, that's fine.
 *
 * Caller doesn't need to check whether any of the tokens are set; each
 * platform module short-circuits internally if its env vars are missing.
 */
export interface SocialPostArticle {
  title: string;
  excerpt: string;
  slug: string;
  imageUrl?: string | null;
}

export function postArticleToSocial(article: SocialPostArticle): void {
  // Fire concurrently; don't await. Errors from each are logged but never
  // thrown to the caller (article publish must not fail because of social).
  Promise.all([
    postToFacebook(article as FacebookPostInput).then((r) => {
      if (r.posted) {
        console.log(`[social] FB posted: ${r.id} for ${article.slug}`);
      } else if (r.error !== 'FB env vars not configured') {
        console.warn(`[social] FB failed for ${article.slug}: ${r.error}`);
      }
    }),
    postToInstagram(article).then((r) => {
      if (r.posted) {
        console.log(`[social] IG posted: ${r.id} for ${article.slug}`);
      } else if (
        r.error !== 'IG env vars not configured' &&
        r.error !== 'Instagram requires an image'
      ) {
        console.warn(`[social] IG failed for ${article.slug}: ${r.error}`);
      }
    }),
  ]).catch(() => {
    // Impossible in practice — the two promises already swallow — but
    // TypeScript wants the .catch here to be defensive against
    // future changes.
  });
}
