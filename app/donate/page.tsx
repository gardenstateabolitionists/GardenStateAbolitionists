import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import DonateButton from '@/components/DonateButton';
import { orgInfo } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Donate',
  description: 'Donate to Garden State Abolitionists. 100% of your gift funds education, legislative advocacy, and outreach across the state — no processing fees, secure via Zeffy.',
  alternates: { canonical: '/donate' },
};

// Set NEXT_PUBLIC_ZEFFY_URL to the organization's own Zeffy donation-form
// URL. The slug is NOT derivable from the org name — it is assigned when the
// form is created — so this is read from the environment rather than guessed.
// Empty means the donate CTAs render as a "coming soon" notice instead of
// linking somewhere broken.
const ZEFFY_URL = process.env.NEXT_PUBLIC_ZEFFY_URL || '';

export default function DonatePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Support the</span>{' '}
            <span className="font-black">CAUSE</span>
          </h1>
          <div className="w-12 h-[3px] bg-green-700 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">Support the abolition of abortion in New Jersey</p>
        </div>
      </section>

      {/* Donation Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Your Support Makes a Difference</h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Every dollar you give helps us advocate for the preborn, educate the public, and work toward the abolition of abortion in New Jersey.
            </p>
          </div>

          {/* How Donations Are Used */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Education & Outreach</h3>
              <p className="text-gray-600">
                Producing materials, hosting events, and spreading the message of abolition throughout New Jersey.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Legislative Action</h3>
              <p className="text-gray-600">
                Supporting abolition bills and engaging with elected officials to end abortion in our state.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Church Equipping</h3>
              <p className="text-gray-600">
                Providing resources to help churches speak up for the preborn and mobilize their congregations.
              </p>
            </div>
          </div>

          {/* Donation Options */}
          <div className="max-w-2xl mx-auto">
            {/* Main Donation Box */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-700 p-8 rounded-lg text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Make a Donation</h3>
              <p className="text-gray-700 mb-6">
                Your generous gift helps us continue the fight for the abolition of abortion. 100% of donations go directly to our mission.
              </p>

              {/* Main Donate Button */}
              <DonateButton
                href={ZEFFY_URL}
                variant="primary"
                label="DONATE NOW"
                source="main_button"
                className="block w-full px-8 py-4 bg-green-700 text-white font-bold text-lg hover:bg-green-800 transition-colors rounded"
              />

              <p className="text-sm text-gray-500 mt-4">
                Secure payment processing via Zeffy - 100% goes to our mission
              </p>
            </div>

            {/* Recurring Donation */}
            <div className="bg-[#1a1a1a] text-white p-8 rounded-lg text-center mb-8">
              <h3 className="text-xl font-bold mb-3">Become a Monthly Partner</h3>
              <p className="text-gray-300 mb-6">
                Join our team of monthly supporters and provide sustained support for the abolition movement. Select &quot;Monthly&quot; on the donation form. Cancel anytime.
              </p>
              <DonateButton
                href={ZEFFY_URL}
                variant="secondary"
                label="GIVE MONTHLY"
                source="monthly_partner"
                className="inline-block px-8 py-3 bg-white text-[#1a1a1a] font-bold hover:bg-gray-200 transition-colors rounded"
              />
            </div>

            {/* Alternative Methods */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-4 text-center">Other Ways to Give</h4>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Rendered only when a real mailing address is configured.
                    Never hardcode one here: this block directs donors where to
                    send money, so a stale or inherited address sends funds to
                    the wrong organization. */}
                {orgInfo.mailingAddress.street && (
                  <div>
                    <h5 className="font-semibold mb-2">Mail a Check</h5>
                    <p className="text-sm text-gray-600">
                      Make checks payable to:<br />
                      <strong>{orgInfo.legalName}</strong><br />
                      {orgInfo.mailingAddress.street}<br />
                      {orgInfo.mailingAddress.city}, {orgInfo.mailingAddress.state}{' '}
                      {orgInfo.mailingAddress.postalCode}
                    </p>
                  </div>
                )}
                <div>
                  <h5 className="font-semibold mb-2">Other Options</h5>
                  <p className="text-sm text-gray-600">
                    For stock donations, corporate matching, or other giving options, please{' '}
                    <Link href="/contact" className="text-green-800 underline hover:no-underline">
                      contact us
                    </Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust & Transparency */}
          <div className="mt-12 text-center">
            <div className="flex justify-center items-stretch gap-4 sm:gap-8 mb-6 max-w-sm mx-auto">
              <div className="flex-1 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Secure</p>
              </div>
              <div className="flex-1 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Transparent</p>
              </div>
              <div className="flex-1 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Tax-Deductible</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Have questions about donating?{' '}
              <Link href="/contact" className="text-green-800 underline hover:no-underline">
                Contact us
              </Link>.
            </p>
            <p className="text-sm text-gray-500 mb-3">
              {orgInfo.legalName} is committed to financial transparency and faithful stewardship of all donations received.
            </p>
            <p className="text-sm text-gray-500">
              {orgInfo.taxStatus ? (
                <>
                  {orgInfo.legalName} is a New Jersey {orgInfo.taxStatus}
                  {orgInfo.ein && (
                    <> &middot; Federal Tax ID (EIN): <span className="font-mono">{orgInfo.ein}</span></>
                  )}
                  . Contributions are tax-deductible to the fullest extent allowed by law.{' '}
                </>
              ) : null}
              <Link href="/financial-transparency" className="text-green-800 underline hover:no-underline">
                Full financial transparency
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner
        title="SEEK JUSTICE"
        subtitle="Your support helps us fight for the preborn"
        buttonText="SIGN THE PETITION"
        buttonLink="/the-petition"
      />
    </>
  );
}
