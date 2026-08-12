'use client';

import { useState } from 'react';
import type { Legislator } from '@/lib/data/legislators';

/**
 * A prewritten, editable letter with copy and mailto actions.
 *
 * The text differs depending on whether the member has a record on the Freedom
 * of Reproductive Choice Act. Writing to someone about a vote they never cast
 * is the fastest way to be dismissed, so members elected after January 2022 get
 * a letter that asks their position instead of assuming one.
 */
export default function ContactLetter({ legislator }: { legislator: Legislator }) {
  const role = legislator.chamber === 'Senate' ? 'Senator' : 'Assemblyman/Assemblywoman';
  const surname = legislator.name.split(' ').slice(-1)[0];

  const opening =
    legislator.frcaVote === 'Yes'
      ? `I am writing as a constituent in Legislative District ${legislator.district}. In January 2022 you voted for the Freedom of Reproductive Choice Act, which wrote abortion access into New Jersey statute. I am asking you to reconsider that position.`
      : legislator.frcaVote === 'No'
        ? `I am writing as a constituent in Legislative District ${legislator.district}. In January 2022 you voted against the Freedom of Reproductive Choice Act. Thank you. I am writing to ask you to go further.`
        : `I am writing as a constituent in Legislative District ${legislator.district}. You were not yet serving when the Freedom of Reproductive Choice Act passed in January 2022, so I am writing to ask plainly where you stand.`;

  const [body, setBody] = useState(
    `Dear ${role} ${surname},

${opening}

I believe every human being is a person from the moment of fertilization, and that the law should say so. New Jersey currently gives the preborn no protection at all under its homicide statutes. I am asking you to support equal protection for preborn children — the same protection the law already gives every one of us.

I would like to know your position, and I would welcome a reply.

Sincerely,
[Your name]
[Your town, NJ]`
  );

  const [copied, setCopied] = useState(false);
  const subject = `Equal protection for preborn children — a constituent from District ${legislator.district}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const mailto = legislator.email
    ? `mailto:${legislator.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    : null;

  return (
    <div>
      <p className="text-gray-700 mb-3 text-sm">
        Edit this however you like — a letter in your own words carries more weight than a
        form message.
      </p>
      <label htmlFor="letter" className="sr-only">
        Your letter
      </label>
      <textarea
        id="letter"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={14}
        className="w-full px-4 py-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      <div className="flex flex-wrap gap-3 mt-3">
        {mailto && (
          <a
            href={mailto}
            className="inline-block px-6 py-3 bg-green-700 text-white font-bold text-sm hover:bg-green-800 transition-colors no-underline"
          >
            Open in email
          </a>
        )}
        <button
          type="button"
          onClick={copy}
          className="px-6 py-3 border-2 border-green-700 text-green-800 font-bold text-sm hover:bg-green-50 transition-colors"
        >
          {copied ? 'Copied' : 'Copy letter'}
        </button>
        {legislator.districtPhone && (
          <a
            href={`tel:${legislator.districtPhone.replace(/[^\d]/g, '')}`}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors no-underline"
          >
            Call {legislator.districtPhone}
          </a>
        )}
      </div>
    </div>
  );
}
