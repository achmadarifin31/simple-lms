import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';

/**
 * Single shared Prisma instance.
 * In dev, reuse across hot reloads to avoid connection pool exhaustion.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
