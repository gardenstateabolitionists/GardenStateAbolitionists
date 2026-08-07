import EmailTemplate from './EmailTemplate';
import type { Legislator } from '@/lib/data/legislators';

/**
 * Contact card shown near the top of every legislator profile page.
 * Renders whichever contact fields are populated; hides silently otherwise.
 */
export default function ContactBlock({ legislator }: { legislator: Legislator }) {
  const {
    email,
    capitol_phone,
    capitol_office_address,
    district_phone,
    district_office_address,
    twitter_handle,
    facebook_url,
    official_website,
  } = legislator;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Contact</h2>
      <dl className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
        {email && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Email</dt>
            <dd>
              <a
                href={`mailto:${email}`}
                className="text-red-700 underline break-words hover:no-underline"
              >
                {email}
              </a>
            </dd>
          </div>
        )}
        {capitol_phone && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
              Capitol Phone
            </dt>
            <dd>
              <a
                href={`tel:+1${capitol_phone.replace(/\D/g, '')}`}
                className="text-red-700 underline hover:no-underline"
              >
                {capitol_phone}
              </a>
            </dd>
          </div>
        )}
        {district_phone && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
              District Phone
            </dt>
            <dd>
              <a
                href={`tel:+1${district_phone.replace(/\D/g, '')}`}
                className="text-red-700 underline hover:no-underline"
              >
                {district_phone}
              </a>
            </dd>
          </div>
        )}
        {official_website && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
              Official Website
            </dt>
            <dd>
              <a
                href={official_website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 underline break-all hover:no-underline"
              >
                {official_website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            </dd>
          </div>
        )}
        {twitter_handle && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">X / Twitter</dt>
            <dd>
              <a
                href={`https://x.com/${twitter_handle.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 underline hover:no-underline"
              >
                {twitter_handle}
              </a>
            </dd>
          </div>
        )}
        {facebook_url && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Facebook</dt>
            <dd>
              <a
                href={facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 underline break-all hover:no-underline"
              >
                {facebook_url.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </dd>
          </div>
        )}
        {capitol_office_address && (
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
              Capitol Office
            </dt>
            <dd className="text-gray-700">{capitol_office_address}</dd>
          </div>
        )}
        {district_office_address && (
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
              District Office
            </dt>
            <dd className="text-gray-700">{district_office_address}</dd>
          </div>
        )}
      </dl>

      {email && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <EmailTemplate email={email} legislatorName={legislator.name} />
        </div>
      )}
    </div>
  );
}
