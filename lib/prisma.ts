import { PrismaClient } from "@/lib/generated/prisma";

// Helper to check if database is configured
export const isDatabaseConnected = !!process.env.DATABASE_URL;

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Only instantiate PrismaClient when DATABASE_URL is configured
const prisma = isDatabaseConnected
  ? (globalForPrisma.prisma ?? prismaClientSingleton())
  : (null as unknown as PrismaClientSingleton);

export default prisma;

if (isDatabaseConnected && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
