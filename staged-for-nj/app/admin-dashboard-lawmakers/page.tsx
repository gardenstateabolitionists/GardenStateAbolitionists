'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Landmark } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PinDialog } from '@/components/ui/pin-dialog';
import { BroadcastComposer } from '@/app/admin/components/broadcast-composer';
import {
  countLawmakerRecipients,
  sendLawmakerBroadcastAction,
  type LawmakerFilter,
} from '@/lib/actions/broadcast-actions';

type ChamberOpt = LawmakerFilter['chamber'];
type PartyOpt = LawmakerFilter['party'];
type GradeOpt = LawmakerFilter['grade'];

export default function LawmakerBroadcastPage() {
  const [chamber, setChamber] = useState<ChamberOpt>('All');
  const [party, setParty] = useState<PartyOpt>('All');
  const [gradeFilter, setGradeFilter] = useState<GradeOpt>('All');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [count, setCount] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<{ sent?: number; failed?: number; error?: string } | null>(null);

  const filter = useMemo<LawmakerFilter>(
    () => ({ chamber, party, grade: gradeFilter }),
    [chamber, party, gradeFilter],
  );

  useEffect(() => {
    let cancelled = false;
    countLawmakerRecipients(filter).then((r) => {
      if (cancelled) return;
      if (typeof r === 'number') setCount(r);
      else setCount(0);
    });
    return () => { cancelled = true; };
  }, [filter]);

  const handleSend = async () => {
    setSending(true);
    setResult(null);
    try {
      const r = await sendLawmakerBroadcastAction({ subject: subject.trim(), body: body.trim(), filter });
      if ('error' in r) setResult({ error: r.error });
      else {
        setResult({ sent: r.sent, failed: r.failed });
        if (r.failed === 0) {
          setSubject('');
          setBody('');
        }
      }
    } catch {
      setResult({ error: 'An unexpected error occurred' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Email Lawmakers</h1>
          <p className="text-gray-500 mt-1">Send a broadcast to Michigan state legislators.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
          <Landmark size={18} />
          <span className="font-semibold">{count ?? '…'}</span>
          <span className="text-sm">recipient{count === 1 ? '' : 's'}</span>
        </div>
      </div>

      {result && (
        <div
          className={`rounded-lg p-4 flex items-start gap-3 ${
            result.error
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}
        >
          {result.error ? (
            <>
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <p>{result.error}</p>
            </>
          ) : (
            <>
              <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Broadcast sent to {result.sent} lawmaker{result.sent === 1 ? '' : 's'}.</p>
                {result.failed ? <p className="text-sm mt-1">{result.failed} failed — see server logs.</p> : null}
              </div>
            </>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Filter recipients</CardTitle>
          <CardDescription>
            Only lawmakers with a public email on file are included. Contact info is scraped from the Michigan Legislature website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FilterSelect label="Chamber" value={chamber} onChange={(v) => setChamber(v as ChamberOpt)} options={['All', 'House', 'Senate']} />
            <FilterSelect label="Party" value={party} onChange={(v) => setParty(v as PartyOpt)} options={['All', 'R', 'D']} />
            <FilterSelect label="Grade" value={gradeFilter} onChange={(v) => setGradeFilter(v as GradeOpt)} options={['All', 'Pass', 'Fail']} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compose</CardTitle>
          <CardDescription className="break-words">
            The email is sent individually to each recipient. Reply-to is set to{' '}
            <span className="break-all">admin@abolishabortionmichigan.com</span>{' '}
            so responses go straight to your inbox.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BroadcastComposer
            subject={subject}
            body={body}
            onSubjectChange={setSubject}
            onBodyChange={setBody}
            onSubmit={() => setShowConfirm(true)}
            sending={sending}
            submitLabel={`Send to ${count ?? 0} Lawmaker${count === 1 ? '' : 's'}`}
            disabledReason={count === 0 ? 'No recipients match these filters.' : undefined}
            previewSignOff="In service to justice,"
          />
        </CardContent>
      </Card>

      <PinDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirm Lawmaker Broadcast"
        description={`Send "${subject}" to ${count ?? '?'} Michigan legislator${count === 1 ? '' : 's'}. This cannot be undone.`}
        onVerified={handleSend}
        loading={sending}
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
