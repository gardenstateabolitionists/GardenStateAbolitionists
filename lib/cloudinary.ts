import { createHash } from 'crypto';

/**
 * Cloudinary signed-upload support.
 *
 * The browser uploads the file straight to Cloudinary rather than routing it
 * through our server, which keeps large images off the serverless request path
 * (Vercel caps request bodies, and proxying wastes execution time). To do that
 * safely the upload has to be *signed*: the API secret stays server-side and we
 * hand the client a short-lived signature covering the exact parameters the
 * upload is allowed to use.
 *
 * Deliberately no `cloudinary` npm dependency — signing is a sorted
 * querystring plus a SHA-1, and the package would add an install script we'd
 * then have to whitelist in pnpm-workspace.yaml.
 */

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

/**
 * Returns null when Cloudinary isn't configured, so callers can degrade to the
 * paste-a-URL flow instead of erroring. Mirrors how turnstile.ts and
 * rate-limit.ts fail open when their env vars are absent.
 */
export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

/**
 * Cloudinary's signature algorithm: take every parameter that will be sent
 * except `file`, `cloud_name`, `resource_type` and `api_key`; sort by key;
 * join as `k=v` with `&`; append the API secret; SHA-1 the result.
 *
 * Because the signature covers the parameters, a client cannot alter `folder`
 * or any other signed value without invalidating it.
 */
export function signUploadParams(
  params: Record<string, string | number>,
  apiSecret: string,
): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return createHash('sha1').update(toSign + apiSecret).digest('hex');
}

/** Everything an upload folder is allowed to be. Keeps admin uploads tidy and
 *  makes it possible to apply folder-scoped rules in the Cloudinary console. */
export const UPLOAD_FOLDERS = {
  gallery: 'gsa/gallery',
  news: 'gsa/news',
} as const;

export type UploadFolder = keyof typeof UPLOAD_FOLDERS;

/** Cloudinary rejects anything larger server-side too, but failing fast in the
 *  browser gives a far better error than a truncated upload. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_UPLOAD_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
];
