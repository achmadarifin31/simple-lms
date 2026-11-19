import { auth } from '@/lib/auth';
import { UnauthorizedError } from '../lib/errors';
import type { NextRequest } from 'next/server';

/**
 * Auth guard for Route Handlers.
 *
 * Usage in a Route Handler:
 *   export async function GET(req: NextRequest) {
 *     const session = await requireAuth(req);
 *     // session.user is guaranteed here
 *   }
 */
export async function requireAuth(_req: NextRequest) {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  return session;
}
