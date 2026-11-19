'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCourse, useUpdateCourse } from '@/hooks/use-courses';
import { CourseForm } from '@/components/features/courses/course-form';
import { AnnouncementManager } from '@/components/features/announcements/announcement-manager';
import { ModuleManager } from '@/components/features/modules/module-manager';
import { QuizManager } from '@/components/features/quiz/quiz-manager';
import { AssignmentManager } from '@/components/features/assignments/assignment-manager';
import { cn } from '@/lib/utils';

const TABS = ['Deskripsi', 'Pengumuman', 'Materi', 'Kuis', 'Tugas'] as const;
type Tab = (typeof TABS)[number];

export default function ManageCoursePage() {
  const { id } = useParams<{ id: string }>();
  const { data: course, isLoading } = useCourse(id);
  const update = useUpdateCourse(id);
  const [tab, setTab] = useState<Tab>('Deskripsi');
  const [saved, setSaved] = useState(false);

  if (isLoading) return <p className="text-muted-foreground">Memuat...</p>;
  if (!course) return <p className="text-destructive">Kelas tidak ditemukan.</p>;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/guru" className="text-sm text-muted-foreground hover:underline">
          ← Semua kelas
        </Link>
        <h1 className="mt-1 text-2xl font-bold">{course.title}</h1>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              '-mb-px border-b-2 px-3 py-2 text-sm font-medium',
              tab === t
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Deskripsi' && (
        <div className="space-y-3">
          <CourseForm
            initial={{
              title: course.title,
              description: course.description,
              capaian: course.capaian ?? undefined,
              penilaian: course.penilaian ?? undefined,
            }}
            submitLabel="Simpan Perubahan"
            pending={update.isPending}
            onSubmit={async (values) => {
              await update.mutateAsync(values);
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
          />
          {saved && <p className="text-sm text-green-700">Tersimpan ✓</p>}
        </div>
      )}
      {tab === 'Pengumuman' && (
        <AnnouncementManager courseId={id} announcements={course.announcements} />
      )}
      {tab === 'Materi' && <ModuleManager courseId={id} modules={course.modules} />}
      {tab === 'Kuis' && <QuizManager courseId={id} quizzes={course.quizzes} />}
      {tab === 'Tugas' && (
        <AssignmentManager courseId={id} assignments={course.assignments} />
      )}
    </div>
  );
}
