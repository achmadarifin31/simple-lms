'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useModule } from '@/hooks/use-modules';

export default function MateriPage() {
  const { id, moduleId } = useParams<{ id: string; moduleId: string }>();
  const { data: mod, isLoading, isError } = useModule(id, moduleId);

  if (isLoading) return <p className="text-muted-foreground">Memuat...</p>;
  if (isError || !mod) return <p className="text-destructive">Gagal memuat materi.</p>;

  return (
    <article className="space-y-4">
      <Link href={`/courses/${id}`} className="text-sm text-muted-foreground hover:underline">
        ← Kembali ke kelas
      </Link>
      <h1 className="text-2xl font-bold">{mod.title}</h1>
      <div className="whitespace-pre-wrap leading-relaxed">{mod.content}</div>
    </article>
  );
}
