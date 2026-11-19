'use client';

import { useState } from 'react';
import {
  useCreateAnnouncement,
  useDeleteAnnouncement,
} from '@/hooks/use-announcements';
import { Badge, Button, Card, Field, Input, Textarea } from '@/components/ui';
import type { Announcement } from '@/lib/lms-types';

export function AnnouncementManager({
  courseId,
  announcements,
}: {
  courseId: string;
  announcements: Announcement[];
}) {
  const create = useCreateAnnouncement(courseId);
  const remove = useDeleteAnnouncement(courseId);
  const [form, setForm] = useState({ title: '', content: '', pinned: false });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await create.mutateAsync(form);
    setForm({ title: '', content: '', pinned: false });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {announcements.map((a) => (
          <Card key={a.id} className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{a.title}</p>
                {a.pinned && <Badge variant="warning">Disematkan</Badge>}
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{a.content}</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => remove.mutate(a.id)}
              disabled={remove.isPending}
            >
              Hapus
            </Button>
          </Card>
        ))}
        {announcements.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada pengumuman.</p>
        )}
      </div>

      <Card>
        <form onSubmit={handleCreate} className="space-y-3">
          <Field label="Judul Pengumuman">
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </Field>
          <Field label="Isi">
            <Textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              required
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))}
            />
            Sematkan di atas (pinned)
          </label>
          <Button type="submit" size="sm" disabled={create.isPending}>
            Tambah Pengumuman
          </Button>
        </form>
      </Card>
    </div>
  );
}
