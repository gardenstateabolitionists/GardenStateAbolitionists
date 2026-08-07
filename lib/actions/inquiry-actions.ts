'use server';

import { getAuthToken, verifyToken } from './auth-actions';
import { Inquiry } from '@/types';
import {
  getAllInquiries,
  getInquiryById,
  createInquiry as createInquiryData,
  updateInquiry as updateInquiryData,
  deleteInquiry as deleteInquiryData,
} from '@/lib/data/inquiry-store';
import { sendInquiryConfirmationEmail, sendInquiryNotificationEmail, sendInquiryReplyEmail } from '@/lib/email';
import { headers } from 'next/headers';
import { checkRateLimit } from '@/lib/rate-limit';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function fetchInquiries() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    return await getAllInquiries();
  } catch {
    return { error: 'Failed to fetch inquiries' };
  }
}

export async function updateInquiry(id: string, data: Partial<Inquiry>) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    const updated = await updateInquiryData(id, data);

    if (!updated) {
      return { error: 'Inquiry not found' };
    }

    return updated;
  } catch {
    return { error: 'Failed to update inquiry' };
  }
}

export async function deleteInquiry(id: string) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    const deleted = await deleteInquiryData(id);

    if (!deleted) {
      return { error: 'Inquiry not found' };
    }

    return { success: true };
  } catch {
    return { error: 'Failed to delete inquiry' };
  }
}

export async function replyToInquiry(inquiryId: string, message: string) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    if (!message.trim()) {
      return { error: 'Reply message is required' };
    }

    if (message.length > 5000) {
      return { error: 'Reply must be 5000 characters or less' };
    }

    const inquiry = await getInquiryById(inquiryId);
    if (!inquiry) {
      return { error: 'Inquiry not found' };
    }

    const result = await sendInquiryReplyEmail({
      to: inquiry.email,
      name: inquiry.name,
      subject: inquiry.subject || 'General Inquiry',
      message: message.trim(),
    });

    if (!result.success) {
      return { error: result.error || 'Failed to send reply' };
    }

    // Update status to responded
    await updateInquiryData(inquiryId, { status: 'responded' });

    return { success: true };
  } catch (error) {
    console.error('Error replying to inquiry:', error instanceof Error ? error.message : 'Unknown error');
    return { error: 'Failed to send reply' };
  }
}

export async function createInquiry(data: Omit<Inquiry, 'id' | 'status' | 'created_at' | 'updated_at'> & { website?: string }) {
  try {
    // Rate limit form submissions (10 per 15 min per IP)
    const hdrs = await headers();
    const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const limit = await checkRateLimit(`inquiry:${ip}`, 10);
    if (!limit.allowed) {
      return { error: `Too many submissions. Try again in ${limit.retryAfterSeconds} seconds.` };
    }

    // Check honeypot field
    if (data.website) {
      return { id: 'ok', name: data.name, email: data.email, message: data.message, subject: data.subject || '', status: 'pending', created_at: new Date().toISOString() };
    }

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return { error: 'Name, email, and message are required' };
    }

    // Validate input lengths
    if (data.name.length > 100) {
      return { error: 'Name must be 100 characters or less' };
    }
    if (data.email.length > 254) {
      return { error: 'Email must be 254 characters or less' };
    }
    if (data.subject && data.subject.length > 200) {
      return { error: 'Subject must be 200 characters or less' };
    }
    if (data.message.length > 5000) {
      return { error: 'Message must be 5000 characters or less' };
    }

    // Validate email format
    if (!EMAIL_REGEX.test(data.email)) {
      return { error: 'Invalid email format' };
    }

    const newInquiry = await createInquiryData(data);

    // Send emails — awaited so serverless doesn't terminate before delivery
    try {
      await Promise.all([
        sendInquiryConfirmationEmail({
          id: newInquiry.id,
          name: newInquiry.name,
          email: newInquiry.email,
          subject: newInquiry.subject,
          message: newInquiry.message,
          created_at: newInquiry.created_at || '',
        }),
        sendInquiryNotificationEmail({
          id: newInquiry.id,
          name: newInquiry.name,
          email: newInquiry.email,
          subject: newInquiry.subject,
          message: newInquiry.message,
          created_at: newInquiry.created_at || '',
        }),
      ]);
    } catch (emailError) {
      console.error('Error sending inquiry emails:', emailError);
    }

    return newInquiry;
  } catch {
    return { error: 'Failed to submit inquiry' };
  }
}
