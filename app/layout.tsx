import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PostHogProvider } from "@/components/PostHogProvider";
import GoogleTagScript from "@/components/GoogleTagScript";
import { socialLinks } from "@/lib/content";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.org';

/**
 * Explicit viewport export — locks initial-scale=1 so mobile browsers
 * fit the page to viewport width on load (rather than zooming out to
 * fit some phantom-wide element they think exists). viewport-fit=cover
 * respects notched screens. maximum-scale is left unset so users can
 * still pinch-to-zoom for accessibility.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Garden State Abolitionists",
    template: "%s | Garden State Abolitionists",
  },
  description: "Garden State Abolitionists — Christian abolitionists working for the immediate and total end of abortion in the state. No exceptions, no compromise, no delay.",
  keywords: ["abolish abortion", "New Jersey", "pro-life", "abolition", "end abortion"],
  verification: {
    // Set NEXT_PUBLIC_GSC_VERIFICATION in Vercel to the code Google Search
    // Console provides. Falsy value → verification meta tag simply omitted.
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
    // Bing Webmaster Tools + Pinterest domain verification. Each uses a
    // different meta name; both go under the shared `other` map so we can
    // ship any subset that's currently configured.
    other: (() => {
      const tags: Record<string, string> = {};
      if (process.env.NEXT_PUBLIC_BING_VERIFICATION) {
        tags['msvalidate.01'] = process.env.NEXT_PUBLIC_BING_VERIFICATION;
      }
      if (process.env.NEXT_PUBLIC_PINTEREST_DOMAIN_VERIFY) {
        tags['p:domain_verify'] = process.env.NEXT_PUBLIC_PINTEREST_DOMAIN_VERIFY;
      }
      return Object.keys(tags).length > 0 ? tags : undefined;
    })(),
  },
  openGraph: {
    // No static `title` here — Next merges per-page `title` (plus template)
    // into openGraph.title automatically, so /donate shares as "Donate | ..."
    // rather than the generic site name.
    description: "Dedicated to the immediate and total abolition of human abortion in New Jersey.",
    type: "website",
    locale: "en_US",
    siteName: "Garden State Abolitionists",
  },
  twitter: {
    card: "summary_large_image",
    description: "Dedicated to the immediate and total abolition of human abortion in New Jersey.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <head>
        <link rel="alternate" type="application/rss+xml" title="Garden State Abolitionists - News" href="/feed.xml" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://www.zeffy.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://www.zeffy.com" />
        {/* rel=me identity verification — tells Google/Mastodon/etc. that Garden State Abolitionists
            owns these social profiles. Backs the Knowledge Panel `sameAs`. */}
        {socialLinks.facebook && <link rel="me" href={socialLinks.facebook} />}
        {socialLinks.x && <link rel="me" href={socialLinks.x} />}
        {socialLinks.instagram && <link rel="me" href={socialLinks.instagram} />}
      </head>
      <body className={`${montserrat.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <PostHogProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:font-bold focus:rounded"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <Analytics />
          <SpeedInsights />
          <GoogleTagScript />
        </PostHogProvider>
      </body>
    </html>
  );
}
