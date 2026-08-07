import { NextRequest, NextResponse } from 'next/server';
import { verifyUnsubscribeToken } from '@/lib/email';
import { updateSubscriptionStatus } from '@/lib/data/petition-store';
import { updateSubscriberStatus } from '@/lib/data/subscriber-store';

// GET: Redirect to confirmation page (email links land here)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  if (!email || !token) {
    return NextResponse.json({ error: 'Missing email or token' }, { status: 400 });
  }

  // Redirect to the unsubscribe confirmation page with params
  const url = new URL('/unsubscribe', request.url);
  url.searchParams.set('email', email);
  url.searchParams.set('token', token);
  return NextResponse.redirect(url);
}

// POST: Actually perform the unsubscribe (called from confirmation page)
export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json({ error: 'Missing email or token' }, { status: 400 });
    }

    if (!verifyUnsubscribeToken(email, token)) {
      return NextResponse.json({ error: 'Invalid or expired unsubscribe link' }, { status: 403 });
    }

    // Update both tables — user may be in either or both
    const [petitionUpdated, subscriberUpdated] = await Promise.all([
      updateSubscriptionStatus(email, false),
      updateSubscriberStatus(email, false),
    ]);

    if (!petitionUpdated && !subscriberUpdated) {
      return NextResponse.json({ error: 'Invalid or expired unsubscribe link' }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}
