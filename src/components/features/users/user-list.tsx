'use client';

import { useUsers } from '@/hooks/use-users';

/**
 * Example client component consuming a feature hook.
 * Note: no fetch() or apiClient calls here — always go through hooks.
 * This keeps components focused on rendering, not data fetching.
 */
export function UserList() {
  const { data, isLoading, isError } = useUsers();

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (isError) return <p className="text-destructive">Failed to load users.</p>;

  return (
    <ul className="space-y-2">
      {data?.items.map((user) => (
        <li key={user.id} className="rounded-md border p-3">
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </li>
      ))}
    </ul>
  );
}
