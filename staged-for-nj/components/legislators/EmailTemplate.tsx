'use client';

import { useState } from 'react';

/**
 * Renders the pre-drafted abolition email on the page with a copy-to-
 * clipboard button. The mailto: fallback pre-fills what it can, but
 * many email clients (Outlook, iOS Mail, Windows Mail app) silently
 * strip newlines from mailto: bodies regardless of encoding — so the
 * on-page copy path is the reliable one for anyone whose client is
 * one of the strict ones.
 */
export default function EmailTemplate({
  email,
  legislatorName,
}: {
  email: string;
  legislatorName: string;
}) {
  const [copied, setCopied] = useState(false);

  const subject = 'Abolition of abortion in Michigan';
  const body = [
    `Dear ${legislatorName},`,
    '',
    "I'm writing as a Michigan constituent to urge you to support the abolition of abortion in our state. Abortion ends the life of a human being made in the image of God, and equal protection of the law demands its abolition.",
    '',
    'Specifically, I ask you to:',
    '',
    '  - Support any bill that establishes equal legal protection for the preborn from the moment of fertilization',
    '  - Oppose incremental measures that concede that some abortions may lawfully occur',
    '  - Speak publicly against abortion as the injustice it is',
    '',
    'Abolition — not regulation or reduction — is the just response to the killing of the preborn.',
    '',
    'Thank you for your time and consideration.',
    '',
    'Sincerely,',
    '[Your name]',
    '[Your city, ZIP]',
  ].join('\n');

  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body.replace(/\n/g, '\r\n'),
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Older browser without clipboard API — no-op; the textarea below
      // is selectable so the user can copy manually.
    }
  };

  const firstName = legislatorName.split(' ')[0];

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <a
          href={mailto}
          className="inline-block bg-red-600 text-white font-bold px-5 py-3 rounded hover:bg-red-700 transition-colors"
        >
          Email {firstName} about abolition
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 font-semibold px-5 py-3 rounded border border-gray-300 hover:bg-gray-200 transition-colors"
          aria-live="polite"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>Copy message</>
          )}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Opens your email client with a starter message. If the spacing looks wrong in your email
        app (some clients strip line breaks), use <strong>Copy message</strong> and paste it into a
        fresh email. Personalize before sending — a personal note carries more weight than a form
        email.
      </p>

      <details className="mt-4">
        <summary className="text-sm text-red-700 underline cursor-pointer select-none">
          Preview / edit the message
        </summary>
        <textarea
          readOnly
          rows={17}
          className="w-full mt-3 p-3 border border-gray-300 rounded font-mono text-xs text-gray-800 bg-gray-50 leading-relaxed"
          value={body}
          aria-label="Pre-drafted email message"
        />
      </details>
    </div>
  );
}
