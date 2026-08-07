import prisma, { isDatabaseConnected } from '@/lib/prisma';
import { GalleryPhoto } from '@/types';

// In-memory fallback
const memoryPhotos: GalleryPhoto[] = [];

function mapPhoto(photo: { id: string; url: string; caption: string | null; sortOrder: number; created_at: Date }): GalleryPhoto {
  return {
    id: photo.id,
    url: photo.url,
    caption: photo.caption || undefined,
    sortOrder: photo.sortOrder,
    created_at: photo.created_at.toISOString(),
  };
}

export async function getAllGalleryPhotos(): Promise<GalleryPhoto[]> {
  if (isDatabaseConnected) {
    try {
      const photos = await prisma.galleryPhoto.findMany({
        orderBy: [{ sortOrder: 'asc' }, { created_at: 'desc' }],
      });
      return photos.map(mapPhoto);
    } catch (error) {
      console.error('Error fetching gallery photos:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }
  return [...memoryPhotos].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export async function getGalleryPhotoById(id: string): Promise<GalleryPhoto | null> {
  if (isDatabaseConnected) {
    try {
      const photo = await prisma.galleryPhoto.findUnique({ where: { id } });
      return photo ? mapPhoto(photo) : null;
    } catch (error) {
      console.error('Error fetching gallery photo:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }
  return memoryPhotos.find((p) => p.id === id) || null;
}

export async function createGalleryPhoto(data: { url: string; caption?: string; sortOrder?: number }): Promise<GalleryPhoto> {
  if (isDatabaseConnected) {
    try {
      const photo = await prisma.galleryPhoto.create({
        data: {
          url: data.url,
          caption: data.caption || null,
          sortOrder: data.sortOrder || 0,
        },
      });
      return mapPhoto(photo);
    } catch (error) {
      console.error('Error creating gallery photo:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  const newPhoto: GalleryPhoto = {
    id: crypto.randomUUID(),
    url: data.url,
    caption: data.caption,
    sortOrder: data.sortOrder || 0,
    created_at: new Date().toISOString(),
  };
  memoryPhotos.push(newPhoto);
  return newPhoto;
}

export async function updateGalleryPhoto(id: string, data: Partial<GalleryPhoto>): Promise<GalleryPhoto | null> {
  if (isDatabaseConnected) {
    try {
      const photo = await prisma.galleryPhoto.update({
        where: { id },
        data: {
          ...(data.url !== undefined && { url: data.url }),
          ...(data.caption !== undefined && { caption: data.caption || null }),
          ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        },
      });
      return mapPhoto(photo);
    } catch (error) {
      console.error('Error updating gallery photo:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  const index = memoryPhotos.findIndex((p) => p.id === id);
  if (index === -1) return null;
  memoryPhotos[index] = { ...memoryPhotos[index], ...data };
  return memoryPhotos[index];
}

export async function deleteGalleryPhoto(id: string): Promise<boolean> {
  if (isDatabaseConnected) {
    try {
      await prisma.galleryPhoto.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error('Error deleting gallery photo:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  const index = memoryPhotos.findIndex((p) => p.id === id);
  if (index === -1) return false;
  memoryPhotos.splice(index, 1);
  return true;
}

export async function getGalleryPhotoCount(): Promise<number> {
  if (isDatabaseConnected) {
    try {
      return await prisma.galleryPhoto.count();
    } catch (error) {
      console.error('Error counting gallery photos:', error instanceof Error ? error.message : 'Unknown error');
      return 0;
    }
  }
  return memoryPhotos.length;
}
