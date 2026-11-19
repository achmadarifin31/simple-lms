import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

/**
 * Authenticated layout — protects every page under (app)/.
 * Any unauthenticated visitor is redirected to /login.
 * Add shared UI here: sidebar, top nav, etc.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <div className="flex min-h-screen">
      {/* TODO: add sidebar / top nav here */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
