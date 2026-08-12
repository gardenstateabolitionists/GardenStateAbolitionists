import type { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import Breadcrumbs from '@/components/Breadcrumbs';
import CityFinder from '@/components/cities/CityFinder';
import CitiesMap from '@/components/cities/CitiesMap';
import { CITIES, ALL_CITY_FACTS, districtLabel } from '@/lib/data/cities';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.org';

export const metadata: Metadata = {
  title: 'New Jersey Cities — Abolition Where You Live',
  description:
    'Local pages for New Jersey cities and townships. Find the legislators who represent you, how they voted on the Freedom of Reproductive Choice Act, and where the abortion facilities in your municipality are.',
  alternates: { canonical: '/cities' },
  openGraph: {
    title: 'New Jersey Cities — Abolition Where You Live',
    description: 'Your legislators, their recorded votes, and the facilities in your town.',
    type: 'website',
    url: `${BASE_URL}/cities`,
  },
};

export default function CitiesIndexPage() {
  const byPop = [...CITIES].sort((a, b) => b.population - a.population);
  const covered = byPop.length;
  const planned = ALL_CITY_FACTS.length;
  const counties = new Set(byPop.map((c) => c.county)).size;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'New Jersey Cities',
    url: `${BASE_URL}/cities`,
    about: { '@type': 'Place', name: 'New Jersey' },
    hasPart: byPop.map((c) => ({
      '@type': 'WebPage',
      name: c.formalName,
      url: `${BASE_URL}/cities/${c.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">New Jersey</span>{' '}
            <span className="font-black">CITIES</span>
          </h1>
          <div className="w-12 h-[3px] bg-green-700 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">
            Abolition work where you live
          </p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Cities' }]} />

      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-lg text-gray-700 mb-4">
            New Jersey has 564 municipalities and every one of them is represented in Trenton
            by three people. These pages tell you who yours are, how they voted when the
            Legislature wrote abortion into statute, and what is operating in your town.
          </p>
          <p className="text-gray-700 mb-10">
            {covered === planned ? (
              <>All {covered} of the largest municipalities in the state are covered.</>
            ) : (
              <>
                {covered} {covered === 1 ? 'municipality is' : 'municipalities are'} covered so
                far, across {counties} {counties === 1 ? 'county' : 'counties'}, working down
                from the largest. The remaining {planned - covered} are being written.
              </>
            )}{' '}
            If yours is missing,{' '}
            <Link href="/contact" className="text-green-800 underline hover:no-underline">
              tell us
            </Link>{' '}
            and we will prioritise it.
          </p>

          <div className="mb-10">
            <CityFinder />
          </div>

          {byPop.length > 0 && (
            <div className="mb-12">
              <CitiesMap cities={byPop} />
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Covered municipalities</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {byPop.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/cities/${c.slug}`}
                  className="block border-l-4 border-green-700 bg-gray-50 p-4 rounded-r hover:bg-gray-100 transition-colors"
                >
                  <p className="font-bold text-gray-900">{c.formalName}</p>
                  <p className="text-sm text-gray-600">
                    {c.county} County &middot; {c.populationLabel} &middot;{' '}
                    {districtLabel(c.districts)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
