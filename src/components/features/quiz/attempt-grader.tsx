'use client';

import { useState } from 'react';
import { useGradeEssays } from '@/hooks/use-quizzes';
import { Badge, Button, Card, Input } from '@/components/ui';
import type { Attempt } from '@/lib/lms-types';

export function AttemptGrader({
  courseId,
  quizId,
  attempt,
}: {
  courseId: string;
  quizId: string;
  attempt: Attempt;
}) {
  const grade = useGradeEssays(courseId, quizId);
  const essays = attempt.answers.filter((a) => a.question.type === 'ESSAY');
  const [points, setPoints] = useState<Record<string, number>>(
    Object.fromEntries(essays.map((a) => [a.id, a.awardedPoints]))
  );
  const [open, setOpen] = useState(false);

  async function handleSave() {
    await grade.mutateAsync({
      attemptId: attempt.id,
      grades: essays.map((a) => ({ answerId: a.id, awardedPoints: points[a.id] ?? 0 })),
    });
  }

  return (
    <Card className="space-y-2">
      <button
        className="flex w-full items-center justify-between text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-medium">{attempt.student?.name ?? 'Siswa'}</span>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge>{attempt.score} / {attempt.maxScore}</Badge>
          {essays.some((a) => !a.graded) && <Badge variant="warning">Esai perlu dinilai</Badge>}
          {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <div className="space-y-3 border-t border-border pt-3">
          {attempt.answers.map((a) => (
            <div key={a.id} className="text-sm">
              <p className="font-medium">{a.question.text}</p>
              {a.question.type === 'PG' ? (
                <p className="text-muted-foreground">
                  {a.choice ? `${a.choice.label}. ${a.choice.text}` : '(kosong)'} —{' '}
                  {a.isCorrect ? 'Benar' : 'Salah'} ({a.awardedPoints}/{a.question.points})
                </p>
              ) : (
                <div className="mt-1 space-y-1">
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {a.essayText || '(kosong)'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Nilai:</span>
                    <Input
                      type="number"
                      min={0}
                      max={a.question.points}
                      className="h-8 w-20"
                      value={points[a.id] ?? 0}
                      onChange={(e) =>
                        setPoints((p) => ({ ...p, [a.id]: Number(e.target.value) }))
                      }
                    />
                    <span className="text-xs text-muted-foreground">/ {a.question.points}</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {essays.length > 0 && (
            <Button size="sm" onClick={handleSave} disabled={grade.isPending}>
              {grade.isPending ? 'Menyimpan...' : 'Simpan Nilai Esai'}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
