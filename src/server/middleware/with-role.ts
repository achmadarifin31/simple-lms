import { auth } from '@/lib/auth';
import { UnauthorizedError, ForbiddenError } from '../lib/errors';
import type { Role } from '@prisma/client';

/**
 * Auth + role guard for Route Handlers.
 * Returns the session when the user has (one of) the required role(s);
 * throws UnauthorizedError (401) if not logged in, ForbiddenError (403)
 * if logged in but lacking the role.
 *
 *   const session = await requireRole('GURU');
 */
export async function requireRole(...roles: Role[]) {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  if (roles.length && !roles.includes(session.user.role)) {
    throw new ForbiddenError('Akses khusus ' + roles.join('/'));
  }
  return session;
}
