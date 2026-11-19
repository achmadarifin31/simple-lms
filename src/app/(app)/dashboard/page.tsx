import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

/**
 * Dashboard page — protected by (app)/layout.tsx.
 * This is a Server Component; fetch data directly or use client components
 * with TanStack Query for interactive parts.
 */
export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Your dashboard content goes here.</p>
    </div>
  );
}
