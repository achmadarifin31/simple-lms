'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Badge, Button } from '@/components/ui';
import type { Role } from '@/lib/lms-types';

export function AppNav({ user }: { user: { name?: string | null; role: Role } }) {
  const pathname = usePathname();

  const links =
    user.role === 'GURU'
      ? [
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/guru', label: 'Kelola Kelas' },
          { href: '/courses', label: 'Lihat Kelas' },
        ]
      : [
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/courses', label: 'Kelas Saya' },
        ];

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-brand/5 p-4">
      <div className="px-2 pb-6">
        <p className="bg-gradient-to-r from-brand to-brand-light bg-clip-text text-lg font-bold text-transparent">
          LMS Digital
        </p>
        <p className="text-xs text-muted-foreground">Keluarga Awal Kehidupan</p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((l) => {
          const active = pathname === l.href || pathname.startsWith(l.href + '/');
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-gradient-to-r from-brand to-brand-light text-white shadow-sm'
                  : 'hover:bg-brand/10 hover:text-brand'
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-border pt-4">
        <div className="px-2">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <Badge variant={user.role === 'GURU' ? 'success' : 'muted'}>
            {user.role === 'GURU' ? 'Guru' : 'Siswa'}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          Keluar
        </Button>
      </div>
    </aside>
  );
}
