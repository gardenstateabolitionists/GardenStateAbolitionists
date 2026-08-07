'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Handshake } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PinDialog } from '@/components/ui/pin-dialog';
import { BroadcastComposer } from '@/app/admin/components/broadcast-composer';
import {
  getPartnerAudiencePreview,
  sendPartnerBroadcastAction,
} from '@/lib/actions/broadcast-actions';

interface PartnerRow { name: string; email: string; state?: string; }

export default function PartnerBroadcastPage() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<PartnerRow[]>([]);
  const [sending, setSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<{ sent?: number; failed?: number; error?: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPartnerAudiencePreview().then((r) => {
      if (cancelled) return;
      if (Array.isArray(r)) setAudience(r);
    });
    return () => { cancelled = true; };
  }, []);

  const handleSend = async () => {
    setSending(true);
    setResult(null);
    try {
      const r = await sendPartnerBroadcastAction({ subject: subject.trim(), body: body.trim() });
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

  const count = audience.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Email Partners</h1>
          <p className="text-gray-500 mt-1">Send a broadcast to allied abolitionist coalitions across the country.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg">
          <Handshake size={18} />
          <span className="font-semibold">{count}</span>
          <span className="text-sm">partner{count === 1 ? '' : 's'} with email</span>
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
                <p className="font-semibold">Broadcast sent to {result.sent} partner{result.sent === 1 ? '' : 's'}.</p>
                {result.failed ? <p className="text-sm mt-1">{result.failed} failed — see server logs.</p> : null}
              </div>
            </>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Audience</CardTitle>
          <CardDescription>
            Only partners with a contact email on file. Partners without a scraped email are listed on the public /partners page but are skipped here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {audience.length === 0 ? (
            <p className="text-sm text-gray-500">No partners have an email on file yet. Add one to <code>data/abolition-partners.json</code> to include them.</p>
          ) : (
            <ul className="text-sm divide-y divide-gray-100">
              {audience.map((a) => (
                <li
                  key={a.email}
                  className="py-2 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-3 min-w-0"
                >
                  <span className="min-w-0">
                    <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold mr-2">
                      {a.state || 'National'}
                    </span>
                    <span className="font-medium text-gray-800">{a.name}</span>
                  </span>
                  <span className="text-gray-500 font-mono text-xs break-all min-w-0">
                    {a.email}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compose</CardTitle>
          <CardDescription className="break-words">
            Sent individually with reply-to set to{' '}
            <span className="break-all">{process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'your configured contact address'}</span>.
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
            submitLabel={`Send to ${count} Partner${count === 1 ? '' : 's'}`}
            disabledReason={count === 0 ? 'No partners have an email on file.' : undefined}
            previewSignOff="For the abolition of abortion,"
          />
        </CardContent>
      </Card>

      <PinDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirm Partner Broadcast"
        description={`Send "${subject}" to ${count} allied coalition${count === 1 ? '' : 's'}. This cannot be undone.`}
        onVerified={handleSend}
        loading={sending}
      />
    </div>
  );
}
