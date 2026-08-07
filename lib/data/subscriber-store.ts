// Newsletter subscriber store
// Uses Prisma/PostgreSQL when DATABASE_URL is set, otherwise in-memory

import prisma, { isDatabaseConnected } from '@/lib/prisma';

interface Subscriber {
  id: string;
  email: string;
  subscribed: boolean;
  created_at: string;
}

// In-memory fallback store
const memoryStore: Subscriber[] = [];

export async function getAllSubscribers(): Promise<Subscriber[]> {
  if (isDatabaseConnected) {
    const subs = await prisma.subscriber.findMany({ orderBy: { created_at: 'desc' } });
    return subs.map(mapDbSubscriber);
  }
  return [...memoryStore].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
  if (isDatabaseConnected) {
    const sub = await prisma.subscriber.findUnique({ where: { email: email.toLowerCase() } });
    return sub ? mapDbSubscriber(sub) : undefined;
  }
  return memoryStore.find((s) => s.email.toLowerCase() === email.toLowerCase());
}

export async function createSubscriber(email: string): Promise<Subscriber> {
  if (isDatabaseConnected) {
    const sub = await prisma.subscriber.create({
      data: { email: email.toLowerCase() },
    });
    return mapDbSubscriber(sub);
  }

  const newSub: Subscriber = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    subscribed: true,
    created_at: new Date().toISOString(),
  };
  memoryStore.push(newSub);
  return newSub;
}

export async function updateSubscriberStatus(email: string, subscribed: boolean): Promise<boolean> {
  if (isDatabaseConnected) {
    try {
      await prisma.subscriber.update({
        where: { email: email.toLowerCase() },
        data: { subscribed },
      });
      return true;
    } catch {
      return false;
    }
  }

  const sub = memoryStore.find((s) => s.email.toLowerCase() === email.toLowerCase());
  if (!sub) return false;
  sub.subscribed = subscribed;
  return true;
}

export async function deleteSubscriberById(id: string): Promise<boolean> {
  if (isDatabaseConnected) {
    try {
      await prisma.subscriber.delete({ where: { id } });
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

export async function getActiveSubscriberCount(): Promise<number> {
  if (isDatabaseConnected) {
    return prisma.subscriber.count({ where: { subscribed: true } });
  }
  return memoryStore.filter((s) => s.subscribed).length;
}

export async function getActiveSubscriberEmails(): Promise<{ email: string }[]> {
  if (isDatabaseConnected) {
    const subs = await prisma.subscriber.findMany({
      where: { subscribed: true },
      select: { email: true },
    });
    return subs;
  }
  return memoryStore.filter((s) => s.subscribed).map((s) => ({ email: s.email }));
}

function mapDbSubscriber(sub: {
  id: string;
  email: string;
  subscribed: boolean;
  created_at: Date;
}): Subscriber {
  return {
    id: sub.id,
    email: sub.email,
    subscribed: sub.subscribed,
    created_at: sub.created_at.toISOString(),
  };
}
