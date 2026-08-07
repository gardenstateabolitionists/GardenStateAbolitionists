import type { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import UsStatesMap from '@/components/partners/UsStatesMap';
import {
  getNationalPartners,
  getStatePartners,
  partnersByState,
} from '@/lib/data/partners';
import { PARTNER_DATA_REFRESHED_ON } from '@/lib/data/data-freshness';

export const metadata: Metadata = {
  title: 'Allied Abolition Groups Across America',
  description:
    'A directory of Christian abolitionist organizations working to end abortion in the United States — state-by-state contacts, websites, and outreach opportunities.',
  alternates: { canonical: '/partners' },
};

export default function PartnersPage() {
  const national = getNationalPartners();
  const states = getStatePartners();
  const byState = partnersByState();
  const coverage = states.length;

  // ItemList schema — one page listing many organizations = eligible for
  // list-style SERP treatments + gives Google clear entity data.
  // Partners without a live URL are dropped from this schema (no point
  // giving Google a broken entity reference).
  const linkable = [...national, ...states].filter((p) => Boolean(p.url));
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: linkable.length,
    itemListElement: linkable.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: p.url,
      name: p.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero */}
      <section className="bg-[#1a1a1a] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-black mb-4">
            Allied Abolition Groups Across America
          </h1>
          <div className="w-12 h-[3px] bg-green-700 mx-auto mb-6" />
          <p className="text-gray-300 max-w-3xl mx-auto">
            Christian abolitionists in {coverage}{' '}states working alongside Abolish Abortion
            New Jersey for the immediate and total end of abortion in the United States. Find your
            state&apos;s coalition, share resources, and get connected.
          </p>
        </div>
      </section>

      {/* State coverage map */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2 text-center">Coverage Map</h2>
          <p className="text-center text-gray-600 mb-8">
            Click any green state to jump to its coalition below.
          </p>
          <UsStatesMap partnersByState={byState} />
        </div>
      </section>

      {/* National network */}
      <section className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">National Network</h2>
          <p className="text-gray-700 mb-8">
            The organizations coordinating the abolitionist movement at the national level.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {national.map((p) => (
              <PartnerCard key={p.name} partner={p} />
            ))}
          </div>
        </div>
      </section>

      {/* State-by-state */}
      <section className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">State-by-State Coalitions</h2>
          <p className="text-gray-700 mb-8">
            Every allied abolitionist coalition with a real live website. Click through, get
            connected, share resources.
          </p>
          <div className="space-y-6">
            {states.map((p) => (
              <div
                key={p.state}
                id={slugify(p.state)}
                // Fallback for browsers without smooth scrollIntoView JS —
                // the CSS scroll-margin-top gives ~30vh of headroom so the
                // native anchor jump lands with the entry visible below the
                // sticky header instead of clipped by it.
                className="scroll-mt-[30vh]"
              >
                <PartnerCard partner={p} showState />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reach out */}
      <section className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Missing from this list?</h2>
          <p className="text-gray-700 mb-6">
            If your organization is a Christian abolitionist coalition with a live website and
            we&apos;ve missed you, reach out — we&apos;ll add you here and ask you to link back
            to us. Backlinks between allied sites strengthen the whole movement&apos;s reach.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-[#1a1a1a] text-white font-bold hover:bg-black transition-colors"
          >
            Contact us to be added
          </Link>
        </div>
      </section>

      <section className="bg-white py-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-right">
          <p className="text-xs text-gray-500">
            Directory last verified {PARTNER_DATA_REFRESHED_ON}.
          </p>
        </div>
      </section>

      <CTABanner
        title="STAND WITH US"
        subtitle="Every dollar directly supports abolition work in New Jersey"
        buttonText="DONATE NOW"
        buttonLink="/donate"
      />
    </>
  );
}

const SOCIAL_LABEL: Record<string, string> = {
  instagram: 'Instagram',
  twitter: 'X',
  facebook: 'Facebook',
  youtube: 'YouTube',
  tiktok: 'TikTok',
};

function PartnerCard({
  partner,
  showState = false,
}: {
  partner: {
    name: string;
    url: string | null;
    blurb: string;
    state?: string;
    socials?: { platform: string; url: string }[];
  };
  showState?: boolean;
}) {
  const host = partner.url
    ? partner.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
    : null;
  const socials = partner.socials || [];
  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white hover:border-green-700 transition-colors">
      {showState && partner.state && (
        <p className="text-xs uppercase tracking-wide text-green-800 font-bold mb-1">
          {partner.state}
        </p>
      )}
      <h3 className="font-bold text-lg text-gray-900 mb-1">
        {partner.url ? (
          <a
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-800 transition-colors"
          >
            {partner.name}
          </a>
        ) : (
          partner.name
        )}
      </h3>
      {host && <p className="text-xs text-gray-500 mb-3 font-mono">{host}</p>}
      {!host && socials.length === 0 && (
        <p className="text-xs text-gray-500 mb-3 italic">Website currently unavailable</p>
      )}
      <p className="text-gray-700 text-sm">{partner.blurb}</p>
      {socials.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {socials.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-green-800 border border-green-200 rounded px-2 py-1 hover:bg-green-50 hover:no-underline"
            >
              {SOCIAL_LABEL[s.platform] || s.platform} &rarr;
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

