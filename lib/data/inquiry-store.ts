// Inquiries store
// Uses Prisma/PostgreSQL when DATABASE_URL is set, otherwise in-memory

import { Inquiry } from '@/types';
import prisma, { isDatabaseConnected } from '@/lib/prisma';

// In-memory fallback store
const memoryStore: Inquiry[] = [];

export async function getAllInquiries(): Promise<Inquiry[]> {
  if (isDatabaseConnected) {
    const items = await prisma.inquiry.findMany({ orderBy: { created_at: 'desc' } });
    return items.map(mapDbInquiry);
  }
  return [...memoryStore].sort((a, b) =>
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
}

export async function getInquiryById(id: string): Promise<Inquiry | undefined> {
  if (isDatabaseConnected) {
    const item = await prisma.inquiry.findUnique({ where: { id } });
    return item ? mapDbInquiry(item) : undefined;
  }
  return memoryStore.find((i) => i.id === id);
}

export async function createInquiry(data: Omit<Inquiry, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<Inquiry> {
  if (isDatabaseConnected) {
    const item = await prisma.inquiry.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject || 'General Inquiry',
        message: data.message,
        status: 'pending',
      },
    });
    return mapDbInquiry(item);
  }

  const newInquiry: Inquiry = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    subject: data.subject || 'General Inquiry',
    message: data.message,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  memoryStore.push(newInquiry);
  return newInquiry;
}

export async function updateInquiry(id: string, data: Partial<Inquiry>): Promise<Inquiry | null> {
  if (isDatabaseConnected) {
    try {
      const item = await prisma.inquiry.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.email !== undefined && { email: data.email }),
          ...(data.subject !== undefined && { subject: data.subject }),
          ...(data.message !== undefined && { message: data.message }),
          ...(data.status !== undefined && { status: data.status }),
        },
      });
      return mapDbInquiry(item);
    } catch {
      return null;
    }
  }

  const index = memoryStore.findIndex((i) => i.id === id);
  if (index === -1) return null;

  memoryStore[index] = {
    ...memoryStore[index],
    ...data,
    updated_at: new Date().toISOString(),
  };
  return memoryStore[index];
}

export async function deleteInquiry(id: string): Promise<boolean> {
  if (isDatabaseConnected) {
    try {
      await prisma.inquiry.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  const index = memoryStore.findIndex((i) => i.id === id);
  if (index === -1) return false;
  memoryStore.splice(index, 1);
  return true;
}

export async function getPendingCount(): Promise<number> {
  if (isDatabaseConnected) {
    return prisma.inquiry.count({ where: { status: 'pending' } });
  }
  return memoryStore.filter((i) => i.status === 'pending').length;
}

function mapDbInquiry(item: {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}): Inquiry {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    subject: item.subject || 'General Inquiry',
    message: item.message,
    status: item.status,
    created_at: item.created_at.toISOString(),
    updated_at: item.updated_at.toISOString(),
  };
}
