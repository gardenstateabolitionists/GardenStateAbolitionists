'use client';

import { capture } from '@/lib/analytics';
import { fireAdsConversion } from '@/lib/google-ads';
import { withUtm } from '@/lib/utm';

interface DonateButtonProps {
  href: string;
  variant: 'primary' | 'secondary';
  label: string;
  source: 'main_button' | 'monthly_partner';
  children?: React.ReactNode;
  className?: string;
}

/**
 * Thin client wrapper around the Zeffy donate link so we can fire a PostHog
 * event before the user navigates to the external donation platform. Everything
 * else on /donate stays server-rendered.
 */
export default function DonateButton({ href, label, source, className }: DonateButtonProps) {
  // UTM-tag the Zeffy hand-off so Zeffy's own reports (and PostHog on the
  // return trip, if the user comes back) can attribute the donation to the
  // exact button they clicked.
  const tagged = withUtm(href, {
    source: 'aam_website',
    medium: 'cta',
    campaign: 'donate',
    content: source,
  });
  return (
    <a
      href={tagged}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        capture('donate_clicked', { source });
        fireAdsConversion('donate');
      }}
      className={className}
    >
      {label}
    </a>
  );
}
