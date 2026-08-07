import { NextRequest, NextResponse } from 'next/server';
import {
  getAllInquiries,
  createInquiry,
} from '@/lib/data/inquiry-store';
import { sendInquiryConfirmationEmail, sendInquiryNotificationEmail } from '@/lib/email';
import { getAuthToken, verifyToken } from '@/lib/actions/auth-actions';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateCsrf } from '@/lib/csrf';
import { getClientIp } from '@/lib/client-ip';
import { getPostHogClient } from '@/lib/posthog-server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const token = await getAuthToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await verifyToken(token);
  if (!result.authorized || result.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(await getAllInquiries());
}

export async function POST(request: NextRequest) {
  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  try {
    // Rate limit form submissions (10 per 15 min per IP)
    const ip = getClientIp(request);
    const limit = await checkRateLimit(`inquiry:${ip}`, 10);
    if (!limit.allowed) {
      return NextResponse.json({ error: `Too many submissions. Try again in ${limit.retryAfterSeconds} seconds.` }, { status: 429 });
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    // Validate input lengths
    if (data.name.length > 100) {
      return NextResponse.json({ error: 'Name must be 100 characters or less' }, { status: 400 });
    }
    if (data.email.length > 254) {
      return NextResponse.json({ error: 'Email must be 254 characters or less' }, { status: 400 });
    }
    if (data.subject && data.subject.length > 200) {
      return NextResponse.json({ error: 'Subject must be 200 characters or less' }, { status: 400 });
    }
    if (data.message.length > 5000) {
      return NextResponse.json({ error: 'Message must be 5000 characters or less' }, { status: 400 });
    }

    // Validate email format
    if (!EMAIL_REGEX.test(data.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check honeypot field
    if (data.website) {
      // Silently accept but don't create the inquiry
      return NextResponse.json({ id: 'ok', name: data.name, email: data.email, message: data.message, subject: data.subject || 'General Inquiry', status: 'pending', created_at: new Date().toISOString() }, { status: 201 });
    }

    const newInquiry = await createInquiry({
      name: data.name,
      email: data.email,
      subject: data.subject || 'General Inquiry',
      message: data.message,
    });

    // Send emails
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

    const posthog = getPostHogClient();
    if (posthog) {
      posthog.capture({
        distinctId: data.email.toLowerCase(),
        event: 'inquiry_submitted_server',
        properties: {
          subject: data.subject || 'General Inquiry',
          message_length: data.message.length,
        },
      });
      await posthog.shutdown();
    }

    return NextResponse.json(newInquiry, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 });
  }
}
