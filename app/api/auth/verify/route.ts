import { NextResponse } from 'next/server';
import { getAuthToken, verifyToken } from '@/lib/actions/auth-actions';

export async function POST() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ authorized: false, error: 'Token required' }, { status: 400 });
    }

    const result = await verifyToken(token);

    if (!result.authorized) {
      return NextResponse.json({ authorized: false, error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({
      authorized: true,
      user: result.user,
    });
  } catch {
    return NextResponse.json({ authorized: false, error: 'Invalid token' }, { status: 401 });
  }
}
