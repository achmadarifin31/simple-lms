import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AppNav } from '@/components/shared/app-nav';

/**
 * Authenticated layout — protects every page under (app)/.
 * Unauthenticated visitors are redirected to /login.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="flex min-h-screen">
      <AppNav user={{ name: session.user.name, role: session.user.role }} />
      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
