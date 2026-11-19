import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * MIDDLEWARE — one file for all routes (Next.js constraint).
 * Unlike Hono where middleware is per-route, here it runs globally
 * and you filter by path. Keep it lightweight: auth check + redirect only.
 * Heavy logic belongs in Route Handlers or services, not here.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = Boolean(req.auth);

  const protectedPaths = ['/dashboard', '/settings', '/profile'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  // Skip static files and Next internals — only run on real routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
