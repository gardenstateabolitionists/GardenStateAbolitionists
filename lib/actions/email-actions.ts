'use server';

import { getAuthToken, verifyToken } from './auth-actions';
import { getSubscribedEmails } from '@/lib/data/petition-store';
import { getActiveSubscriberEmails } from '@/lib/data/subscriber-store';
import { sendBroadcastToAll, sendBroadcastNotification } from '@/lib/email';
import { sanitizeHtml } from '@/lib/sanitize';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function sendBroadcast(data: {
  subject: string;
  body: string;
}): Promise<{ sent: number; failed: number } | { error: string }> {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    if (!data.subject || !data.body) {
      return { error: 'Subject and body are required' };
    }

    if (data.subject.length > 200) {
      return { error: 'Subject must be 200 characters or less' };
    }

    // Query both tables and deduplicate by email
    const [petitionSubs, newsletterSubs] = await Promise.all([
      getSubscribedEmails(),
      getActiveSubscriberEmails(),
    ]);

    const seen = new Set<string>();
    const subscribers: typeof petitionSubs = [];
    for (const sub of petitionSubs) {
      const key = sub.email.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        subscribers.push(sub);
      }
    }
    for (const sub of newsletterSubs) {
      const key = sub.email.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        // Wrap in the shape expected by sendBroadcastToAll
        subscribers.push({ id: '', name: '', email: sub.email, subscribed: true, created_at: '' } as typeof petitionSubs[0]);
      }
    }

    if (subscribers.length === 0) {
      return { error: 'No subscribers to send to' };
    }

    // Sanitize the HTML body
    const sanitizedBody = sanitizeHtml(data.body);

    const result = await sendBroadcastToAll(data.subject, sanitizedBody, subscribers);
    await sendBroadcastNotification(data.subject, result.sent, result.failed);

    return result;
  } catch (error) {
    console.error('Error sending broadcast:', error instanceof Error ? error.message : 'Unknown error');
    return { error: 'Failed to send broadcast' };
  }
}
