'use server';

import { getAuthToken, verifyToken } from './auth-actions';
import { getAllInquiries } from '@/lib/data/inquiry-store';
import { getAllNewsArticles } from '@/lib/data/news-store';
import { getAllSignatures, getSignatureCount, getSubscribedEmails } from '@/lib/data/petition-store';
import { getAllGalleryPhotos, getGalleryPhotoCount } from '@/lib/data/gallery-store';
import { getActiveSubscriberEmails } from '@/lib/data/subscriber-store';
import { DashboardStats } from '@/types';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function getDashboardStats(): Promise<DashboardStats | { error: string }> {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    const inquiries = await getAllInquiries();
    const newsArticles = await getAllNewsArticles(false);
    const signatureCount = await getSignatureCount();
    const photoCount = await getGalleryPhotoCount();

    // Count unique subscribers across both tables
    const [petitionSubs, newsletterSubs] = await Promise.all([
      getSubscribedEmails(),
      getActiveSubscriberEmails(),
    ]);
    const uniqueEmails = new Set<string>();
    for (const s of petitionSubs) uniqueEmails.add(s.email.toLowerCase());
    for (const s of newsletterSubs) uniqueEmails.add(s.email.toLowerCase());
    const subscriberCount = uniqueEmails.size;

    const stats: DashboardStats = {
      totalInquiries: inquiries.length,
      pendingInquiries: inquiries.filter((i) => i.status === 'pending').length,
      totalNews: newsArticles.length,
      totalSignatures: signatureCount,
      totalPhotos: photoCount,
      totalSubscribers: subscriberCount,
    };

    return stats;
  } catch {
    return { error: 'Failed to fetch dashboard stats' };
  }
}

export async function exportAllData() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    const [inquiries, articles, signatures, photos] = await Promise.all([
      getAllInquiries(),
      getAllNewsArticles(false),
      getAllSignatures(),
      getAllGalleryPhotos(),
    ]);

    return { inquiries, articles, signatures, photos };
  } catch {
    return { error: 'Failed to export data' };
  }
}
