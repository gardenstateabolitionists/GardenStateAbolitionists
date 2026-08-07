// Petition signatures store
// Uses Prisma/PostgreSQL when DATABASE_URL is set, otherwise in-memory

import { PetitionSignature } from '@/types';
import prisma, { isDatabaseConnected } from '@/lib/prisma';

// In-memory fallback store
const memoryStore: PetitionSignature[] = [];

export async function getAllSignatures(): Promise<PetitionSignature[]> {
  if (isDatabaseConnected) {
    const sigs = await prisma.petitionSignature.findMany({ orderBy: { created_at: 'desc' } });
    return sigs.map(mapDbSignature);
  }
  return [...memoryStore].sort((a, b) =>
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
}

export async function getSignatureCount(): Promise<number> {
  if (isDatabaseConnected) {
    return prisma.petitionSignature.count();
  }
  return memoryStore.length;
}

export async function getSignatureById(id: string): Promise<PetitionSignature | undefined> {
  if (isDatabaseConnected) {
    const sig = await prisma.petitionSignature.findUnique({ where: { id } });
    return sig ? mapDbSignature(sig) : undefined;
  }
  return memoryStore.find((s) => s.id === id);
}

export async function hasAlreadySigned(email: string): Promise<boolean> {
  if (isDatabaseConnected) {
    const sig = await prisma.petitionSignature.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });
    return !!sig;
  }
  return memoryStore.some((s) => s.email.toLowerCase() === email.toLowerCase());
}

export async function createSignature(data: Omit<PetitionSignature, 'id' | 'created_at'>): Promise<PetitionSignature> {
  if (isDatabaseConnected) {
    const sig = await prisma.petitionSignature.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        city: data.city || null,
        state: data.state || 'NJ',
        zipcode: data.zipcode || null,
        subscribed: data.subscribed || false,
      },
    });
    return mapDbSignature(sig);
  }

  const newSignature: PetitionSignature = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email.toLowerCase(),
    city: data.city || '',
    state: data.state || 'NJ',
    zipcode: data.zipcode || '',
    subscribed: data.subscribed || false,
    created_at: new Date().toISOString(),
  };
  memoryStore.push(newSignature);
  return newSignature;
}

export async function getSubscribedEmails(): Promise<PetitionSignature[]> {
  if (isDatabaseConnected) {
    const sigs = await prisma.petitionSignature.findMany({ where: { subscribed: true } });
    return sigs.map(mapDbSignature);
  }
  return memoryStore.filter((s) => s.subscribed === true);
}

export async function updateSubscriptionStatus(email: string, subscribed: boolean): Promise<boolean> {
  if (isDatabaseConnected) {
    try {
      await prisma.petitionSignature.update({
        where: { email: email.toLowerCase() },
        data: { subscribed },
      });
      return true;
    } catch {
      return false;
    }
  }

  const sig = memoryStore.find((s) => s.email.toLowerCase() === email.toLowerCase());
  if (!sig) return false;
  sig.subscribed = subscribed;
  return true;
}

export async function getSubscriberCount(): Promise<number> {
  if (isDatabaseConnected) {
    return prisma.petitionSignature.count({ where: { subscribed: true } });
  }
  return memoryStore.filter((s) => s.subscribed === true).length;
}

export async function deleteSignature(id: string): Promise<boolean> {
  if (isDatabaseConnected) {
    try {
      await prisma.petitionSignature.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  const index = memoryStore.findIndex((s) => s.id === id);
  if (index === -1) return false;
  memoryStore.splice(index, 1);
  return true;
}

function mapDbSignature(sig: {
  id: string;
  name: string;
  email: string;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  subscribed: boolean;
  created_at: Date;
}): PetitionSignature {
  return {
    id: sig.id,
    name: sig.name,
    email: sig.email,
    city: sig.city || '',
    state: sig.state || 'NJ',
    zipcode: sig.zipcode || '',
    subscribed: sig.subscribed,
    created_at: sig.created_at.toISOString(),
  };
}
