import mfcData from '@/data/mi-freedom-caucus.json';
import type { Legislator } from '@/lib/data/legislators';

interface Member {
  chamber: string;
  district: number;
  role: string;
  name: string;
}

const MFC: { url: string; members: Member[] } = mfcData;

/**
 * Michigan Freedom Caucus membership badge. Renders inline on legislator
 * profile pages for members only, with their MFC role (Chairman, Member,
 * etc.) and a link out to freedomcaucusmi.com.
 *
 * Match is done on (chamber, district) so nickname mismatches (Jim vs
 * James DeSana) don't break the linkage.
 */
export default function FreedomCaucusBadge({ legislator }: { legislator: Legislator }) {
  const member = MFC.members.find(
    (m) => m.chamber === legislator.chamber && m.district === legislator.district,
  );
  if (!member) return null;

  const roleSuffix = member.role === 'Member' ? '' : ` — ${member.role}`;

  return (
    <a
      href={MFC.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-900 text-white hover:bg-blue-950 transition-colors"
      title="View the Michigan Freedom Caucus website"
    >
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      Michigan Freedom Caucus{roleSuffix}
    </a>
  );
}
