import Script from 'next/script';

/**
 * Loads Google's gtag.js once and configures every Google tag ID that has
 * an env var set (GA4 property, Google Ads account). Both are optional and
 * independent — the component is a no-op if neither is configured.
 *
 * Google explicitly warns: "Don't add more than one Google tag to each
 * page." One gtag.js loader + multiple gtag('config', ID) calls is the
 * documented pattern for tracking both a GA property and an Ads account.
 *
 * Env vars (both `--no-sensitive` so they inline into the client bundle):
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID   — GA4 property id, e.g. G-GBRVKQ22TZ
 *   NEXT_PUBLIC_GOOGLE_ADS_ID       — Ads account id,  e.g. AW-XXXXXXXXX
 *
 * Uses `strategy="afterInteractive"` so it never blocks LCP.
 * Conversion events are fired separately via lib/google-ads.ts.
 */
export default function GoogleTagScript() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

  // Load gtag.js under the first configured id — GA takes precedence when
  // both are set. Any secondary id gets configured via a follow-up
  // `gtag('config', ...)` on the same instance.
  const loaderId = gaId || adsId;
  if (!loaderId) return null;

  const configureLines = [
    gaId && `gtag('config', '${gaId}');`,
    adsId && `gtag('config', '${adsId}');`,
  ].filter(Boolean).join('\n          ');

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${loaderId}`}
      />
      <Script id="google-tag-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          ${configureLines}
        `}
      </Script>
    </>
  );
}
