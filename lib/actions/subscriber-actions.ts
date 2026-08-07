'use server';

import {
  getSubscribedEmails,
  updateSubscriptionStatus,
  deleteSignature,
} from '@/lib/data/petition-store';
import {
  getAllSubscribers,
  updateSubscriberStatus,
  deleteSubscriberById,
} from '@/lib/data/subscriber-store';
import { getAuthToken, verifyToken } from './auth-actions';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function fetchSubscribers() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    // Query both tables and merge by email
    const [petitionSubs, newsletterSubs] = await Promise.all([
      getSubscribedEmails(),
      getAllSubscribers(),
    ]);

    const seen = new Set<string>();
    const combined: { id: string; email: string; name?: string; source: string; subscribed: boolean; created_at: string }[] = [];

    // Add petition subscribers first
    for (const sig of petitionSubs) {
      const key = sig.email.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        combined.push({
          id: sig.id,
          email: sig.email,
          name: sig.name,
          source: 'petition',
          subscribed: sig.subscribed ?? false,
          created_at: sig.created_at || new Date().toISOString(),
        });
      }
    }

    // Add newsletter-only subscribers
    for (const sub of newsletterSubs) {
      const key = sub.email.toLowerCase();
      if (!seen.has(key) && sub.subscribed) {
        seen.add(key);
        combined.push({
          id: sub.id,
          email: sub.email,
          source: 'newsletter',
          subscribed: sub.subscribed,
          created_at: sub.created_at,
        });
      }
    }

    return combined;
  } catch {
    return { error: 'Failed to fetch subscribers' };
  }
}

export async function unsubscribeUser(email: string) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    // Update both tables
    const [petitionUpdated, subscriberUpdated] = await Promise.all([
      updateSubscriptionStatus(email, false),
      updateSubscriberStatus(email, false),
    ]);

    if (!petitionUpdated && !subscriberUpdated) {
      return { error: 'Subscriber not found' };
    }

    return { success: true };
  } catch {
    return { error: 'Failed to unsubscribe user' };
  }
}

export async function deleteSubscriber(id: string) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    // Try deleting from both tables
    const petitionDeleted = await deleteSignature(id);
    if (petitionDeleted) return { success: true };

    const subscriberDeleted = await deleteSubscriberById(id);
    if (subscriberDeleted) return { success: true };

    return { error: 'Subscriber not found' };
  } catch {
    return { error: 'Failed to delete subscriber' };
  }
}
