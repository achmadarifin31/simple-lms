'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCreateQuiz } from '@/hooks/use-quizzes';
import { Button, Card, Field, Input, Textarea } from '@/components/ui';
import type { QuizListItem } from '@/lib/lms-types';

export function QuizManager({
  courseId,
  quizzes,
}: {
  courseId: string;
  quizzes: QuizListItem[];
}) {
  const create = useCreateQuiz(courseId);
  const [form, setForm] = useState({ title: '', description: '' });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await create.mutateAsync(form);
    setForm({ title: '', description: '' });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {quizzes.map((q) => (
          <Card key={q.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{q.title}</p>
              <p className="text-xs text-muted-foreground">{q._count.questions} soal</p>
            </div>
            <Link href={`/guru/courses/${courseId}/kuis/${q.id}`}>
              <Button variant="outline" size="sm">Kelola Soal &amp; Nilai</Button>
            </Link>
          </Card>
        ))}
        {quizzes.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada kuis.</p>
        )}
      </div>

      <Card>
        <form onSubmit={handleCreate} className="space-y-3">
          <Field label="Judul Kuis">
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </Field>
          <Field label="Deskripsi" hint="Opsional">
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </Field>
          <Button type="submit" size="sm" disabled={create.isPending}>
            Tambah Kuis
          </Button>
        </form>
      </Card>
    </div>
  );
}
