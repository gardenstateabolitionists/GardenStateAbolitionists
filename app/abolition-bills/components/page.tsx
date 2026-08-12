import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';
import { FRCA } from '@/lib/data/legislators';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.org';

export const metadata: Metadata = {
  title: 'Components of an Abolition Bill',
  description:
    'The five things a bill must do to actually abolish abortion, why each one is the first to be negotiated away, and what each would mean in New Jersey.',
  alternates: { canonical: '/abolition-bills/components' },
  openGraph: {
    title: 'Components of an Abolition Bill',
    description: 'What a bill has to contain before it deserves the name.',
    type: 'article',
    url: `${BASE_URL}/abolition-bills/components`,
  },
};

/**
 * The five components. Each carries a New Jersey note, because the difference
 * between an abolition bill and a regulation is not abstract here — the state
 * has a statute that has to be dealt with directly.
 */
const COMPONENTS = [
  {
    n: 1,
    title: 'Outlaws abortion from the moment of fertilization',
    body:
      'Protection begins at fertilization, not at viability, not at a heartbeat, and not at a gestational week chosen for its poll numbers. A human being either is or is not entitled to the protection of the law; a bill that starts the clock later has already conceded that some human beings may be killed lawfully, and is arguing about how many.',
    nj:
      'New Jersey law places no gestational limit on abortion. A bill that set one would be a restriction, and would still leave every abortion before that line legal.',
  },
  {
    n: 2,
    title: 'Contains no exceptions',
    body:
      'No exception for rape, for incest, for fetal diagnosis, or for the circumstances of the pregnancy. The child conceived in rape is not less human than any other, and cannot be made an exception to the prohibition on killing without conceding that the prohibition was never about their humanity in the first place. Treatment of an ectopic pregnancy or of a mother whose life is genuinely in danger is not an exception, because the intent is not to kill the child.',
    nj:
      'This is the component most often traded away first, because it is the one that polls worst — which is exactly why a bill that keeps it is worth distinguishing from one that does not.',
  },
  {
    n: 3,
    title: 'Criminalizes abortion itself and establishes equal justice',
    body:
      'It applies existing homicide law to the preborn rather than writing a separate, weaker offense, and it does not exempt anyone by category from the operation of that law. A bill that prohibits abortion while immunizing everyone involved has not established justice; it has written a prohibition with no consequence, which is a statement of preference rather than a law.',
    nj: (
      <>
        This is what equal protection means, and it is the part most often
        misread as cruelty.{' '}
        <Link href="/what-we-believe/criminalization" className="text-green-800 underline hover:no-underline">
          Why we hold to it
        </Link>
        .
      </>
    ),
  },
  {
    n: 4,
    title: 'Does not submit to unconstitutional court rulings',
    body:
      'It takes effect on passage rather than waiting for permission from a court. Trigger conditions, severability clauses written to survive review, and phase-ins are devices that let a legislature take credit for a law while ensuring nothing changes on the ground. A state has its own duty to protect the people within it, and that duty is not suspended while it waits to be told whether it may.',
    nj:
      'New Jersey has gone further than most states in writing abortion access into its own statute, so the obstacle here is not a court ruling. It is the Legislature itself.',
  },
  {
    n: 5,
    title: 'Repeals or supersedes every statute that permits abortion',
    body:
      'A new prohibition sitting alongside an old permission does not abolish anything — it creates a contradiction that courts resolve in favor of the existing right. The bill has to name the statutes it displaces and remove them.',
    nj: (
      <>
        In New Jersey this is the whole ball game. The{' '}
        <strong>{FRCA.title}</strong> ({FRCA.bill}) codifies a statutory right to
        abortion, so any bill of abolition here would have to repeal it by name.
        A bill that did not would be void the day it passed.
      </>
    ),
  },
];

export default function ComponentsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Components of an Abolition Bill',
    url: `${BASE_URL}/abolition-bills/components`,
    about: { '@type': 'Thing', name: 'Abolition of abortion' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Components of an</span>{' '}
            <span className="font-black">ABOLITION BILL</span>
          </h1>
          <div className="w-12 h-[3px] bg-green-700 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">
            What a bill must contain to deserve the name
          </p>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Abolition Bills', href: '/abolition-bills' },
          { label: 'Components' },
        ]}
      />

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-lg text-gray-700 mb-4">
            Not every bill described as pro-life is a bill of abolition. Most regulate
            abortion &mdash; they restrict when it may happen, or who must be told, or what
            the building must look like. A bill of abolition ends it, by extending to the
            preborn the same protection the law already gives everyone else.
          </p>
          <p className="text-gray-700 mb-10">
            Five things separate the two. They are listed here so that when a bill is
            introduced anywhere, it can be read against them rather than against its press
            release &mdash; and so that the components most often negotiated away are the
            ones you look for first.
          </p>

          <ol className="space-y-6 mb-12">
            {COMPONENTS.map((c) => (
              <li key={c.n} className="border-l-4 border-green-700 bg-gray-50 p-6 rounded-r">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {c.n}. {c.title}
                </h2>
                <p className="text-gray-700 mb-3">{c.body}</p>
                <p className="text-sm text-gray-600 border-t border-gray-200 pt-3">
                  <span className="font-semibold uppercase tracking-wide text-gray-500">
                    In New Jersey:
                  </span>{' '}
                  {c.nj}
                </p>
              </li>
            ))}
          </ol>

          <div className="border-l-4 border-green-700 bg-gray-50 p-6 rounded-r">
            <h2 className="text-xl font-bold mb-2">There is no such bill here yet</h2>
            <p className="text-gray-700 mb-3">
              No bill of abolition and no equal-protection bill has been introduced in the
              New Jersey Legislature. This page is the standard to hold one to when it is,
              and the standard to hold a legislator to when they tell you they are pro-life.
            </p>
            <p className="text-gray-700">
              <Link href="/abolition-bills" className="text-green-800 underline hover:no-underline">
                Where New Jersey actually stands
              </Link>{' '}
              &middot;{' '}
              <Link href="/legislators" className="text-green-800 underline hover:no-underline">
                Find and contact your legislators
              </Link>{' '}
              &middot;{' '}
              <Link href="/the-petition" className="text-green-800 underline hover:no-underline">
                Sign the petition
              </Link>
            </p>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
