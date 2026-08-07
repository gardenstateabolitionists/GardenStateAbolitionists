'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PinDialog } from '@/components/ui/pin-dialog';
import { Send, Users, AlertCircle, CheckCircle2, Bold, Italic, Link, Heading2, Pilcrow, List, ListOrdered, CornerDownLeft, Eye, PenLine, ImageIcon } from 'lucide-react';
import { sendBroadcast } from '@/lib/actions/email-actions';
import { getDashboardStats } from '@/lib/actions/dashboard-actions';
import { sanitizeHtml } from '@/lib/sanitize';

function insertTag(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  body: string,
  setBody: (v: string) => void
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = body.substring(start, end);
  const replacement = before + (selected || 'text') + after;
  const newBody = body.substring(0, start) + replacement + body.substring(end);
  setBody(newBody);

  // Restore cursor position after React re-render
  requestAnimationFrame(() => {
    textarea.focus();
    const cursorPos = selected
      ? start + replacement.length
      : start + before.length + 4; // position after "text"
    textarea.setSelectionRange(cursorPos, cursorPos);
  });
}

export default function EmailBroadcastPage() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent?: number; failed?: number; error?: string } | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'compose' | 'preview'>('compose');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getDashboardStats().then((stats) => {
      if (!('error' in stats)) {
        setSubscriberCount(stats.totalSubscribers);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setShowConfirm(true);
  };

  const handleConfirmSend = async () => {
    setSending(true);
    setResult(null);

    try {
      const res = await sendBroadcast({ subject: subject.trim(), body: body.trim() });

      if ('error' in res) {
        setResult({ error: res.error });
      } else {
        setResult({ sent: res.sent, failed: res.failed });
        if (res.failed === 0) {
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

  const handleToolbar = (action: string) => {
    const ta = textareaRef.current;
    if (!ta) return;

    switch (action) {
      case 'bold':
        insertTag(ta, '<strong>', '</strong>', body, setBody);
        break;
      case 'italic':
        insertTag(ta, '<em>', '</em>', body, setBody);
        break;
      case 'heading':
        insertTag(ta, '<h2>', '</h2>', body, setBody);
        break;
      case 'paragraph':
        insertTag(ta, '<p>', '</p>', body, setBody);
        break;
      case 'ul':
        insertTag(ta, '<ul>\n  <li>', '</li>\n</ul>', body, setBody);
        break;
      case 'ol':
        insertTag(ta, '<ol>\n  <li>', '</li>\n</ol>', body, setBody);
        break;
      case 'br':
        insertTag(ta, '<br>', '', body, setBody);
        break;
      case 'link': {
        const url = window.prompt('Enter URL:');
        if (url) {
          try {
            const parsed = new URL(url);
            if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
              const safeUrl = url.replace(/"/g, '&quot;');
              insertTag(ta, `<a href="${safeUrl}">`, '</a>', body, setBody);
            } else {
              alert('Only http and https URLs are allowed.');
            }
          } catch {
            alert('Please enter a valid URL (e.g. https://example.com).');
          }
        }
        break;
      }
      case 'image': {
        const imgUrl = window.prompt('Enter image URL:');
        if (imgUrl) {
          try {
            const parsed = new URL(imgUrl);
            if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
              const alt = window.prompt('Enter alt text (description of image):', '') || '';
              const width = window.prompt('Enter width in pixels (optional, e.g. 600):', '');
              const safeUrl = imgUrl.replace(/"/g, '&quot;');
              const safeAlt = alt.replace(/"/g, '&quot;');
              const widthAttr = width && /^\d+$/.test(width) ? ` width="${width}"` : '';
              insertTag(ta, `<img src="${safeUrl}" alt="${safeAlt}"${widthAttr} style="max-width:100%;height:auto;" />`, '', body, setBody);
            } else {
              alert('Only http and https URLs are allowed.');
            }
          } catch {
            alert('Please enter a valid image URL (e.g. https://example.com/photo.jpg).');
          }
        }
        break;
      }
    }
  };

  const toolbarButtons = [
    { action: 'bold', icon: Bold, label: 'Bold' },
    { action: 'italic', icon: Italic, label: 'Italic' },
    { action: 'link', icon: Link, label: 'Link' },
    { action: 'image', icon: ImageIcon, label: 'Image' },
    { action: 'heading', icon: Heading2, label: 'Heading' },
    { action: 'paragraph', icon: Pilcrow, label: 'Paragraph' },
    { action: 'ul', icon: List, label: 'Bullet List' },
    { action: 'ol', icon: ListOrdered, label: 'Ordered List' },
    { action: 'br', icon: CornerDownLeft, label: 'Line Break' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Email Broadcast</h1>
          <p className="text-gray-500 mt-1">Send a message to all newsletter subscribers</p>
        </div>
        {subscriberCount !== null && (
          <div className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-lg">
            <Users size={18} />
            <span className="font-semibold">{subscriberCount}</span>
            <span className="text-sm hidden sm:inline">subscriber{subscriberCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {result && (
        <div
          className={`rounded-lg p-4 flex items-start gap-3 ${
            result.error
              ? 'bg-green-50 border border-green-200 text-green-800'
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
                <p className="font-semibold">Broadcast sent successfully!</p>
                <p className="text-sm mt-1">
                  {result.sent} email{result.sent !== 1 ? 's' : ''} sent
                  {result.failed ? `, ${result.failed} failed` : ''}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle>Compose Email</CardTitle>
              <CardDescription>
                This email will be sent individually to each subscriber with a personalized unsubscribe link.
              </CardDescription>
            </div>
            <div className="flex w-full sm:w-auto bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setActiveTab('compose')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'compose' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <PenLine size={14} />
                Compose
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'preview' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Eye size={14} />
                Preview
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'compose' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  maxLength={200}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">{subject.length}/200</p>
              </div>

              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                  Message Body
                </label>

                {/* Toolbar */}
                <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border border-gray-300 border-b-0 rounded-t-md">
                  {toolbarButtons.map((btn) => (
                    <button
                      key={btn.action}
                      type="button"
                      onClick={() => handleToolbar(btn.action)}
                      title={btn.label}
                      className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <btn.icon size={16} />
                    </button>
                  ))}
                </div>

                <textarea
                  ref={textareaRef}
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your message here..."
                  rows={12}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={sending || !subject.trim() || !body.trim()}
                  className="bg-green-700 hover:bg-green-800 text-white"
                >
                  {sending ? (
                    <>
                      <Send size={16} className="mr-2 animate-pulse" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Send to All Subscribers
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* Email Preview */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <p className="text-gray-900 font-medium">{subject || '(No subject)'}</p>
              </div>

              <div className="border rounded-lg overflow-hidden">
                {/* Email header */}
                <div style={{ backgroundColor: '#1a1a2e', padding: '24px 16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#d4af37', letterSpacing: '1px' }}>
                    Garden State Abolitionists
                  </span>
                </div>

                {/* Email body */}
                <div style={{ padding: '28px 32px', fontFamily: 'Georgia, serif', lineHeight: '1.6', color: '#333' }}>
                  <h1 style={{ color: '#1a1a2e', fontSize: '20px', marginTop: 0, marginBottom: '20px' }}>
                    {subject || '(No subject)'}
                  </h1>
                  <p>Hello <strong style={{ color: '#8b0000' }}>Subscriber Name</strong>,</p>
                  {body ? (
                    <div style={{ margin: '16px 0' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(body) }} />
                  ) : (
                    <p style={{ color: '#999', fontStyle: 'italic' }}>(No message body yet)</p>
                  )}
                  <p style={{ marginTop: '20px' }}>
                    In Christ,<br /><strong>Garden State Abolitionists</strong>
                  </p>
                </div>

                {/* Email footer */}
                <div style={{ backgroundColor: '#1a1a2e', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#cccccc' }}>
                  <p style={{ margin: '0 0 8px 0' }}>&copy; {new Date().getFullYear()} Garden State Abolitionists. All rights reserved.</p>
                  <p style={{ margin: 0, color: '#d4af37' }}>gardenstateabolitionists.org</p>
                </div>

                {/* Unsubscribe footer */}
                <div style={{ textAlign: 'center', padding: '12px 16px', fontSize: '11px', color: '#999' }}>
                  <p style={{ margin: 0 }}>You received this email because you subscribed at gardenstateabolitionists.org.</p>
                  <p style={{ margin: '4px 0 0 0' }}>
                    <span style={{ textDecoration: 'underline' }}>Unsubscribe</span>
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  onClick={() => setActiveTab('compose')}
                  variant="outline"
                  className="mr-2"
                >
                  Back to Compose
                </Button>
                <Button
                  type="button"
                  disabled={sending || !subject.trim() || !body.trim()}
                  onClick={() => { if (subject.trim() && body.trim()) setShowConfirm(true); }}
                  className="bg-green-700 hover:bg-green-800 text-white"
                >
                  <Send size={16} className="mr-2" />
                  Send to All Subscribers
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <PinDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirm Broadcast"
        description={`Send "${subject}" to ${subscriberCount ?? '...'} subscriber${subscriberCount !== 1 ? 's' : ''}. This action cannot be undone.`}
        onVerified={handleConfirmSend}
        loading={sending}
      />
    </div>
  );
}
