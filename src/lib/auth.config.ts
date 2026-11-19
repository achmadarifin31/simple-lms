import type { NextAuthConfig } from 'next-auth';
import type { Role } from '@prisma/client';

/**
 * EDGE-SAFE auth config.
 * Contains everything that must run in the Edge runtime (middleware):
 * pages, session strategy, and the jwt/session/authorized callbacks.
 *
 * It must NOT import Prisma or any Node-only module — the real Credentials
 * provider (which hits the DB + bcrypt) is added in src/lib/auth.ts, which
 * only runs in the Node runtime during sign-in.
 */
const PROTECTED_PREFIXES = ['/dashboard', '/courses', '/guru', '/settings', '/profile'];

export const authConfig = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [], // real providers injected in auth.ts
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? '';
        session.user.role = (token.role as Role) ?? 'SISWA';
      }
      return session;
    },
    /**
     * Used by the middleware (Edge). Return false → redirect to signIn page.
     * Role-based gating (e.g. /guru for GURU only) is enforced in the
     * (app)/guru server layout, not here.
     */
    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);
      const { pathname } = request.nextUrl;
      const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
      if (isProtected) return isLoggedIn;
      return true;
    },
  },
} satisfies NextAuthConfig;
