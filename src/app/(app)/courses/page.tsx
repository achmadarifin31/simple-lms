'use client';

import Link from 'next/link';
import { useCourses } from '@/hooks/use-courses';
import { Badge, Card } from '@/components/ui';

export default function CoursesPage() {
  const { data, isLoading, isError } = useCourses();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Daftar Kelas</h1>
        <p className="mt-1 text-muted-foreground">Pilih kelas untuk mulai belajar.</p>
      </div>

      {isLoading && <p className="text-muted-foreground">Memuat...</p>}
      {isError && <p className="text-destructive">Gagal memuat kelas.</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {data?.items.map((c) => (
          <Link key={c.id} href={`/courses/${c.id}`}>
            <Card className="h-full transition-colors hover:bg-muted">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold">{c.title}</p>
                {!c.published && <Badge variant="warning">Draf</Badge>}
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {c._count.modules} materi · {c._count.quizzes} kuis · {c._count.assignments} tugas
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Pengampu: {c.teacher.name}</p>
            </Card>
          </Link>
        ))}
      </div>

      {data && data.items.length === 0 && (
        <p className="text-muted-foreground">Belum ada kelas.</p>
      )}
    </div>
  );
}
