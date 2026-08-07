'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Trash, Reply, Send, CheckCircle2 } from 'lucide-react';
import { PinDialog } from '@/components/ui/pin-dialog';
import { updateInquiry, deleteInquiry, replyToInquiry } from '@/lib/actions/inquiry-actions';
import { Inquiry } from '@/types';
import { formatDate } from '@/lib/utils';

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  inquiry: Inquiry | null;
  onUpdate: () => void;
}

const statusOptions = ['pending', 'responded', 'closed'];

export default function InquiryModal({ open, onClose, inquiry, onUpdate }: InquiryModalProps) {
  const [status, setStatus] = useState('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replySent, setReplySent] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void }>({ open: false, title: '', description: '', onConfirm: () => {} });

  useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status);
      setShowReply(false);
      setReplyMessage('');
      setReplySent(false);
      setReplyError('');
    }
  }, [inquiry]);

  const handleStatusUpdate = async () => {
    if (!inquiry) return;

    setIsSubmitting(true);
    try {
      const res = await updateInquiry(inquiry.id, { status });
      if (!('error' in res)) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!inquiry) return;

    setConfirmDialog({
      open: true,
      title: 'Delete Inquiry',
      description: 'Are you sure you want to delete this inquiry?',
      onConfirm: async () => {
        setIsSubmitting(true);
        try {
          const res = await deleteInquiry(inquiry.id);
          if (!('error' in res)) {
            onUpdate();
            onClose();
          }
        } catch (error) {
          console.error('Delete error:', error);
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  const handleReplyClick = () => {
    if (!inquiry || !replyMessage.trim()) return;
    setShowPinDialog(true);
  };

  const handleReply = async () => {
    if (!inquiry || !replyMessage.trim()) return;

    setReplySending(true);
    setReplyError('');
    try {
      const res = await replyToInquiry(inquiry.id, replyMessage);
      if ('error' in res) {
        setReplyError(res.error || 'Failed to send reply');
      } else {
        setReplySent(true);
        setStatus('responded');
        setReplyMessage('');
        setShowReply(false);
        onUpdate();
      }
    } catch {
      setReplyError('Failed to send reply');
    } finally {
      setReplySending(false);
    }
  };

  if (!inquiry) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inquiry Details</DialogTitle>
          <DialogDescription>Review and manage this inquiry</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md border">{inquiry.name}</div>
            </div>
            <div>
              <Label>Email</Label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md border truncate">{inquiry.email}</div>
            </div>
          </div>

          <div>
            <Label>Subject</Label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md border">{inquiry.subject || 'No subject'}</div>
          </div>

          <div>
            <Label>Message</Label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md border min-h-[100px] whitespace-pre-wrap">
              {inquiry.message}
            </div>
          </div>

          <div>
            <Label>Submitted</Label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md border">
              {inquiry.created_at ? formatDate(inquiry.created_at) : 'N/A'}
            </div>
          </div>

          {/* Reply Section */}
          {replySent && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              <CheckCircle2 size={16} />
              Reply sent successfully! Status updated to &quot;Responded&quot;.
            </div>
          )}

          {!showReply ? (
            <Button
              variant="outline"
              onClick={() => setShowReply(true)}
              className="w-full"
            >
              <Reply className="h-4 w-4 mr-2" />
              Reply to {inquiry.name}
            </Button>
          ) : (
            <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Label>Reply to {inquiry.email}</Label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply..."
                rows={5}
                maxLength={5000}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
              <p className="text-xs text-gray-400">{replyMessage.length}/5000</p>
              {replyError && (
                <p className="text-sm text-red-600">{replyError}</p>
              )}
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setShowReply(false); setReplyError(''); }}
                  disabled={replySending}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReplyClick}
                  disabled={replySending || !replyMessage.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {replySending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="text-red-600 hover:bg-red-50"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4 mr-2" />}
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Close
            </Button>
            <Button onClick={handleStatusUpdate} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      <PinDialog
        open={showPinDialog}
        onOpenChange={setShowPinDialog}
        title="Confirm Reply"
        description={`Enter your admin PIN to send a reply to ${inquiry.name}.`}
        onVerified={handleReply}
        loading={replySending}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel="Delete"
        onConfirm={confirmDialog.onConfirm}
      />
    </Dialog>
  );
}
