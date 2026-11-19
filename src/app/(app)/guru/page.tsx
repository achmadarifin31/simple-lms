'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCourses, useCreateCourse } from '@/hooks/use-courses';
import { CourseForm } from '@/components/features/courses/course-form';
import { Badge, Button, Card } from '@/components/ui';

export default function GuruDashboardPage() {
  const { data, isLoading } = useCourses();
  const createCourse = useCreateCourse();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-light p-6 text-white shadow-md">
        <div>
          <h1 className="text-2xl font-bold">Kelola Kelas</h1>
          <p className="mt-1 text-sm text-white/90">Buat dan atur kelas digital Anda.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowForm((s) => !s)}
          className="border-white/40 bg-white/15 text-white hover:bg-white/25"
        >
          {showForm ? 'Tutup' : '+ Kelas Baru'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <h2 className="mb-4 font-semibold">Kelas Baru</h2>
          <CourseForm
            submitLabel="Buat Kelas"
            pending={createCourse.isPending}
            onSubmit={async (values) => {
              await createCourse.mutateAsync(values);
              setShowForm(false);
            }}
          />
        </Card>
      )}

      {isLoading && <p className="text-muted-foreground">Memuat...</p>}

      <div className="space-y-3">
        {data?.items.map((c) => (
          <Card key={c.id} className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{c.title}</p>
                {!c.published && <Badge variant="warning">Draf</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">
                {c._count.modules} materi · {c._count.quizzes} kuis · {c._count.assignments} tugas
              </p>
            </div>
            <Link href={`/guru/courses/${c.id}`}>
              <Button variant="outline" size="sm">Kelola</Button>
            </Link>
          </Card>
        ))}
        {data && data.items.length === 0 && (
          <p className="text-muted-foreground">Belum ada kelas. Buat kelas pertama Anda.</p>
        )}
      </div>
    </div>
  );
}
