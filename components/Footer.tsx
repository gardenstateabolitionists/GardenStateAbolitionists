import Link from 'next/link';
import Image from 'next/image';
import FooterNewsletter from './FooterNewsletter';
import { orgInfo, socialLinks } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* WHY? Section */}
          <div>
            <h2 className="text-lg font-bold tracking-wider mb-6">WHY?</h2>
            <blockquote className="text-gray-300 text-sm mb-6">
              <p className="italic">&ldquo;You shall love your neighbor as yourself.&rdquo;</p>
              <cite className="block text-right text-gray-300 mt-2 not-italic">-Mark 12:31</cite>
            </blockquote>
            <blockquote className="text-gray-300 text-sm">
              <p className="italic">
                &ldquo;Learn to do good; seek justice, correct oppression; bring justice to the fatherless, plead the widow&apos;s cause.&rdquo;
              </p>
              <cite className="block text-right text-gray-300 mt-2 not-italic">-Isaiah 1:17</cite>
            </blockquote>
          </div>

          {/* Center Logo Section */}
          <div className="text-center flex flex-col items-center justify-center">
            <h2 className="text-lg font-bold tracking-wider mb-6">GARDEN STATE ABOLITIONISTS</h2>
            <Image
              src="/images/gsa-logo.webp"
              alt="Garden State Abolitionists Logo"
              width={120}
              height={120}
              className=""
            />
          </div>

          {/* MISSION Section */}
          <div>
            <h2 className="text-lg font-bold tracking-wider mb-6">MISSION</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Abolitionists in New Jersey are devoted to showing mercy and establishing justice for our preborn neighbors being led to the slaughter. We seek to be used by God to bring an end to abortion in the United States and around the world, and to be used by Him to proclaim the gospel to as many people as we can, wherever we can, whenever we can. We bring the gospel into conflict with a culture that openly promotes the murder of children through means of agitation and assistance. We are committed to non-violent agitation, preaching, pleading, and information dissemination via community outreach, social media, and other means to abolish abortion.
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <FooterNewsletter />
          </div>
        </div>
      </div>

      {/* Nonprofit disclosures — required for Google Ad Grants.
          Every claim here is gated on the underlying value actually existing.
          Tax-deductibility and registered-charity status are legal
          representations: they must never render from a partially-filled
          orgInfo, so a missing field hides the sentence rather than printing
          an empty gap. */}
      {(orgInfo.taxStatus || orgInfo.ein || orgInfo.mailingAddress.street) && (
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="text-center text-sm text-gray-300">
              {orgInfo.taxStatus && (
                <p className="font-semibold mb-2">
                  {orgInfo.legalName} is a {orgInfo.taxStatus} registered in{' '}
                  {orgInfo.registeredState}.
                </p>
              )}
              {orgInfo.ein && (
                <p className="mb-2">
                  Federal Tax ID (EIN): <span className="font-mono">{orgInfo.ein}</span>
                </p>
              )}
              {orgInfo.taxStatus && (
                <p className="mb-2">
                  Contributions are tax-deductible to the fullest extent allowed by law.{' '}
                  <Link href="/financial-transparency" className="text-green-500 hover:text-green-400 underline">
                    See our financial disclosures
                  </Link>
                </p>
              )}
              {orgInfo.mailingAddress.street && (
                <p className="mb-4 text-gray-300">
                  Mailing address: {orgInfo.mailingAddress.street}, {orgInfo.mailingAddress.city},{' '}
                  {orgInfo.mailingAddress.state} {orgInfo.mailingAddress.postalCode}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-300 mb-2">
              &copy; {new Date().getFullYear()} {orgInfo.legalName}. All Rights Reserved.
            </p>
            <p className="text-sm text-gray-300 mb-4">
              Credit to{' '}
              <Link
                href="https://www.abolishabortionmichigan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-400 underline transition-colors"
              >
                Abolish Abortion Michigan
              </Link>{' '}
              for allowing us to derive their work onto this website.
            </p>
            <p className="text-sm text-gray-300 mb-6">
              <Link href="/who-we-are" className="text-green-500 hover:text-green-400 transition-colors">
                About
              </Link>
              {' '}&bull;{' '}
              <Link href="/partners" className="text-green-500 hover:text-green-400 transition-colors">
                Allied Groups
              </Link>
              {' '}&bull;{' '}
              <Link href="/financial-transparency" className="text-green-500 hover:text-green-400 transition-colors">
                Financial Transparency
              </Link>
              {' '}&bull;{' '}
              <Link href="/non-violence-statement" className="text-green-500 hover:text-green-400 transition-colors">
                Non-Violence Statement
              </Link>
              {' '}&bull;{' '}
              <Link href="/privacy-policy" className="text-green-500 hover:text-green-400 transition-colors">
                Privacy Policy
              </Link>
              {' '}&bull;{' '}
              <Link href="/delete-my-data" className="text-green-500 hover:text-green-400 transition-colors">
                Delete My Data
              </Link>
            </p>

            {/* Social Icons — each is gated on the URL existing so an
                unconfigured profile is omitted rather than rendering a link
                to the current page (href=""). */}
            <div className="flex justify-center space-x-4">
              {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              )}
              {socialLinks.x && (
              <a
                href={socialLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              )}
              {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              )}
              {socialLinks.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
