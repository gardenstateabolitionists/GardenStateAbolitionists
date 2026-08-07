import type { Legislator, VoteValue } from '@/lib/data/legislators';
import { billOfficialUrl, TRACKED_BILLS, voteGrade } from '@/lib/data/legislators';

/**
 * Six-bill voting record from the 2023-2024 MI Legislature session.
 * Each row shows: bill, description, actual vote, and — because the same
 * vote means opposite things depending on which side you're on — an
 * abolitionist-perspective annotation.
 *
 * From the AAM perspective a Nay on RHA is aligned with abolition; a Yea
 * on RHA is against abolition.
 */
export default function VotingRecord({ legislator }: { legislator: Legislator }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-3 py-2 font-semibold text-gray-700">Bill</th>
            <th className="px-3 py-2 font-semibold text-gray-700 hidden sm:table-cell">
              Description
            </th>
            <th className="px-3 py-2 font-semibold text-gray-700">Vote</th>
            <th className="px-3 py-2 font-semibold text-gray-700">Grade</th>
          </tr>
        </thead>
        <tbody>
          {TRACKED_BILLS.map((bill) => {
            const key = `vote_${bill.key}` as keyof Legislator;
            const vote = legislator[key] as VoteValue;
            const url = billOfficialUrl(bill);
            const billNo = bill.title.split(' — ')[0];
            return (
              <tr key={bill.key} className="border-t border-gray-200 align-top">
                <td className="px-3 py-3 font-semibold whitespace-nowrap">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-700 underline hover:no-underline"
                    title={`Read ${billNo} on legislature.mi.gov`}
                  >
                    {billNo}
                    <svg
                      className="inline-block w-3 h-3 ml-1 -mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M11 3a1 1 0 100 2h2.586l-7.293 7.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M4 5a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-4a1 1 0 10-2 0v4H4V7h4a1 1 0 000-2H4z" />
                    </svg>
                    <span className="sr-only">(opens in new tab)</span>
                  </a>
                </td>
                <td className="px-3 py-3 text-gray-600 hidden sm:table-cell">
                  {bill.description}
                </td>
                <td className="px-3 py-3">
                  <VoteBadge vote={vote} />
                </td>
                <td className="px-3 py-3">
                  <GradeCell grade={voteGrade(vote, bill.proChoicePosition)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-3">
        Source: Michigan Legislature roll-call PDFs. Bills that never received a floor vote (5 of
        the 10 tracked anti-abortion bills died in committee) are omitted. Click any bill number
        to read the full text on legislature.mi.gov.
      </p>
    </div>
  );
}

function VoteBadge({ vote }: { vote: VoteValue }) {
  const label = vote ?? 'No vote';
  const color =
    vote === 'Yea'
      ? 'bg-green-100 text-green-800'
      : vote === 'Nay'
        ? 'bg-red-100 text-red-800'
        : vote === 'Excused'
          ? 'bg-amber-100 text-amber-800'
          : 'bg-gray-200 text-gray-700';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${color}`}>
      {label}
    </span>
  );
}

function GradeCell({ grade }: { grade: 'Pass' | 'Fail' | null }) {
  if (grade === null) return <span className="text-gray-400">—</span>;
  const cls =
    grade === 'Pass'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${cls}`}>
      {grade}
    </span>
  );
}
