'use server';

import { getAuthToken, verifyToken } from './auth-actions';
import { getBroadcastablePartners } from '@/lib/data/partners';
import {
  sendPartnerBroadcast,
  sendOfficialBroadcastNotification,
} from '@/lib/email';
import { sanitizeHtml } from '@/lib/sanitize';

async function requireAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;
  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

// -------- PARTNERS -------------------------------------------------

export async function countPartnerRecipients(): Promise<number | { error: string }> {
  const admin = await requireAdmin();
  if (!admin) return { error: 'Authentication required' };
  return getBroadcastablePartners().length;
}

export async function getPartnerAudiencePreview(): Promise<Array<{ name: string; email: string; state?: string }> | { error: string }> {
  const admin = await requireAdmin();
  if (!admin) return { error: 'Authentication required' };
  return getBroadcastablePartners();
}

export async function sendPartnerBroadcastAction(data: {
  subject: string;
  body: string;
}): Promise<{ sent: number; failed: number } | { error: string }> {
  try {
    const admin = await requireAdmin();
    if (!admin) return { error: 'Authentication required' };

    if (!data.subject.trim() || !data.body.trim()) {
      return { error: 'Subject and body are required' };
    }
    if (data.subject.length > 200) {
      return { error: 'Subject must be 200 characters or less' };
    }

    const partners = getBroadcastablePartners();
    if (partners.length === 0) {
      return { error: 'No partners have an email on file yet.' };
    }

    const recipients = partners.map((p) => ({
      name: p.name,
      email: p.email,
      meta: p.state || 'National',
    }));

    const safeBody = sanitizeHtml(data.body);
    const result = await sendPartnerBroadcast(data.subject.trim(), safeBody, recipients);
    await sendOfficialBroadcastNotification('partner', data.subject.trim(), result.sent, result.failed);
    return result;
  } catch (error) {
    console.error('Partner broadcast error:', error instanceof Error ? error.message : 'Unknown error');
    return { error: 'Failed to send partner broadcast' };
  }
}
