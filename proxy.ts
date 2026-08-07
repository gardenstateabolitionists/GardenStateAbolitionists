import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const config = {
  matcher: ['/admin/:path*'],
};

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/manage-7x9k', request.url));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      return NextResponse.redirect(new URL('/manage-7x9k', request.url));
    }

    const decoded = jwt.verify(token, secret) as { role?: string };
    if (decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/manage-7x9k', request.url));
    }

    return NextResponse.next();
  } catch {
    // Token is invalid or expired - clear it and redirect
    const response = NextResponse.redirect(new URL('/manage-7x9k', request.url));
    response.cookies.set('auth_token', '', {
      path: '/',
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return response;
  }
}
