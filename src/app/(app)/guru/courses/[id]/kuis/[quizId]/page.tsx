'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  useAddQuestion,
  useAttempts,
  useDeleteQuestion,
  useQuiz,
} from '@/hooks/use-quizzes';
import { QuestionBuilder } from '@/components/features/quiz/question-builder';
import { AttemptGrader } from '@/components/features/quiz/attempt-grader';
import { Badge, Button, Card } from '@/components/ui';

export default function ManageQuizPage() {
  const { id, quizId } = useParams<{ id: string; quizId: string }>();
  const { data: quiz, isLoading } = useQuiz(id, quizId);
  const addQuestion = useAddQuestion(id, quizId);
  const deleteQuestion = useDeleteQuestion(id, quizId);
  const { data: attempts } = useAttempts(id, quizId);

  if (isLoading) return <p className="text-muted-foreground">Memuat...</p>;
  if (!quiz) return <p className="text-destructive">Kuis tidak ditemukan.</p>;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/guru/courses/${id}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Kembali ke kelas
        </Link>
        <h1 className="mt-1 text-2xl font-bold">{quiz.title}</h1>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Soal ({quiz.questions.length})</h2>
        {quiz.questions.map((q, i) => (
          <Card key={q.id} className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">
                {i + 1}. {q.text}
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <Badge>{q.type === 'PG' ? 'PG' : 'Esai'} · {q.points}</Badge>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteQuestion.mutate(q.id)}
                >
                  Hapus
                </Button>
              </div>
            </div>
            {q.type === 'PG' && (
              <ul className="space-y-1 text-sm">
                {q.choices.map((c) => (
                  <li
                    key={c.id}
                    className={c.isCorrect ? 'font-medium text-green-700' : 'text-muted-foreground'}
                  >
                    {c.label}. {c.text} {c.isCorrect && '✓ (kunci)'}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}

        <div className="pt-2">
          <h3 className="mb-2 text-sm font-semibold">Tambah Soal Baru</h3>
          <QuestionBuilder
            pending={addQuestion.isPending}
            onAdd={async (payload) => {
              await addQuestion.mutateAsync(payload);
            }}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Hasil Pengerjaan Siswa ({attempts?.items.length ?? 0})
        </h2>
        {attempts && attempts.items.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada siswa yang mengerjakan.</p>
        )}
        {attempts?.items.map((a) => (
          <AttemptGrader key={a.id} courseId={id} quizId={quizId} attempt={a} />
        ))}
      </section>
    </div>
  );
}
