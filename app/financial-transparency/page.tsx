import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import { orgInfo } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Financial Transparency',
  description:
    'Garden State Abolitionists is a New Jersey 501(c)(3) nonprofit. See our Federal Tax ID (EIN), mailing address, financial disclosures, and how donations are stewarded.',
  alternates: { canonical: '/financial-transparency' },
};

export default function FinancialTransparencyPage() {
  const addr = orgInfo.mailingAddress;
  return (
    <>
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Financial</span>{' '}
            <span className="font-black">TRANSPARENCY</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">
            Honest stewardship of every dollar entrusted to us
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Legal Status</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">
            <dl className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <dt className="text-sm uppercase tracking-wide text-gray-500 font-semibold">Legal name</dt>
                <dd className="text-gray-900 text-lg">{orgInfo.legalName}</dd>
              </div>
              <div>
                <dt className="text-sm uppercase tracking-wide text-gray-500 font-semibold">Tax status</dt>
                <dd className="text-gray-900 text-lg">
                  {orgInfo.taxStatus || 'To be published upon confirmation'}
                </dd>
              </div>
              <div>
                <dt className="text-sm uppercase tracking-wide text-gray-500 font-semibold">
                  Federal Tax ID (EIN)
                </dt>
                <dd className="text-gray-900 text-lg font-mono">
                  {orgInfo.ein || 'To be published upon issuance'}
                </dd>
              </div>
              <div>
                <dt className="text-sm uppercase tracking-wide text-gray-500 font-semibold">Registered in</dt>
                <dd className="text-gray-900 text-lg">{orgInfo.registeredState}</dd>
              </div>
              <div>
                <dt className="text-sm uppercase tracking-wide text-gray-500 font-semibold">Founded</dt>
                <dd className="text-gray-900 text-lg">{orgInfo.founded || '—'}</dd>
              </div>
              <div>
                <dt className="text-sm uppercase tracking-wide text-gray-500 font-semibold">Mailing address</dt>
                <dd className="text-gray-900 text-lg">
                  {addr.street ? (
                    <>
                      {addr.street}
                      <br />
                      {addr.city}, {addr.state} {addr.postalCode}
                    </>
                  ) : (
                    'To be published'
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <h2 className="text-3xl font-bold mb-6">Tax Deductibility</h2>
          {/* IRS recognition is a legal representation and is asserted only
              when orgInfo.taxStatus confirms it. Until then this states the
              pending position honestly rather than claiming a status the
              organization may not yet hold. */}
          {orgInfo.taxStatus.includes('501(c)(3)') ? (
            <p className="text-gray-700 mb-4">
              {orgInfo.legalName} is recognized by the Internal Revenue Service as a{' '}
              <strong>501(c)(3) nonprofit organization</strong>. Contributions to {orgInfo.legalName} are
              tax-deductible to the fullest extent allowed by law. Please consult your tax advisor for
              guidance on your individual situation.
            </p>
          ) : (
            <p className="text-gray-700 mb-4">
              {orgInfo.legalName} has not yet published a confirmed federal tax status. Until an IRS
              determination letter is issued, please do not treat contributions as tax-deductible.
              This page will be updated the moment that status is confirmed.
            </p>
          )}
          <p className="text-gray-700 mb-10">
            No goods or services are provided in exchange for a donation unless explicitly stated at
            the point of giving. All donors receive a written acknowledgment of their contribution for
            tax purposes.
          </p>

          <h2 className="text-3xl font-bold mb-6">Where Your Donation Goes</h2>
          <p className="text-gray-700 mb-4">
            We are committed to using every dollar faithfully to advance the abolition of abortion in
            New Jersey. Donations support:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-10">
            <li>
              <strong>Education &amp; outreach</strong> — producing written and video content,
              hosting speaking events, and equipping churches across New Jersey.
            </li>
            <li>
              <strong>Legislative advocacy</strong> — engaging state representatives, supporting
              bills of abolition, and organizing constituent contact campaigns.
            </li>
            <li>
              <strong>Website &amp; digital infrastructure</strong> — hosting, security, and
              accessibility for the site you are reading now.
            </li>
            <li>
              <strong>Operating costs</strong> — the minimal expenses required to keep a New Jersey
              nonprofit in good standing (state filings, insurance, accounting).
            </li>
          </ul>
          <p className="text-gray-700 mb-10">
            {orgInfo.legalName} does not pay salaries to leadership. Work is performed on a
            volunteer basis by New Jersey Christians committed to the abolition of abortion.
          </p>

          <h2 className="text-3xl font-bold mb-6">Public Documents</h2>
          <ul className="space-y-3 mb-10">
            {orgInfo.irsDeterminationLetterUrl && (
              <li>
                <Link
                  href={orgInfo.irsDeterminationLetterUrl}
                  className="text-red-700 underline hover:no-underline"
                  target="_blank"
                  rel="noopener"
                >
                  IRS Determination Letter (501(c)(3) tax-exempt status)
                </Link>{' '}
                <span className="text-gray-500 text-sm">— PDF, hosted by apps.irs.gov</span>
              </li>
            )}
            {orgInfo.form990Url && (
              <li>
                <Link
                  href={orgInfo.form990Url}
                  className="text-red-700 underline hover:no-underline"
                  target="_blank"
                  rel="noopener"
                >
                  IRS Form 990 (most recent filing)
                </Link>
              </li>
            )}
            {orgInfo.annualReportUrl && (
              <li>
                <Link
                  href={orgInfo.annualReportUrl}
                  className="text-red-700 underline hover:no-underline"
                  target="_blank"
                  rel="noopener"
                >
                  Annual report
                </Link>
              </li>
            )}
          </ul>
          {!orgInfo.form990Url && (
            <p className="text-gray-700 mb-10">
              As a young New Jersey nonprofit, our first annual report and Form 990 will be published
              here as soon as they are filed with the IRS. In the meantime, questions about our
              finances are welcome —{' '}
              <Link href="/contact" className="text-red-700 underline hover:no-underline">
                contact us directly
              </Link>{' '}
              and we will answer honestly and completely.
            </p>
          )}

          <h2 className="text-3xl font-bold mb-6">Payment Processing</h2>
          <p className="text-gray-700 mb-4">
            Online donations are processed through{' '}
            <Link
              href="https://www.zeffy.com/"
              className="text-red-700 underline hover:no-underline"
            >
              Zeffy
            </Link>
            , a 100%-free donation platform that does not deduct any fees from your gift. This means
            every dollar you donate reaches {orgInfo.legalName} directly.
          </p>
          <p className="text-gray-700 mb-10">
            Zeffy is PCI DSS Level 1 compliant, and donations are transmitted over encrypted HTTPS
            connections. {orgInfo.legalName} never stores your payment card information.
          </p>

          <h2 className="text-3xl font-bold mb-6">Questions</h2>
          <p className="text-gray-700 mb-4">
            We welcome scrutiny of our financial stewardship. If you have questions about how
            donations are used, our tax status, or anything else related to our finances, please{' '}
            <Link href="/contact" className="text-red-700 underline hover:no-underline">
              contact us
            </Link>
            . We will answer honestly and provide any documentation you reasonably request.
          </p>
        </div>
      </section>

      <CTABanner
        title="STAND WITH US"
        subtitle="Your support directly funds the abolition of abortion in New Jersey"
        buttonText="DONATE NOW"
        buttonLink="/donate"
      />
    </>
  );
}
