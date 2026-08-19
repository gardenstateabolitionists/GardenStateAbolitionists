import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import CTABanner from '@/components/CTABanner';
import NewsCard from '@/components/NewsCard';
import { statistics, statisticsSource, socialLinks, orgInfo } from '@/lib/content';
import { getFeaturedHomePhotos } from '@/lib/data/gallery-store';
import { getAllNewsArticles } from '@/lib/data/news-store';

export const metadata: Metadata = {
  title: 'Equal Protection for the Preborn',
  description: 'Abolitionists in New Jersey devoted to establishing justice and equal protection for our preborn neighbors. Join the movement to abolish abortion.',
  alternates: { canonical: '/' },
};

// ISR: revalidate once a day. On-demand revalidation is triggered by the
// news POST/PATCH/DELETE routes via revalidatePath('/'), so fresh news
// appears immediately after admin publish without the 24hr wait.
// (Bumped from 300s to save Neon compute — see project_aam_neon_compute.)
export const revalidate = 86400;

/**
 * Homepage counters, in display order. Each entry is dropped when its figure
 * is blank, so the grid only ever shows numbers with a real source behind
 * them (see `statistics` in lib/content.ts for why this set differs from the
 * Michigan original). Do not reintroduce a cumulative "since 1973" total or a
 * "Proposal 3" framing — neither is supportable for New Jersey.
 */
function buildStatCounters() {
  return [
    { value: statistics.annualAbortions, label: 'Abortions in New Jersey in 2024' },
    { value: statistics.dailyAbortions, label: 'Every single day' },
    { value: statistics.abortionRate, label: 'Abortion rate per 1,000 women — more than double the national 15.5' },
    { value: statistics.shareOfPregnancies, label: 'Of New Jersey pregnancies end in abortion' },
  ].filter((s) => s.value);
}

/**
 * Photographs used in the homepage outreach grid.
 *
 * The alt text describes what is in the frame and nothing more. Several of these
 * were taken outside New Jersey (Faneuil Hall, the Boston Public Garden and the
 * Paramount are all Boston), so none of them claims a place. This site has a
 * standing habit of inheriting Michigan premises and reading them as New Jersey
 * facts; an unsupported location in alt text is the same mistake in miniature.
 */
const FALLBACK_OUTREACH_PHOTOS: { src: string; alt: string; focalY?: number }[] = [
  {
    src: '/images/outreach-1.webp',
    alt: 'Three abolitionists standing together holding signs reading "What about her body and her rights?" and "Abortion is murder — forgiveness for murder can be found in Jesus Christ alone."',
    // Portrait. Faces mid-frame, signs low — a centre crop severed the lettering.
    focalY: 62,
  },
  {
    src: '/images/outreach-2.webp',
    alt: 'An abolitionist holding an "Abortion is murder" sign beside a statue of Samuel Adams while others speak with passers-by.',
  },
  {
    src: '/images/outreach-3.webp',
    alt: 'Two abolitionists talking with a man on a city street at night, holding signs reading "Your neighbour is being murdered in your midst" and "Every age has its evils, every age has its abolitionists."',
  },
  {
    src: '/images/outreach-4.webp',
    alt: 'A young man raising an "Abortion is murder" sign on a park path as a group walks alongside him.',
  },
  {
    src: '/images/outreach-5.webp',
    alt: 'Four abolitionists in ABOLITIONIST shirts standing behind a row of signs comparing abortion to historic chattel slavery.',
  },
  {
    src: '/images/outreach-6.webp',
    alt: 'An abolitionist holding a sign and talking with a group of young men on a seaside boardwalk.',
    // Portrait. Wide empty sky up top; the conversation sits in the lower half.
    focalY: 58,
  },
];

export default async function HomePage() {
  const statCounters = buildStatCounters();

  // Admin-managed photos win; the built-in six are the fallback so the grid can
  // never render empty just because nobody has ticked "Show on the homepage" yet.
  // A caption doubles as alt text — an uncaptioned photo still needs one, so it
  // gets a generic description rather than an empty alt.
  const featured = await getFeaturedHomePhotos(6);
  const outreachPhotos = featured.length
    ? featured.map((p) => ({
        src: p.url,
        alt: p.caption || 'Garden State Abolitionists outreach',
        focalY: p.focalY ?? 50,
      }))
    : FALLBACK_OUTREACH_PHOTOS;

  let latestNews: Awaited<ReturnType<typeof getAllNewsArticles>> = [];
  try {
    const articles = await getAllNewsArticles(true);
    latestNews = articles.slice(0, 3);
  } catch {
    // Database unavailable at build time; ISR will populate on first request
  }

  // Proper NGO schema with New Jersey location signal — helps Google understand
  // this is a New Jersey-specific advocacy nonprofit (not a generic org) so it
  // becomes eligible for Knowledge Panel + local SERP treatments.
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Garden State Abolitionists',
    url: 'https://www.gardenstateabolitionists.com',
    logo: 'https://www.gardenstateabolitionists.com/images/gsa-logo.webp',
    description:
      'Abolitionists in New Jersey devoted to establishing justice and equal protection for our preborn neighbors. We call for the immediate and total abolition of abortion in the state of New Jersey.',
    slogan: 'Equal protection for the preborn.',
    areaServed: {
      '@type': 'State',
      name: 'New Jersey',
      containedInPlace: { '@type': 'Country', name: 'United States' },
    },
    // Emitted only once a real address exists. Structured data is consumed by
    // search engines as a factual claim about where the organization is, so a
    // placeholder here would be worse than no address at all.
    ...(orgInfo.mailingAddress.street
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: orgInfo.mailingAddress.street,
            addressLocality: orgInfo.mailingAddress.city,
            addressRegion: orgInfo.mailingAddress.state,
            postalCode: orgInfo.mailingAddress.postalCode,
            addressCountry: orgInfo.mailingAddress.country,
          },
        }
      : {}),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'General Inquiry',
      ...(orgInfo.contactEmail ? { email: orgInfo.contactEmail } : {}),
      url: 'https://www.gardenstateabolitionists.com/contact',
      availableLanguage: 'English',
      areaServed: 'US-NJ',
    },
    // Empty entries are dropped — an unconfigured profile must not emit a
    // blank sameAs value, which search engines read as a malformed claim.
    sameAs: [
      socialLinks.facebook,
      socialLinks.x,
      socialLinks.instagram,
      socialLinks.youtube,
    ].filter(Boolean),
    knowsAbout: [
      'abortion abolition',
      'equal protection for the preborn',
      'New Jersey legislation',
      'pro-life advocacy',
      'Christian abolitionism',
    ],
    // Nonprofit signals for Google + Ad Grants. `Nonprofit501c3` is the
    // schema.org enum for US 501(c)(3) organizations and is only emitted once
    // orgInfo.taxStatus confirms that status actually exists — asserting it
    // early would be a false claim in machine-readable form.
    ...(orgInfo.taxStatus.includes('501(c)(3)')
      ? { nonprofitStatus: 'Nonprofit501c3' }
      : {}),
    ...(orgInfo.ein && { taxID: orgInfo.ein }),
  };

  // WebSite + SearchAction — tells Google that /news?q= is our internal search
  // endpoint. Makes the site eligible for the Sitelinks Searchbox on brand SERPs.
  // Google requires WebSite (not WebPage) and the exact `{search_term_string}`
  // token; the `?q=` param must round-trip through NewsSearch.
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Garden State Abolitionists',
    url: 'https://www.gardenstateabolitionists.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://www.gardenstateabolitionists.com/news?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-[#1a1a1a] text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <Image
            src="/images/gsa-logo.webp"
            alt="Garden State Abolitionists"
            width={176}
            height={176}
            className="h-32 md:h-44 w-auto mx-auto mb-6"
            priority
          />
          <h1 className="text-4xl md:text-6xl font-black tracking-wide mb-4">GARDEN STATE ABOLITIONISTS</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            We are dedicated to the immediate and total abolition of human abortion in the state of New Jersey.
            Not regulation. Not reduction. <span className="text-green-500 font-semibold">Abolition.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/the-petition"
              className="inline-block px-8 py-4 bg-green-700 text-white font-bold text-lg hover:bg-green-800 transition-colors"
            >
              SIGN THE PETITION
            </Link>
            <Link
              href="/who-we-are"
              className="inline-block px-8 py-4 border-2 border-white text-white font-bold text-lg hover:bg-white hover:text-[#1a1a1a] transition-colors"
            >
              WHO WE ARE
            </Link>
          </div>
        </div>
      </section>

      {/* Outreach photo grid — sits between the hero's SIGN THE PETITION call and
          the statistics. Deliberately fixed-height tiles with object-cover so six
          photos of mixed orientation (two portrait, four landscape) read as one
          even grid instead of a ragged one, and so the row height cannot shift as
          images load.

          The alt text describes only what is visible. Several of these were taken
          outside New Jersey — Faneuil Hall, the Public Garden and the Paramount are
          Boston — so nothing here states or implies a location. */}
      <section className="bg-[#1a1a1a] pt-16 md:pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Abolitionists at Work</h2>
          <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
            Preaching the gospel and pleading for the preborn in public.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {outreachPhotos.map((photo) => (
              <div
                key={photo.src}
                className="relative aspect-[4/3] overflow-hidden bg-black"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                  style={{ objectPosition: `center ${photo.focalY ?? 50}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Counter — renders only the figures that have actually been
          sourced. `statistics` ships empty on purpose (see lib/content.ts): the
          previous numbers were Michigan's, and the fourth counter was keyed to
          Michigan's Proposal 3, which has no New Jersey equivalent. The New
          Jersey analog used below is the Freedom of Reproductive Choice Act,
          signed January 2022. The whole section is hidden until at least one
          figure is populated, so the page never shows empty counters. */}
      {statCounters.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">The Reality in New Jersey</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Every statistic represents a precious life lost to abortion. These are not just numbers—they are our neighbors, created in the image of God.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {statCounters.map((stat) => (
                <div key={stat.label} className="text-center min-w-0">
                  <div className="text-2xl sm:text-3xl md:text-2xl lg:text-4xl xl:text-5xl font-bold text-green-800 mb-2 break-words">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
            {statisticsSource && (
              <p className="text-gray-500 text-xs text-center mt-8">
                Source: {statisticsSource}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Mission Statement */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            <span className="text-green-800 font-semibold">Abortion is the intentional killing of the human fetus, or the performance of a procedure intentionally designed to kill the human fetus.</span>
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Abortion is the murder, the sacrifice, of tiny neighbors who have not yet been born. This great atrocity must be abolished.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            We believe that every human being bears the image of God from the moment of fertilization and deserves equal protection under the law. We call upon the State of New Jersey to recognize the God-given right to life for all human beings and to abolish the practice of abortion entirely.
          </p>
        </div>
      </section>

      {/* What is Abolition */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">What is Abolition?</h2>
              <p className="text-gray-700 mb-4">
                Abolition is the immediate and unconditional legal end, to a legal but immoral practice. It stands in contrast to the incremental approach to abortion that has dominated the pro-life movement for over fifty years.
              </p>
              <p className="text-gray-700 mb-4">
                While incrementalism seeks to regulate and restrict abortion, abolition demands its total criminalization as the murder that it is. We do not accept any exceptions—not for rape, incest, or any other circumstance.
              </p>
              <p className="text-gray-700 mb-6">
                Just as William Wilberforce, and others worked to abolish the slave trade, we work to abolish abortion—not to make it rarer, safer, or more regulated, but to end legal homicide completely.
              </p>
              <Link
                href="/what-we-believe"
                className="inline-block px-6 py-3 bg-[#1a1a1a] text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                WHAT WE BELIEVE
              </Link>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-green-800">Key Principles</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-800 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>Human life begins at fertilization</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-800 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>All human beings deserve equal protection under the law</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-800 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>Abortion is murder and must be treated as such</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-800 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>No exceptions—all children deserve protection</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-800 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>The Gospel offers forgiveness for all sins, including abortion</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Scorecard CTA — sits between "What is Abolition" and Latest News
          so visitors who just learned the definition can immediately see
          how it plays out in the current NJ Legislature. */}
      {/* Legislator-scorecard CTA removed: /legislators is parked in
          staged-for-nj/ until a New Jersey roster exists. Restore this block in
          the same change that restores the route. Note the old copy promised
          voting records on abolition bills — New Jersey has none, so the copy
          needs rewriting, not just relinking. */}

      {/* Latest News */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest News</h2>
            <Link href="/news" className="text-green-800 font-semibold hover:text-green-900 transition-colors">
              View All &rarr;
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((article) => (
              <NewsCard
                key={article.slug}
                title={article.title}
                excerpt={article.excerpt}
                date={article.created_at ? new Date(article.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : ''}
                slug={article.slug}
                image={article.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Get Involved</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Sign the Petition</h3>
              <p className="text-gray-600 mb-4">
                Add your name to the growing list of New Jerseyans calling for the abolition of abortion.
              </p>
              <Link href="/the-petition" className="text-green-800 font-semibold hover:text-green-900">
                Sign Now &rarr;
              </Link>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Spread the Word</h3>
              <p className="text-gray-600 mb-4">
                Share our message with your church, community, and elected officials.
              </p>
              <Link href="/media" className="text-green-800 font-semibold hover:text-green-900">
                Get Resources &rarr;
              </Link>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Donate</h3>
              <p className="text-gray-600 mb-4">
                Support our efforts to abolish abortion in New Jersey through your generous giving.
              </p>
              <Link href="/donate" className="text-green-800 font-semibold hover:text-green-900">
                Give Now &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}
