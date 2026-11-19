import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

/**
 * Teacher-only area. Students are redirected to their dashboard.
 * (The middleware already guarantees the user is authenticated.)
 */
export default async function GuruLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user.role !== 'GURU') redirect('/dashboard');
  return <>{children}</>;
}
