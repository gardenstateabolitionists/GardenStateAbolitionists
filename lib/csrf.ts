import { NextRequest, NextResponse } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.com';

const ALLOWED_ORIGINS = [
  siteUrl,
  // Support both www and non-www variants
  siteUrl.includes('://www.') ? siteUrl.replace('://www.', '://') : siteUrl.replace('://', '://www.'),
  'http://localhost:3000',
  'http://localhost:3001',
];

/**
 * Validates the Origin header on state-changing requests (POST, PATCH, DELETE, PUT).
 * Returns a 403 response if the origin is invalid, or null if the request is allowed.
 * GET/HEAD requests are always allowed (they should be idempotent).
 */
export function validateCsrf(request: NextRequest): NextResponse | null {
  const method = request.method.toUpperCase();

  // Safe methods don't need CSRF validation
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return null;
  }

  const origin = request.headers.get('origin');

  // If no origin header, check referer as fallback
  if (!origin) {
    const referer = request.headers.get('referer');
    if (referer) {
      try {
        const refererOrigin = new URL(referer).origin;
        if (ALLOWED_ORIGINS.some((allowed) => refererOrigin === new URL(allowed).origin)) {
          return null;
        }
      } catch {
        // Invalid referer URL
      }
    }
    // No origin or referer — allow for non-browser clients (curl, mobile apps)
    // SameSite cookies already block cross-site browser requests
    return null;
  }

  // Check if origin is allowed
  if (ALLOWED_ORIGINS.some((allowed) => {
    try {
      return origin === new URL(allowed).origin;
    } catch {
      return false;
    }
  })) {
    return null;
  }

  // Vercel preview deployments — only allow when explicitly opted in via env.
  // Set VERCEL_PREVIEW_PROJECT_SLUG to your Vercel project slug (e.g.
  // "garden-state-abolitionists-website"). Preview URLs then match:
  //   <slug>-<branch|hash>-<team>.vercel.app
  // The trailing dash after the slug is REQUIRED so a hostile project like
  // "<slug>-attacker.vercel.app" cannot bypass by including the slug as a
  // substring/prefix.
  const previewSlug = process.env.VERCEL_PREVIEW_PROJECT_SLUG;
  if (previewSlug) {
    try {
      const hostname = new URL(origin).hostname;
      if (
        hostname.endsWith('.vercel.app') &&
        hostname.startsWith(`${previewSlug}-`)
      ) {
        return null;
      }
    } catch {
      // Fall through to 403
    }
  }

  return NextResponse.json(
    { error: 'Forbidden: invalid origin' },
    { status: 403 }
  );
}
