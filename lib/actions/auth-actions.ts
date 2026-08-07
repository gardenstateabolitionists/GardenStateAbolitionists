'use server';

import { cookies, headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { timingSafeEqual } from 'crypto';
import { checkRateLimitStrict } from '@/lib/rate-limit';
import { getClientIpFromHeaders } from '@/lib/client-ip';
import { getPostHogClient } from '@/lib/posthog-server';

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Set it in .env.local`);
  }
  return value;
}

function getJwtSecret(): string {
  const secret = getRequiredEnv('JWT_SECRET');
  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
  return secret;
}

async function getClientIp(): Promise<string> {
  const hdrs = await headers();
  return getClientIpFromHeaders(hdrs);
}

export async function verifyAccessCode(code: string) {
  const ip = await getClientIp();
  const limit = await checkRateLimitStrict(`access:${ip}`);
  if (!limit.allowed) {
    return { valid: false, error: `Too many attempts. Try again in ${limit.retryAfterSeconds} seconds.` };
  }

  const accessCode = getRequiredEnv('ADMIN_ACCESS_CODE');
  // Pad both to same length to avoid timing leak on length difference
  const maxLen = Math.max(code.length, accessCode.length);
  const codeBuf = Buffer.alloc(maxLen);
  const expectedBuf = Buffer.alloc(maxLen);
  Buffer.from(code, 'utf-8').copy(codeBuf);
  Buffer.from(accessCode, 'utf-8').copy(expectedBuf);
  if (code.length === accessCode.length && timingSafeEqual(codeBuf, expectedBuf)) {
    return { valid: true };
  }
  return { valid: false };
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  return token?.value;
}

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  });
}

export async function removeAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

export async function loginUser(email: string, password: string) {
  try {
    const ip = await getClientIp();
    const limit = await checkRateLimitStrict(`login:${ip}`);
    if (!limit.allowed) {
      return { error: `Too many login attempts. Try again in ${limit.retryAfterSeconds} seconds.` };
    }

    const adminEmail = getRequiredEnv('ADMIN_EMAIL');
    const adminPasswordHash = getRequiredEnv('ADMIN_PASSWORD_HASH');

    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      return { error: 'Invalid credentials' };
    }

    const isValidPassword = await bcrypt.compare(password, adminPasswordHash);
    if (!isValidPassword) {
      return { error: 'Invalid credentials' };
    }

    const token = jwt.sign(
      { userId: '1', email: adminEmail, role: 'admin' },
      getJwtSecret(),
      { expiresIn: '8h' }
    );

    await setAuthToken(token);

    const posthog = getPostHogClient();
    if (posthog) {
      posthog.capture({
        distinctId: adminEmail.toLowerCase(),
        event: 'admin_logged_in',
      });
      await posthog.shutdown();
    }

    return {
      user: {
        id: '1',
        email: adminEmail,
        name: 'Admin',
        role: 'admin',
      },
    };
  } catch (error) {
    console.error('Login error:', error instanceof Error ? error.message : 'Unknown error');
    return { error: 'Login failed. Please try again.' };
  }
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as {
      userId: string;
      email: string;
      role: string;
    };

    return {
      authorized: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
    };
  } catch {
    return { authorized: false, error: 'Invalid token' };
  }
}

export async function checkAuthStatus() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('auth_token');
    if (!tokenCookie?.value) {
      return { authorized: false };
    }
    const decoded = jwt.verify(tokenCookie.value, getJwtSecret()) as {
      userId: string;
      email: string;
      role: string;
    };
    return {
      authorized: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
    };
  } catch {
    return { authorized: false };
  }
}

export async function logoutUser() {
  await removeAuthToken();
  return { success: true };
}
