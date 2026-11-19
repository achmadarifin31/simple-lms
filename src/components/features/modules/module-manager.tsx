'use client';

import { useState } from 'react';
import { useCreateModule, useDeleteModule } from '@/hooks/use-modules';
import { Button, Card, Field, Input, Textarea } from '@/components/ui';
import type { ModuleItem } from '@/lib/lms-types';

export function ModuleManager({
  courseId,
  modules,
}: {
  courseId: string;
  modules: ModuleItem[];
}) {
  const create = useCreateModule(courseId);
  const remove = useDeleteModule(courseId);
  const [form, setForm] = useState({ title: '', content: '' });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await create.mutateAsync({ ...form, order: modules.length });
    setForm({ title: '', content: '' });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {modules.map((m, i) => (
          <Card key={m.id} className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium">
                {i + 1}. {m.title}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{m.content}</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => remove.mutate(m.id)}
              disabled={remove.isPending}
            >
              Hapus
            </Button>
          </Card>
        ))}
        {modules.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada materi.</p>
        )}
      </div>

      <Card>
        <form onSubmit={handleCreate} className="space-y-3">
          <Field label="Judul Materi">
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </Field>
          <Field label="Isi Materi">
            <Textarea
              className="min-h-[140px]"
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              required
            />
          </Field>
          <Button type="submit" size="sm" disabled={create.isPending}>
            Tambah Materi
          </Button>
        </form>
      </Card>
    </div>
  );
}
