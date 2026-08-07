'use server';

import { PetitionSignature } from '@/types';
import {
  getAllSignatures,
  getSignatureCount,
  createSignature,
  hasAlreadySigned,
  deleteSignature as deleteSignatureData,
  updateSubscriptionStatus,
} from '@/lib/data/petition-store';
import {
  getSubscriberByEmail,
  createSubscriber,
  updateSubscriberStatus,
} from '@/lib/data/subscriber-store';
import { headers } from 'next/headers';
import { getAuthToken, verifyToken } from './auth-actions';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIpFromHeaders } from '@/lib/client-ip';
import { sendPetitionConfirmationEmail, sendPetitionNotificationEmail, sendSubscriberWelcomeEmail, sendNewSubscriberNotification } from '@/lib/email';
import { getPostHogClient } from '@/lib/posthog-server';
import { verifyTurnstile } from '@/lib/turnstile';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function getPublicSignatureCount(): Promise<number> {
  return await getSignatureCount();
}

export async function fetchSignatures() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    return await getAllSignatures();
  } catch {
    return { error: 'Failed to fetch signatures' };
  }
}

export async function signPetition(data: {
  name: string;
  email: string;
  city?: string;
  state?: string;
  zipcode?: string;
  subscribed?: boolean;
  website?: string;
}): Promise<PetitionSignature | { error: string }> {
  try {
    // Rate limit form submissions (10 per 15 min per IP)
    const hdrs = await headers();
    const ip = getClientIpFromHeaders(hdrs);
    const limit = await checkRateLimit(`petition:${ip}`, 10);
    if (!limit.allowed) {
      return { error: `Too many submissions. Try again in ${limit.retryAfterSeconds} seconds.` };
    }

    // Check honeypot field
    if (data.website) {
      // Silently pretend to succeed
      return {
        id: 'ok',
        name: data.name,
        email: data.email,
        state: data.state || 'NJ',
        subscribed: data.subscribed || false,
        signed_at: new Date().toISOString(),
      } as PetitionSignature;
    }

    // Validate required fields
    if (!data.name || !data.email) {
      return { error: 'Name and email are required' };
    }

    // Validate input lengths
    if (data.name.length > 100) {
      return { error: 'Name must be 100 characters or less' };
    }
    if (data.email.length > 254) {
      return { error: 'Email must be 254 characters or less' };
    }
    if (data.city && data.city.length > 100) {
      return { error: 'City must be 100 characters or less' };
    }
    if (data.zipcode && data.zipcode.length > 10) {
      return { error: 'Zip code must be 10 characters or less' };
    }

    // Validate email format
    if (!EMAIL_REGEX.test(data.email)) {
      return { error: 'Invalid email format' };
    }

    // Check if already signed
    if (await hasAlreadySigned(data.email)) {
      return { error: 'Thank you! Your petition submission has been received.' };
    }

    const newSignature = await createSignature({
      name: data.name,
      email: data.email,
      city: data.city,
      state: data.state || 'NJ',
      zipcode: data.zipcode,
      subscribed: data.subscribed || false,
    });

    // Send emails
    const petitionData = {
      name: data.name,
      email: data.email,
      city: data.city,
      state: data.state,
      subscribed: data.subscribed,
    };
    await Promise.all([
      sendPetitionConfirmationEmail(petitionData),
      sendPetitionNotificationEmail(petitionData),
    ]);

    // Server-side conversion event — captures even if client-side PostHog
    // hasn't loaded yet or was blocked. `distinctId` = email so PostHog
    // can dedupe with the client's anonymous $device_id when they
    // eventually converge (posthog auto-aliases).
    const posthog = getPostHogClient();
    if (posthog) {
      posthog.capture({
        distinctId: data.email.toLowerCase(),
        event: 'petition_signed_server',
        properties: {
          state: data.state || 'NJ',
          subscribed: data.subscribed || false,
          has_city: Boolean(data.city),
          has_zip: Boolean(data.zipcode),
        },
      });
      await posthog.shutdown();
    }

    return newSignature;
  } catch {
    return { error: 'Failed to sign petition' };
  }
}

export async function deleteSignature(id: string) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    const deleted = await deleteSignatureData(id);

    if (!deleted) {
      return { error: 'Signature not found' };
    }

    return { success: true };
  } catch {
    return { error: 'Failed to delete signature' };
  }
}

export async function subscribeToNewsletter(data: {
  email: string;
  website?: string;
  turnstileToken?: string;
}): Promise<{ success: true } | { error: string }> {
  try {
    // Rate limit
    const hdrs = await headers();
    const ip = getClientIpFromHeaders(hdrs);
    const limit = await checkRateLimit(`subscribe:${ip}`, 5);
    if (!limit.allowed) {
      return { error: `Too many attempts. Try again in ${limit.retryAfterSeconds} seconds.` };
    }

    // Honeypot
    if (data.website) {
      return { success: true };
    }

    // Cloudflare Turnstile — proof-of-human. Fails open when the secret
    // is unset (see lib/turnstile.ts) so the code is safe to ship before
    // the keys land; once TURNSTILE_SECRET_KEY is configured in Vercel,
    // a valid token is required.
    const passed = await verifyTurnstile(data.turnstileToken, ip);
    if (!passed) {
      return { error: 'Verification failed. Please refresh and try again.' };
    }

    if (!data.email) {
      return { error: 'Email is required' };
    }

    if (data.email.length > 254) {
      return { error: 'Email must be 254 characters or less' };
    }

    if (!EMAIL_REGEX.test(data.email)) {
      return { error: 'Invalid email format' };
    }

    // Check Subscriber table first
    const existingSubscriber = await getSubscriberByEmail(data.email);
    if (existingSubscriber) {
      if (!existingSubscriber.subscribed) {
        await updateSubscriberStatus(data.email, true);
      }
      return { success: true };
    }

    // Check PetitionSignature table
    if (await hasAlreadySigned(data.email)) {
      await updateSubscriptionStatus(data.email, true);
      return { success: true };
    }

    // Create new Subscriber record (NOT PetitionSignature)
    await createSubscriber(data.email);

    // Send welcome email to subscriber and notification to admin
    await Promise.all([
      sendSubscriberWelcomeEmail(data.email),
      sendNewSubscriberNotification(data.email),
    ]);

    const posthog = getPostHogClient();
    if (posthog) {
      posthog.capture({
        distinctId: data.email.toLowerCase(),
        event: 'newsletter_subscribed_server',
        properties: { source: 'footer' },
      });
      await posthog.shutdown();
    }

    return { success: true };
  } catch {
    return { error: 'Failed to subscribe' };
  }
}
