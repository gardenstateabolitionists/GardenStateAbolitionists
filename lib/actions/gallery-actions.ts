'use server';

import { revalidatePath } from 'next/cache';
import { getAuthToken, verifyToken } from './auth-actions';
import {
  getAllGalleryPhotos,
  createGalleryPhoto as createPhoto,
  updateGalleryPhoto as updatePhoto,
  deleteGalleryPhoto as deletePhoto,
} from '@/lib/data/gallery-store';

/** Focal point is a percentage; anything outside 0-100 is a broken crop. */
function clampFocal(v: number | undefined): number {
  if (typeof v !== 'number' || Number.isNaN(v)) return 50;
  return Math.min(100, Math.max(0, Math.round(v)));
}

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function fetchGalleryPhotos() {
  try {
    return await getAllGalleryPhotos();
  } catch {
    return { error: 'Failed to fetch gallery photos' };
  }
}

export async function createGalleryPhoto(data: { url: string; caption?: string; sortOrder?: number; featuredOnHome?: boolean; focalY?: number }) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    if (!data.url) {
      return { error: 'Image URL is required' };
    }

    try {
      const parsed = new URL(data.url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return { error: 'Only http and https URLs are allowed' };
      }
    } catch {
      return { error: 'Invalid URL format' };
    }

    const newPhoto = await createPhoto({
      url: data.url,
      caption: data.caption,
      sortOrder: data.sortOrder || 0,
      featuredOnHome: data.featuredOnHome ?? false,
      focalY: clampFocal(data.focalY),
    });

    // The homepage is statically rendered; without this the grid keeps serving
    // the old photos until the next deploy or revalidate window.
    revalidatePath('/');
    revalidatePath('/media');

    return newPhoto;
  } catch {
    return { error: 'Failed to create gallery photo' };
  }
}

export async function updateGalleryPhoto(id: string, data: { url?: string; caption?: string; sortOrder?: number; featuredOnHome?: boolean; focalY?: number }) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    const updated = await updatePhoto(id, {
      ...data,
      ...(data.focalY !== undefined && { focalY: clampFocal(data.focalY) }),
    });

    if (!updated) {
      return { error: 'Photo not found' };
    }

    revalidatePath('/');
    revalidatePath('/media');

    return updated;
  } catch {
    return { error: 'Failed to update gallery photo' };
  }
}

export async function deleteGalleryPhoto(id: string) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    const deleted = await deletePhoto(id);

    if (!deleted) {
      return { error: 'Photo not found' };
    }

    revalidatePath('/');
    revalidatePath('/media');

    return { success: true };
  } catch {
    return { error: 'Failed to delete gallery photo' };
  }
}
