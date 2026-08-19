'use client';

/**
 * Reusable compose+preview surface for the three broadcast tools.
 * The subscriber tool (Email Subscribers) keeps its own component
 * for backwards compat; Lawmakers + Partners share this one.
 *
 * Renders: subject, HTML toolbar, textarea, tabbed preview, submit.
 * Owns the toolbar behavior and preview markup only — persistence,
 * confirmation dialog, and audience counting stay in the parent
 * page (they differ between broadcast types).
 */

import { useRef, useState } from 'react';
import {
  Bold, CornerDownLeft, Eye, Heading2, ImageIcon, Italic, Link as LinkIcon,
  List, ListOrdered, PenLine, Pilcrow, Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sanitizeHtml } from '@/lib/sanitize';

function insertTag(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  body: string,
  setBody: (v: string) => void,
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = body.substring(start, end);
  const replacement = before + (selected || 'text') + after;
  const newBody = body.substring(0, start) + replacement + body.substring(end);
  setBody(newBody);
  requestAnimationFrame(() => {
    textarea.focus();
    const cursorPos = selected ? start + replacement.length : start + before.length + 4;
    textarea.setSelectionRange(cursorPos, cursorPos);
  });
}

export interface BroadcastComposerProps {
  subject: string;
  body: string;
  onSubjectChange: (v: string) => void;
  onBodyChange: (v: string) => void;
  onSubmit: () => void;
  sending: boolean;
  submitLabel: string;
  disabledReason?: string;
  previewSignOff?: string;
}

export function BroadcastComposer({
  subject,
  body,
  onSubjectChange,
  onBodyChange,
  onSubmit,
  sending,
  submitLabel,
  disabledReason,
  previewSignOff = 'In service to justice,',
}: BroadcastComposerProps) {
  const [tab, setTab] = useState<'compose' | 'preview'>('compose');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const disabled = sending || !subject.trim() || !body.trim() || Boolean(disabledReason);

  const handleToolbar = (action: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    switch (action) {
      case 'bold': insertTag(ta, '<strong>', '</strong>', body, onBodyChange); break;
      case 'italic': insertTag(ta, '<em>', '</em>', body, onBodyChange); break;
      case 'heading': insertTag(ta, '<h2>', '</h2>', body, onBodyChange); break;
      case 'paragraph': insertTag(ta, '<p>', '</p>', body, onBodyChange); break;
      case 'ul': insertTag(ta, '<ul>\n  <li>', '</li>\n</ul>', body, onBodyChange); break;
      case 'ol': insertTag(ta, '<ol>\n  <li>', '</li>\n</ol>', body, onBodyChange); break;
      case 'br': insertTag(ta, '<br>', '', body, onBodyChange); break;
      case 'link': {
        const url = window.prompt('Enter URL:');
        if (!url) return;
        try {
          const parsed = new URL(url);
          if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            const safeUrl = url.replace(/"/g, '&quot;');
            insertTag(ta, `<a href="${safeUrl}">`, '</a>', body, onBodyChange);
          } else {
            alert('Only http and https URLs are allowed.');
          }
        } catch {
          alert('Please enter a valid URL (e.g. https://example.com).');
        }
        break;
      }
      case 'image': {
        const imgUrl = window.prompt('Enter image URL:');
        if (!imgUrl) return;
        try {
          const parsed = new URL(imgUrl);
          if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            const alt = window.prompt('Enter alt text:', '') || '';
            const width = window.prompt('Width in pixels (optional):', '');
            const safeUrl = imgUrl.replace(/"/g, '&quot;');
            const safeAlt = alt.replace(/"/g, '&quot;');
            const widthAttr = width && /^\d+$/.test(width) ? ` width="${width}"` : '';
            insertTag(
              ta,
              `<img src="${safeUrl}" alt="${safeAlt}"${widthAttr} style="max-width:100%;height:auto;" />`,
              '',
              body,
              onBodyChange,
            );
          } else {
            alert('Only http and https URLs are allowed.');
          }
        } catch {
          alert('Please enter a valid image URL (e.g. https://example.com/photo.jpg).');
        }
        break;
      }
    }
  };

  const toolbar = [
    { action: 'bold', icon: Bold, label: 'Bold' },
    { action: 'italic', icon: Italic, label: 'Italic' },
    { action: 'link', icon: LinkIcon, label: 'Link' },
    { action: 'image', icon: ImageIcon, label: 'Image' },
    { action: 'heading', icon: Heading2, label: 'Heading' },
    { action: 'paragraph', icon: Pilcrow, label: 'Paragraph' },
    { action: 'ul', icon: List, label: 'Bullet List' },
    { action: 'ol', icon: ListOrdered, label: 'Ordered List' },
    { action: 'br', icon: CornerDownLeft, label: 'Line Break' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setTab('compose')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === 'compose' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <PenLine size={14} /> Compose
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === 'preview' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye size={14} /> Preview
          </button>
        </div>
      </div>

      {tab === 'compose' ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!disabled) onSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="broadcast-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              id="broadcast-subject"
              type="text"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              placeholder="Enter email subject..."
              maxLength={200}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">{subject.length}/200</p>
          </div>
          <div>
            <label htmlFor="broadcast-body" className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
            <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border border-gray-300 border-b-0 rounded-t-md">
              {toolbar.map((btn) => (
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
              id="broadcast-body"
              value={body}
              onChange={(e) => onBodyChange(e.target.value)}
              placeholder="Write your message here..."
              rows={12}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            {disabledReason && (
              <p className="text-sm text-amber-700">{disabledReason}</p>
            )}
            <Button
              type="submit"
              disabled={disabled}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              <Send size={16} className={`mr-2 ${sending ? 'animate-pulse' : ''}`} />
              {sending ? 'Sending…' : submitLabel}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <p className="text-gray-900 font-medium">{subject || '(No subject)'}</p>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <div style={{ backgroundColor: '#1a1a2e', padding: '24px 16px', textAlign: 'center' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#d4af37', letterSpacing: '1px' }}>Garden State Abolitionists</span>
            </div>
            <div style={{ padding: '28px 32px', fontFamily: 'Georgia, serif', lineHeight: 1.6, color: '#333' }}>
              <h1 style={{ color: '#1a1a2e', fontSize: 20, marginTop: 0, marginBottom: 20 }}>{subject || '(No subject)'}</h1>
              {body ? (
                <div style={{ margin: '16px 0' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(body) }} />
              ) : (
                <p style={{ color: '#999', fontStyle: 'italic' }}>(No message body yet)</p>
              )}
              <p style={{ marginTop: 20 }}>{previewSignOff}<br /><strong>Garden State Abolitionists</strong></p>
            </div>
            <div style={{ backgroundColor: '#1a1a2e', padding: 20, textAlign: 'center', fontSize: 12, color: '#cccccc' }}>
              <p style={{ margin: '0 0 8px 0' }}>Garden State Abolitionists · Est. 2024</p>
              <p style={{ margin: 0, color: '#d4af37' }}>gardenstateabolitionists.com</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setTab('compose')}>Back to Compose</Button>
            <Button
              type="button"
              disabled={disabled}
              onClick={() => { if (!disabled) onSubmit(); }}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              <Send size={16} className={`mr-2 ${sending ? 'animate-pulse' : ''}`} /> {sending ? 'Sending…' : submitLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
