import { NextRequest, NextResponse } from 'next/server';
import {
  updateInquiry,
  deleteInquiry,
} from '@/lib/data/inquiry-store';
import { getAuthToken, verifyToken } from '@/lib/actions/auth-actions';
import { validateCsrf } from '@/lib/csrf';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;
  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();
    // Only allow updating known fields
    const allowedFields = ['status', 'name', 'email', 'subject', 'message'];
    const filtered: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in data) filtered[key] = data[key];
    }

    // Validate status enum
    const validStatuses = ['pending', 'reviewed', 'responded', 'archived'];
    if (filtered.status && typeof filtered.status === 'string' && !validStatuses.includes(filtered.status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
    }

    // Validate field lengths
    if (typeof filtered.name === 'string' && filtered.name.length > 100) {
      return NextResponse.json({ error: 'Name must be 100 characters or less' }, { status: 400 });
    }
    if (typeof filtered.email === 'string' && filtered.email.length > 254) {
      return NextResponse.json({ error: 'Email must be 254 characters or less' }, { status: 400 });
    }
    if (typeof filtered.subject === 'string' && filtered.subject.length > 200) {
      return NextResponse.json({ error: 'Subject must be 200 characters or less' }, { status: 400 });
    }
    if (typeof filtered.message === 'string' && filtered.message.length > 5000) {
      return NextResponse.json({ error: 'Message must be 5000 characters or less' }, { status: 400 });
    }

    const updated = await updateInquiry(id, filtered);

    if (!updated) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteInquiry(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
