import type { NextRequest } from 'next/server';

type HeaderLike = { get: (name: string) => string | null };

/**
 * Extract a best-effort client IP from proxy headers.
 * Prefer the leftmost x-forwarded-for entry (the original client), then
 * x-real-ip, then 'unknown'.
 *
 * On Vercel these headers are set by the edge and cannot be spoofed by
 * arbitrary clients. If the app is ever hosted behind a proxy that doesn't
 * strip incoming headers, callers should consider stricter validation.
 */
export function getClientIpFromHeaders(headers: HeaderLike): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }
  return headers.get('x-real-ip')?.trim() || 'unknown';
}

/** Convenience overload for NextRequest. */
export function getClientIp(request: NextRequest): string {
  return getClientIpFromHeaders(request.headers);
}
