import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Garden State Abolitionists collects, uses, and protects your personal data — including petition signatures, contact inquiries, and email subscriptions.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Privacy</span>{' '}
            <span className="font-black">POLICY</span>
          </h1>
          <div className="w-12 h-[3px] bg-green-700 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">Last Updated: February 2026</p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 prose prose-lg max-w-none prose-headings:text-[#1a1a1a]">

          <h2>Information We Collect</h2>
          <p>
            When you sign our petition, we collect your name, email address, city, state, and zip code.
            When you submit a contact inquiry, we collect your name, email address, and message content.
          </p>
          <p>
            We also automatically collect your IP address for rate limiting and security purposes.
            IP addresses are not stored permanently and are only used to prevent abuse of our forms.
          </p>

          <h2>How We Use Your Information</h2>
          <p>Your petition signature data is used to:</p>
          <ul>
            <li>Record your support for the abolition of abortion in New Jersey</li>
            <li>Display an aggregate signature count on our website (individual names are not publicly displayed)</li>
            <li>Send you updates about our mission, only if you opted in to email communications</li>
          </ul>
          <p>
            Contact inquiry data is used solely to respond to your message. A copy of your inquiry is sent
            to our team for review and response.
          </p>

          <h2>Data Storage &amp; Security</h2>
          <p>
            Your data is stored securely in an encrypted database hosted by a trusted cloud provider.
            We use industry-standard security measures including encrypted connections (HTTPS),
            parameterized database queries to prevent injection attacks, input sanitization,
            and server-side rate limiting to protect your information from unauthorized access.
          </p>

          <h2>Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li><strong>Vercel</strong> &mdash; website hosting, deployment, and content delivery. We also use Vercel Web Analytics, which collects anonymized page-view and usage data without setting any cookies or storing any personally identifiable information.</li>
            <li><strong>Neon</strong> &mdash; secure database hosting</li>
            <li><strong>Upstash</strong> &mdash; rate-limiting service (uses your IP address transiently to prevent form abuse; not stored beyond the rate-limit window)</li>
            <li><strong>Zeffy</strong> &mdash; donation processing (when you choose to donate, you are directed to Zeffy&apos;s platform which has its own privacy policy)</li>
          </ul>
          <p>
            We do not sell, rent, or share your personal information with any third parties for
            marketing purposes.
          </p>

          <h2>Cookies</h2>
          <p>
            We use essential cookies for authentication and security purposes only. These cookies
            are used to maintain admin login sessions and are not used for tracking, advertising,
            or any other purpose. We do not use third-party tracking cookies or analytics cookies
            that collect personal data.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Request a copy of the personal data we hold about you</li>
            <li>Request correction of inaccurate personal data</li>
            <li>Request deletion of your personal data</li>
            <li>Opt out of any email communications at any time</li>
          </ul>
          <p>
            To request data deletion, please visit our{' '}
            <Link href="/delete-my-data" className="text-green-700 no-underline hover:underline">
              data deletion request page
            </Link>
            . For all other requests, please{' '}
            <Link href="/contact" className="text-green-700 no-underline hover:underline">
              contact us
            </Link>
            . We will respond within 30 days.
          </p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Our website is not directed at children under the age of 13, and we do not knowingly
            collect personal information from children. If you believe a child has submitted
            personal information to us, please contact us so we can delete it.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Any changes will be posted on this
            page with an updated revision date. We encourage you to review this page periodically.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about this privacy policy or how we handle your data, please{' '}
            <Link href="/contact" className="text-green-700 no-underline hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}
