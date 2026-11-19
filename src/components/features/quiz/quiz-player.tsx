'use client';

import { useState } from 'react';
import {
  useMyAttempt,
  useQuiz,
  useSubmitAttempt,
} from '@/hooks/use-quizzes';
import { Badge, Button, Card, Textarea } from '@/components/ui';
import type { Attempt } from '@/lib/lms-types';

export function QuizPlayer({ courseId, quizId }: { courseId: string; quizId: string }) {
  const { data: quiz, isLoading } = useQuiz(courseId, quizId);
  const { data: latest } = useMyAttempt(courseId, quizId);
  const submit = useSubmitAttempt(courseId, quizId);

  const [answers, setAnswers] = useState<Record<string, { choiceId?: string; essayText?: string }>>({});
  const [result, setResult] = useState<Attempt | null>(null);
  const [retaking, setRetaking] = useState(false);

  if (isLoading) return <p className="text-muted-foreground">Memuat...</p>;
  if (!quiz) return <p className="text-destructive">Kuis tidak ditemukan.</p>;

  const effectiveResult = result ?? latest ?? null;
  if (effectiveResult && !retaking) {
    return (
      <ResultView
        attempt={effectiveResult}
        onRetake={() => {
          setRetaking(true);
          setResult(null);
          setAnswers({});
        }}
      />
    );
  }

  async function handleSubmit() {
    if (!quiz) return;
    const payload = quiz.questions.map((q) => ({
      questionId: q.id,
      choiceId: answers[q.id]?.choiceId,
      essayText: answers[q.id]?.essayText,
    }));
    const attempt = await submit.mutateAsync(payload);
    setResult(attempt);
    setRetaking(false);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
        {quiz.description && <p className="mt-1 text-muted-foreground">{quiz.description}</p>}
        <p className="mt-2 text-sm text-muted-foreground">
          {quiz.questions.length} soal · PG dinilai otomatis, esai dinilai guru.
        </p>
      </div>

      {quiz.questions.map((q, i) => (
        <Card key={q.id} className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium">
              {i + 1}. {q.text}
            </p>
            <Badge>{q.type === 'PG' ? 'PG' : 'Esai'} · {q.points} poin</Badge>
          </div>

          {q.type === 'PG' ? (
            <div className="space-y-2">
              {q.choices.map((c) => (
                <label
                  key={c.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-border p-2 text-sm hover:bg-muted"
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id]?.choiceId === c.id}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: { choiceId: c.id } }))}
                  />
                  <span className="font-medium">{c.label}.</span> {c.text}
                </label>
              ))}
            </div>
          ) : (
            <Textarea
              placeholder="Tulis jawaban esai Anda..."
              value={answers[q.id]?.essayText ?? ''}
              onChange={(e) =>
                setAnswers((a) => ({ ...a, [q.id]: { essayText: e.target.value } }))
              }
            />
          )}
        </Card>
      ))}

      {submit.isError && (
        <p className="text-sm text-destructive">Gagal mengirim jawaban. Coba lagi.</p>
      )}
      <Button onClick={handleSubmit} disabled={submit.isPending}>
        {submit.isPending ? 'Mengirim...' : 'Kumpulkan Jawaban'}
      </Button>
    </div>
  );
}

function ResultView({ attempt, onRetake }: { attempt: Attempt; onRetake: () => void }) {
  const essayPending = attempt.answers.some((a) => a.question.type === 'ESSAY' && !a.graded);

  return (
    <div className="space-y-5">
      <Card className="bg-muted/40">
        <p className="text-sm text-muted-foreground">Skor Anda</p>
        <p className="text-3xl font-bold">
          {attempt.score}
          <span className="text-lg font-normal text-muted-foreground"> / {attempt.maxScore}</span>
        </p>
        {essayPending && (
          <p className="mt-2 text-sm text-amber-700">
            Sebagian soal esai masih menunggu penilaian guru.
          </p>
        )}
      </Card>

      <div className="space-y-3">
        {attempt.answers.map((a, i) => (
          <Card key={a.id} className="space-y-1">
            <p className="font-medium">
              {i + 1}. {a.question.text}
            </p>
            {a.question.type === 'PG' ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  Jawaban Anda: {a.choice ? `${a.choice.label}. ${a.choice.text}` : '(kosong)'}
                </span>
                {a.isCorrect ? (
                  <Badge variant="success">Benar</Badge>
                ) : (
                  <Badge variant="warning">Salah</Badge>
                )}
              </div>
            ) : (
              <div className="text-sm">
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {a.essayText || '(kosong)'}
                </p>
                <p className="mt-1 text-xs">
                  {a.graded
                    ? `Nilai: ${a.awardedPoints}/${a.question.points}`
                    : 'Menunggu penilaian guru'}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={onRetake}>
        Kerjakan ulang
      </Button>
    </div>
  );
}
