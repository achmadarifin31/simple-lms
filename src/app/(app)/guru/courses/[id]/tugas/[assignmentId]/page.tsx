'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAssignment, useSubmissions } from '@/hooks/use-assignments';
import { SubmissionGrader } from '@/components/features/assignments/submission-grader';

export default function ManageTugasPage() {
  const { id, assignmentId } = useParams<{ id: string; assignmentId: string }>();
  const { data: assignment } = useAssignment(id, assignmentId);
  const { data: submissions, isLoading } = useSubmissions(id, assignmentId);

  return (
    <div className="space-y-5">
      <div>
        <Link
          href={`/guru/courses/${id}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Kembali ke kelas
        </Link>
        <h1 className="mt-1 text-2xl font-bold">{assignment?.title ?? 'Tugas'}</h1>
        <p className="mt-1 text-muted-foreground">
          Pengumpulan siswa ({submissions?.items.length ?? 0})
        </p>
      </div>

      {isLoading && <p className="text-muted-foreground">Memuat...</p>}
      {submissions && submissions.items.length === 0 && (
        <p className="text-muted-foreground">Belum ada pengumpulan.</p>
      )}

      <div className="space-y-3">
        {submissions?.items.map((s) => (
          <SubmissionGrader
            key={s.id}
            courseId={id}
            assignmentId={assignmentId}
            submission={s}
          />
        ))}
      </div>
    </div>
  );
}
