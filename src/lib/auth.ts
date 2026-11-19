import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

/**
 * Auth config SKELETON using NextAuth v5.
 * Replace the Credentials provider with your real auth strategy:
 * - Google/GitHub OAuth: add provider from next-auth/providers/*
 * - Credentials: implement the authorize() function against your DB
 *
 * `auth` is re-exported for use in Server Components and Route Handlers.
 * `handlers` is mounted at app/api/auth/[...nextauth]/route.ts.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        // TODO: validate credentials against your DB + verify password hash
        // Return null to reject, return user object to accept
        if (!credentials?.email) return null;
        return { id: 'user-id', email: String(credentials.email), name: 'User' };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: { ...session.user, id: token.sub ?? '' },
    }),
  },
});
