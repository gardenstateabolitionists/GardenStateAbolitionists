import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.abolishabortionmichigan.com';

export const metadata: Metadata = {
  title: 'Detroit and the Underground Railroad — Roots of Abolition',
  description:
    "The Second Baptist Church, William Lambert, George DeBaptiste, and the Detroit Vigilance Committee — the antebellum abolitionist network that made Detroit \"Midnight\" the northern terminus of the Underground Railroad. And why that inheritance is the parent of modern abortion abolition.",
  alternates: { canonical: '/cities/detroit/underground-railroad' },
};

export default function UndergroundRailroadPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Detroit and the Underground Railroad — Roots of Abolition',
    author: { '@type': 'Organization', name: 'Abolish Abortion Michigan' },
    publisher: { '@type': 'Organization', name: 'Abolish Abortion Michigan' },
    url: `${BASE_URL}/cities/detroit/underground-railroad`,
    about: [
      { '@type': 'Place', name: 'Detroit, Michigan' },
      { '@type': 'Event', name: 'Underground Railroad' },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <section className="bg-[#1a1a1a] text-white py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-3">Detroit · 1836–1861</p>
          <h1 className="text-3xl md:text-5xl mb-6">
            <span className="font-light">Detroit and the</span>{' '}
            <span className="font-black">UNDERGROUND RAILROAD</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.2em] uppercase text-gray-300">
            The Roots of Abolition
          </p>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Cities', href: '/cities' },
          { label: 'Detroit', href: '/cities/detroit' },
          { label: 'Underground Railroad' },
        ]}
      />

      <section className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-4 prose prose-lg prose-gray">
          <p>
            In the 1830s, a fugitive slave running north from Kentucky had one
            last river to cross. The Detroit River ran a mile wide between
            Michigan and Windsor, Ontario, and beyond it was British soil, where
            the 1834 Slavery Abolition Act made every escaped slave a free man
            by the moment his foot touched the far shore. Detroit was the
            station house where that crossing was made. The abolitionists who
            ran it called their city, in coded correspondence, <em>Midnight</em>.
          </p>

          <h2>Second Baptist Church</h2>
          <p>
            The station&apos;s headquarters was Second Baptist Church, founded in
            1836 by thirteen freed African-Americans who had walked out of the
            First Baptist Church of Detroit over its refusal to admit Black
            members. Second Baptist met first in a rented room; by 1857 it had
            built a brick sanctuary on Monroe Street in Greektown that still
            stands today. The church&apos;s <em>Croghan Street Station</em> hid
            fugitives in a subterranean space under the sanctuary. Between 1836
            and 1865, an estimated 5,000 human beings passed through that
            basement on their way to freedom.
          </p>

          <h2>William Lambert and George DeBaptiste</h2>
          <p>
            The abolitionist network that made the station work was led by two
            men: <strong>William Lambert</strong>, a Black abolitionist and
            tailor who founded Detroit&apos;s Colored Vigilant Committee in 1842,
            and <strong>George DeBaptiste</strong>, a former valet to President
            William Henry Harrison who operated the steamboat <em>T. Whitney</em>
            {' '}across the Detroit River. Lambert coordinated with white
            abolitionist ministers — Rev. Charles Duffield of St. Matthew&apos;s,
            Rev. Marcus Swift of the Wesleyan Methodists — to shelter fugitives
            in safe houses across the city. DeBaptiste, unable to pilot the
            steamboat himself due to legal barriers, hired a white captain and
            ran the crossing under his own management.
          </p>

          <h2>The abolitionist argument</h2>
          <p>
            What the Detroit Vigilance Committee refused, and what makes them
            the ideological parents of modern abolition, was <em>gradualism</em>.
            The dominant 19th-century argument against slavery in the northern
            states was that it would fade on its own — that free labor would
            outcompete slave labor, that the peculiar institution would die of
            economic causes, that abolitionists ought not agitate the South and
            risk civil war. William Lloyd Garrison famously answered that
            argument in the first issue of <em>The Liberator</em>: &ldquo;I am
            in earnest — I will not equivocate — I will not excuse — I will not
            retreat a single inch — AND I WILL BE HEARD.&rdquo; Lambert,
            DeBaptiste, and their allies stood in that same tradition.
          </p>

          <p>
            The abolitionists did not petition Congress for a slower Fugitive
            Slave Act, or for exceptions from slavery for elderly slaves, or
            for a phase-out beginning in 1900. They insisted that slavery was
            man-stealing, that the enslaved was a person whose right to
            liberty came from God and could not be qualified by human statute,
            and that any law which said otherwise was <em>void</em>. That
            argument was called radical and impractical in its own day. It
            was, in the end, the argument that won.
          </p>

          <h2>The parallel to modern abolition</h2>
          <p>
            Abolish Abortion Michigan stands in the same tradition, on the same
            argument, applied to the same class of person under a different
            name. The preborn are image-bearers of God whose right to live comes
            not from statute but from creation. The laws which say otherwise —
            Michigan&apos;s 2022 Reproductive Freedom for All amendment among
            them — are void by the same standard the Vigilance Committee
            applied to the Fugitive Slave Act.
          </p>

          <p>
            The gradualist argument on abortion is the exact 1830s argument on
            slavery. Wait for public opinion to shift. Don&apos;t rock the boat.
            Accept restrictions and exceptions and phase-outs. Focus on the
            achievable. It is the mainstream &ldquo;pro-life&rdquo; strategy of
            the last forty years, and it is the argument the Detroit
            abolitionists refused. What William Lambert and George DeBaptiste
            insisted on, and what we insist on today, is that a person is a
            person under the law from the moment they exist — no exceptions, no
            phase-in, no compromise with the institution that says otherwise.
          </p>

          <h2>Visiting the sites today</h2>
          <p>
            The Second Baptist Church sanctuary at 441 Monroe Street in
            Greektown is still an active congregation and welcomes visitors.
            The Detroit Historical Society preserves the story of the Croghan
            Street Station and Detroit&apos;s role as the terminus. The
            International Underground Railroad Memorial on the Detroit
            Riverwalk (near Hart Plaza) marks the crossing point itself, with a
            matching monument on the Windsor side. For a full self-guided tour
            of Detroit&apos;s Underground Railroad sites, the Society&apos;s
            walking guide is the best starting point.
          </p>

          <p className="text-sm text-gray-600 border-t border-gray-200 pt-6 mt-8">
            Sources: <em>A History of Second Baptist Church of Detroit</em> (Rev. Nathaniel
            Leach, 1988); &ldquo;The Underground Railroad in Michigan&rdquo;
            (Michigan History Center, MI DNR); <em>Passages to Freedom</em>
            (Detroit Historical Society); University of Michigan Bentley
            Historical Library archives on William Lambert and George
            DeBaptiste.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-8 border-y border-gray-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Link
            href="/cities/detroit"
            className="inline-block px-5 py-2 bg-[#1a1a1a] text-white font-semibold hover:bg-black transition-colors rounded"
          >
            &larr; Back to Detroit
          </Link>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
