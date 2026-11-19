import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

/**
 * MIDDLEWARE — one file for all routes (Next.js constraint), Edge runtime.
 * Uses the edge-safe `authConfig` (no Prisma/bcrypt) so it bundles for Edge.
 * The `authorized` callback in authConfig decides redirects; keep this thin.
 */
export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
  // Skip Next internals, static files, and API routes (those guard themselves
  // via requireAuth/requireRole in their Route Handlers).
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
