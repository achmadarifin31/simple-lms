'use client';

import { useState } from 'react';
import { useGradeSubmission } from '@/hooks/use-assignments';
import { Badge, Button, Card, Input, Textarea } from '@/components/ui';
import type { SubmissionMeta } from '@/lib/lms-types';

export function SubmissionGrader({
  courseId,
  assignmentId,
  submission,
}: {
  courseId: string;
  assignmentId: string;
  submission: SubmissionMeta;
}) {
  const grade = useGradeSubmission(courseId, assignmentId);
  const [value, setValue] = useState<string>(submission.grade?.toString() ?? '');
  const [feedback, setFeedback] = useState(submission.feedback ?? '');

  async function handleSave() {
    await grade.mutateAsync({
      submissionId: submission.id,
      grade: value === '' ? undefined : Number(value),
      feedback: feedback || undefined,
    });
  }

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-medium">{submission.student?.name ?? 'Siswa'}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(submission.submittedAt).toLocaleString('id-ID')} ·{' '}
            {(submission.fileSize / 1024).toFixed(0)} KB
          </p>
        </div>
        {submission.grade != null ? (
          <Badge variant="success">Nilai: {submission.grade}</Badge>
        ) : (
          <Badge variant="warning">Belum dinilai</Badge>
        )}
      </div>

      <a
        href={`/api/submissions/${submission.id}/file`}
        className="inline-block text-sm font-medium underline"
      >
        ⬇ {submission.fileName}
      </a>

      <div className="grid gap-2 sm:grid-cols-[100px_1fr]">
        <Input
          type="number"
          min={0}
          max={100}
          placeholder="Nilai"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Textarea
          className="min-h-[40px]"
          placeholder="Umpan balik (opsional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>
      <Button size="sm" onClick={handleSave} disabled={grade.isPending}>
        {grade.isPending ? 'Menyimpan...' : 'Simpan Nilai'}
      </Button>
    </Card>
  );
}
