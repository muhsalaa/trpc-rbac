import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const development = process.env.NODE_ENV !== 'production';

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: development ? ['query', 'error', 'warn'] : ['error'],
  });

if (development) global.prisma = prisma;
