import { stanceBadgeClass, stanceLabel, type Stance } from '@/lib/data/legislators';

const STANCE_BLURB: Record<Stance, string> = {
  'Incrementalist (Pro-Life)':
    'Public record consistent with restricting or opposing abortion access.',
  'Pro-Choice': 'Public record consistent with supporting abortion access.',
  Unknown: 'Insufficient public record to classify.',
};

export default function StanceBadge({ stance, className = '' }: { stance: Stance; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide ${stanceBadgeClass(stance)} ${className}`}
      title={STANCE_BLURB[stance]}
    >
      {stanceLabel(stance)}
    </span>
  );
}
