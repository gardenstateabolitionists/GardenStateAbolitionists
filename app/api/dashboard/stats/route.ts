import { NextResponse } from 'next/server';
import { getAuthToken, verifyToken } from '@/lib/actions/auth-actions';
import prisma, { isDatabaseConnected } from '@/lib/prisma';
import { getActiveSubscriberEmails } from '@/lib/data/subscriber-store';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;
  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function GET() {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isDatabaseConnected) {
    return NextResponse.json({
      totalInquiries: 0,
      pendingInquiries: 0,
      totalNews: 0,
      totalSignatures: 0,
      totalPhotos: 0,
      totalSubscribers: 0,
    });
  }

  const [totalInquiries, pendingInquiries, totalNews, totalSignatures, totalPhotos, petitionSubscribers, newsletterSubscribers] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: 'pending' } }),
    prisma.newsArticle.count(),
    prisma.petitionSignature.count(),
    prisma.galleryPhoto.count(),
    prisma.petitionSignature.findMany({ where: { subscribed: true }, select: { email: true } }),
    getActiveSubscriberEmails(),
  ]);

  // Deduplicate subscribers by email
  const uniqueEmails = new Set<string>();
  for (const s of petitionSubscribers) uniqueEmails.add(s.email.toLowerCase());
  for (const s of newsletterSubscribers) uniqueEmails.add(s.email.toLowerCase());

  return NextResponse.json({
    totalInquiries,
    pendingInquiries,
    totalNews,
    totalSignatures,
    totalPhotos,
    totalSubscribers: uniqueEmails.size,
  });
}
