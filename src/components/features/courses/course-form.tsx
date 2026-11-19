'use client';

import { useState } from 'react';
import { Button, Field, Input, Textarea } from '@/components/ui';

export type CourseFormValues = {
  title: string;
  description: string;
  capaian?: string;
  penilaian?: string;
};

export function CourseForm({
  initial,
  submitLabel,
  pending,
  onSubmit,
}: {
  initial?: Partial<CourseFormValues>;
  submitLabel: string;
  pending?: boolean;
  onSubmit: (values: CourseFormValues) => void | Promise<void>;
}) {
  const [values, setValues] = useState<CourseFormValues>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    capaian: initial?.capaian ?? '',
    penilaian: initial?.penilaian ?? '',
  });

  function set<K extends keyof CourseFormValues>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="space-y-4"
    >
      <Field label="Judul Course">
        <Input value={values.title} onChange={set('title')} required />
      </Field>
      <Field label="Deskripsi Singkat">
        <Textarea value={values.description} onChange={set('description')} required />
      </Field>
      <Field label="Capaian Pembelajaran" hint="Opsional">
        <Textarea value={values.capaian} onChange={set('capaian')} />
      </Field>
      <Field label="Komponen Penilaian" hint="Opsional, mis. Kuis 30%, Tugas 50%, Kehadiran 20%">
        <Textarea value={values.penilaian} onChange={set('penilaian')} />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? 'Menyimpan...' : submitLabel}
      </Button>
    </form>
  );
}
