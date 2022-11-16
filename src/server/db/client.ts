import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const development = process.env.NODE_ENV !== 'production';

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: development ? ['query', 'error', 'warn'] : ['error'],
  });

if (development) global.prisma = prisma;
