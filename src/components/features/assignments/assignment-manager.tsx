'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCreateAssignment, useDeleteAssignment } from '@/hooks/use-assignments';
import { Button, Card, Field, Input, Textarea } from '@/components/ui';
import type { AssignmentItem } from '@/lib/lms-types';

export function AssignmentManager({
  courseId,
  assignments,
}: {
  courseId: string;
  assignments: AssignmentItem[];
}) {
  const create = useCreateAssignment(courseId);
  const remove = useDeleteAssignment(courseId);
  const [form, setForm] = useState({
    title: '',
    instructions: '',
    allowedTypes: 'pdf,docx',
    maxSizeMb: 4,
    deadline: '',
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await create.mutateAsync({
      title: form.title,
      instructions: form.instructions,
      allowedTypes: form.allowedTypes,
      maxSizeMb: Number(form.maxSizeMb),
      deadline: form.deadline || undefined,
    });
    setForm({ title: '', instructions: '', allowedTypes: 'pdf,docx', maxSizeMb: 4, deadline: '' });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {assignments.map((a) => (
          <Card key={a.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{a.title}</p>
              <p className="text-xs text-muted-foreground">
                {a.allowedTypes} · maks {a.maxSizeMb}MB
                {a._count ? ` · ${a._count.submissions} pengumpulan` : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/guru/courses/${courseId}/tugas/${a.id}`}>
                <Button variant="outline" size="sm">Pengumpulan</Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => remove.mutate(a.id)}
                disabled={remove.isPending}
              >
                Hapus
              </Button>
            </div>
          </Card>
        ))}
        {assignments.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada tugas.</p>
        )}
      </div>

      <Card>
        <form onSubmit={handleCreate} className="space-y-3">
          <Field label="Judul Tugas">
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </Field>
          <Field label="Petunjuk Pengerjaan">
            <Textarea
              className="min-h-[120px]"
              value={form.instructions}
              onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
              required
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Tipe diizinkan" hint="pisah koma">
              <Input
                value={form.allowedTypes}
                onChange={(e) => setForm((f) => ({ ...f, allowedTypes: e.target.value }))}
              />
            </Field>
            <Field label="Maks (MB)">
              <Input
                type="number"
                min={1}
                value={form.maxSizeMb}
                onChange={(e) => setForm((f) => ({ ...f, maxSizeMb: Number(e.target.value) }))}
              />
            </Field>
            <Field label="Deadline" hint="Opsional">
              <Input
                type="datetime-local"
                value={form.deadline}
                onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
              />
            </Field>
          </div>
          <Button type="submit" size="sm" disabled={create.isPending}>
            Tambah Tugas
          </Button>
        </form>
      </Card>
    </div>
  );
}
