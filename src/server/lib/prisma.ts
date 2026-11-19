import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';

/**
 * Single shared Prisma instance.
 * In dev, reuse across hot reloads to avoid connection pool exhaustion.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Supabase's transaction pooler (port 6543) is not reliably reachable from
 * some runtimes (e.g. Vercel functions returned "Can't reach database server
 * ...:6543"). The session pooler (port 5432) is reliable, so normalize the
 * connection URL to 5432 and drop pgbouncer-only params.
 */
function resolveDbUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  return url
    .replace(':6543', ':5432')
    .replace(/[?&]pgbouncer=true/i, '')
    .replace(/[?&]connection_limit=\d+/i, '');
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: resolveDbUrl(),
    log: env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
