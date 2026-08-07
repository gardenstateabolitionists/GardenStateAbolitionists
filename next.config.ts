import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  {
    key: 'Content-Security-Policy',
    // connect-src includes both self (for the PostHog /ingest rewrite) and
    // Sentry's ingest hosts. script/img/font retain their previous scope.
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self' https: https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net; frame-src 'self' https://www.youtube.com https://www.zeffy.com https://td.doubleclick.net; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // PostHog's `/decide` and other endpoints use trailing slashes that Next
  // would otherwise 308 to a non-trailing form, breaking the client.
  skipTrailingSlashRedirect: true,
  async redirects() {
    // NOTE: `/districts/[chamber]/[N]` → `/legislators/[slug]` 301s were
    // generated here from the legislator dataset. They are omitted while the
    // legislator routes live in `staged-for-nj/`; restore them in the same
    // change that restores those routes, so district URLs never resolve to
    // a 404 or compete with the canonical profile URL for indexing.
    return [
      // Canonical hostname: apex → www with a PERMANENT (308) redirect.
      // Vercel's default apex→www redirect is 307 (temporary), which was
      // causing Google to keep the non-www URL as its canonical even
      // though our rel="canonical" tags say www. 7 pages had Google-
      // canonical = non-www vs our canonical = www when this was
      // diagnosed on 2026-08-06. `permanent: true` emits 308 (Next.js's
      // method-preserving equivalent of 301); Google treats 308 and 301
      // identically for canonicalization.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'gardenstateabolitionists.org' }],
        destination: 'https://www.gardenstateabolitionists.org/:path*',
        permanent: true,
      },
      { source: '/petition', destination: '/the-petition', permanent: true },
    ];
  },
  async rewrites() {
    // PostHog reverse-proxy so its script/api load from our origin (dodges
    // most ad-blockers, keeps CSP tight, and lets us cache the static
    // recorder bundle for a year — same pattern as MRA).
    return [
      { source: '/ingest/static/:path*', destination: 'https://us-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/array/:path*', destination: 'https://us-assets.i.posthog.com/array/:path*' },
      { source: '/ingest/:path*', destination: 'https://us.i.posthog.com/:path*' },
    ];
  },
  async headers() {
    return [
      {
        // PostHog's proxied static assets are version-pinned via ?v=, so safe
        // to cache immutably for a year; a PostHog upgrade busts the URL.
        source: '/ingest/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gardenstateabolitionists.org',
      },
      {
        protocol: 'https',
        hostname: '*.gardenstateabolitionists.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "garden-state-abolitionists",

  project: "garden-state-abolitionists",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
