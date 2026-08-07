import type { Legislator, YesNo } from '@/lib/data/legislators';

interface Signal {
  key: keyof Legislator;
  label: string;
  interpretation: 'abolitionist' | 'incrementalist' | 'neutral';
  detail: string;
}

const SIGNALS: Signal[] = [
  {
    key: 'sponsored_current_abolition_bill',
    label: 'Sponsored 2025 HB 4670/4671 (Justice for Babies in the Womb Act)',
    interpretation: 'abolitionist',
    detail:
      'The only true equal-protection abolition bill introduced in the current MI Legislature. Applies homicide law to the unborn from fertilization.',
  },
  {
    key: 'sponsored_HB4683',
    label: 'Sponsored 2023 HB 4683 (Felony for providing abortion)',
    interpretation: 'abolitionist',
    detail:
      'Provider-only felony for performing abortion. Closer to abolitionist framing than viability bans, but stops short of equal-protection standard.',
  },
  {
    key: 'sponsored_HB6270_total_ban',
    label: 'Sponsored 2022 HB 6270 (Total abortion ban)',
    interpretation: 'abolitionist',
    detail:
      'Total ban with life-of-mother exception. Explicitly exempts the pregnant woman from prosecution.',
  },
  {
    key: 'sponsored_HB4684_86',
    label: 'Sponsored 2023 HB 4684/4685/4686 (Publication + advertising ban package)',
    interpretation: 'abolitionist',
    detail: 'Companion package to HB 4683 restricting sale and advertisement of abortion methods.',
  },
  {
    key: 'sponsored_heartbeat_ban',
    label: 'Sponsored a fetal heartbeat ban',
    interpretation: 'incrementalist',
    detail:
      'Bans abortion after ~6 weeks; permits abortion prior to detectable heartbeat. Incrementalist tell.',
  },
  {
    key: 'sponsored_viability_ban',
    label: 'Sponsored a fetal viability ban',
    interpretation: 'incrementalist',
    detail:
      'Bans abortion after roughly 22-24 weeks; permits abortion pre-viability. Incrementalist tell.',
  },
  {
    key: 'sponsored_HB4652',
    label: 'Sponsored 2023 HB 4652 (Tax credits for pregnancy centers)',
    interpretation: 'incrementalist',
    detail:
      'Provides state tax credits for donations to pregnancy resource centers. A definitive incrementalist tell — abolitionists reject "provide alternatives" as compromising with murder rather than criminalizing it.',
  },
  {
    key: 'sponsored_prc_funding',
    label: 'Sponsored a pregnancy resource center funding bill',
    interpretation: 'incrementalist',
    detail: 'Directs state funds to organizations that provide alternatives to abortion.',
  },
];

export default function SponsorshipSignals({ legislator }: { legislator: Legislator }) {
  const flagged = SIGNALS.filter((s) => legislator[s.key] === 'Yes');
  if (flagged.length === 0) {
    return (
      <p className="text-sm text-gray-600 italic">
        No sponsorship signals of the abortion-specific bills tracked here.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {flagged.map((s) => (
        <li key={s.key} className="border-l-4 pl-3" style={{ borderColor: colorFor(s.interpretation) }}>
          <p className="font-semibold text-gray-900">{s.label}</p>
          <p className="text-sm text-gray-600">{s.detail}</p>
        </li>
      ))}
    </ul>
  );
}

function colorFor(kind: Signal['interpretation']): string {
  if (kind === 'abolitionist') return '#dc2626';
  if (kind === 'incrementalist') return '#f97316';
  return '#9ca3af';
}
