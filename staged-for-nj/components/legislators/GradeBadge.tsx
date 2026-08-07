import { gradeBadgeClass, type Grade } from '@/lib/data/legislators';

const GRADE_BLURB: Record<Grade, string> = {
  Pass: 'Has publicly sponsored a true equal-protection abolition bill and has NOT hedged with incrementalist compromises.',
  Fail: 'Has not met the abolition standard — either supports abortion access, supports only incremental restrictions, or has no public record.',
};

export default function GradeBadge({ grade, className = '' }: { grade: Grade; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-base font-bold uppercase tracking-wider ${gradeBadgeClass(grade)} ${className}`}
      title={GRADE_BLURB[grade]}
    >
      {grade}
    </span>
  );
}
