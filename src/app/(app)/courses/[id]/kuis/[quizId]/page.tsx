'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { QuizPlayer } from '@/components/features/quiz/quiz-player';
import { Button, Card } from '@/components/ui';

export default function KuisPage() {
  const { id, quizId } = useParams<{ id: string; quizId: string }>();
  const { data: session } = useSession();

  return (
    <div className="space-y-4">
      <Link href={`/courses/${id}`} className="text-sm text-muted-foreground hover:underline">
        ← Kembali ke kelas
      </Link>

      {session?.user?.role === 'GURU' ? (
        <Card className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Anda masuk sebagai guru. Kelola soal &amp; nilai jawaban esai di halaman kelola kuis.
          </p>
          <Link href={`/guru/courses/${id}/kuis/${quizId}`}>
            <Button variant="outline" size="sm">Kelola Kuis</Button>
          </Link>
        </Card>
      ) : (
        <QuizPlayer courseId={id} quizId={quizId} />
      )}
    </div>
  );
}
