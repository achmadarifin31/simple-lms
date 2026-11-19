'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  useAssignment,
  useMySubmission,
  useUploadSubmission,
} from '@/hooks/use-assignments';
import { Badge, Button, Card } from '@/components/ui';

function formatDeadline(iso?: string | null) {
  if (!iso) return 'Tidak ada';
  return new Date(iso).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });
}

export default function TugasPage() {
  const { id, assignmentId } = useParams<{ id: string; assignmentId: string }>();
  const { data: session } = useSession();
  const isGuru = session?.user?.role === 'GURU';

  const { data: assignment, isLoading } = useAssignment(id, assignmentId);
  const { data: mine } = useMySubmission(id, assignmentId, !isGuru);
  const upload = useUploadSubmission(id, assignmentId);

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) return <p className="text-muted-foreground">Memuat...</p>;
  if (!assignment) return <p className="text-destructive">Tugas tidak ditemukan.</p>;

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) return;
    try {
      await upload.mutateAsync(file);
      setFile(null);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload gagal');
    }
  }

  return (
    <div className="space-y-5">
      <Link href={`/courses/${id}`} className="text-sm text-muted-foreground hover:underline">
        ← Kembali ke kelas
      </Link>

      <div>
        <h1 className="text-2xl font-bold">{assignment.title}</h1>
        <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{assignment.instructions}</p>
      </div>

      <Card className="space-y-1 bg-muted/40 text-sm">
        <p>
          <span className="font-medium">Jenis file diizinkan:</span> {assignment.allowedTypes}
        </p>
        <p>
          <span className="font-medium">Ukuran maksimal:</span> {assignment.maxSizeMb} MB
        </p>
        <p>
          <span className="font-medium">Batas waktu:</span> {formatDeadline(assignment.deadline)}
        </p>
      </Card>

      {isGuru ? (
        <Link href={`/guru/courses/${id}/tugas/${assignmentId}`}>
          <Button variant="outline" size="sm">Lihat &amp; Nilai Pengumpulan</Button>
        </Link>
      ) : (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Pengumpulan Anda</h2>

          {mine ? (
            <Card className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <a
                  href={`/api/submissions/${mine.id}/file`}
                  className="text-sm font-medium underline"
                >
                  {mine.fileName}
                </a>
                {mine.grade != null ? (
                  <Badge variant="success">Nilai: {mine.grade}</Badge>
                ) : (
                  <Badge variant="warning">Belum dinilai</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Dikumpulkan: {new Date(mine.submittedAt).toLocaleString('id-ID')}
              </p>
              {mine.feedback && (
                <p className="text-sm">
                  <span className="font-medium">Umpan balik guru: </span>
                  {mine.feedback}
                </p>
              )}
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada file yang dikumpulkan.</p>
          )}

          <form onSubmit={handleUpload} className="space-y-3">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-border file:bg-background file:px-3 file:py-1.5 file:text-sm"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={!file || upload.isPending}>
              {upload.isPending ? 'Mengunggah...' : mine ? 'Ganti File' : 'Unggah File'}
            </Button>
          </form>
        </section>
      )}
    </div>
  );
}
