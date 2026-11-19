'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCourse } from '@/hooks/use-courses';
import { Badge, Button, Card } from '@/components/ui';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const { data: course, isLoading, isError } = useCourse(id);

  if (isLoading) return <p className="text-muted-foreground">Memuat...</p>;
  if (isError || !course) return <p className="text-destructive">Gagal memuat kelas.</p>;

  const isGuru = session?.user?.role === 'GURU';

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          {isGuru && (
            <Link href={`/guru/courses/${course.id}`}>
              <Button variant="outline" size="sm">Kelola</Button>
            </Link>
          )}
        </div>
        <p className="mt-2 text-muted-foreground">{course.description}</p>
        {course.capaian && (
          <p className="mt-3 text-sm">
            <span className="font-medium">Capaian Pembelajaran: </span>
            {course.capaian}
          </p>
        )}
        {course.penilaian && (
          <p className="mt-1 text-sm">
            <span className="font-medium">Komponen Penilaian: </span>
            {course.penilaian}
          </p>
        )}
      </div>

      {/* Pengumuman */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">📢 Pengumuman &amp; Petunjuk</h2>
        {course.announcements.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada pengumuman.</p>
        )}
        {course.announcements.map((a) => (
          <Card key={a.id} className={a.pinned ? 'border-amber-300 bg-amber-50/50' : ''}>
            <div className="flex items-center gap-2">
              <p className="font-medium">{a.title}</p>
              {a.pinned && <Badge variant="warning">Disematkan</Badge>}
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{a.content}</p>
          </Card>
        ))}
      </section>

      {/* Materi */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">📚 Materi Pembelajaran</h2>
        {course.modules.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada materi.</p>
        )}
        <div className="space-y-2">
          {course.modules.map((m, i) => (
            <Link key={m.id} href={`/courses/${course.id}/materi/${m.id}`}>
              <Card className="flex items-center justify-between transition-colors hover:bg-muted">
                <span className="text-sm font-medium">
                  {i + 1}. {m.title}
                </span>
                <span className="text-sm text-muted-foreground">Buka →</span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Kuis */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">📝 Kuis</h2>
        {course.quizzes.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada kuis.</p>
        )}
        <div className="space-y-2">
          {course.quizzes.map((q) => (
            <Link key={q.id} href={`/courses/${course.id}/kuis/${q.id}`}>
              <Card className="flex items-center justify-between transition-colors hover:bg-muted">
                <span className="text-sm font-medium">{q.title}</span>
                <span className="text-sm text-muted-foreground">
                  {q._count.questions} soal · Kerjakan →
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Tugas */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">📎 Tugas</h2>
        {course.assignments.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada tugas.</p>
        )}
        <div className="space-y-2">
          {course.assignments.map((a) => (
            <Link key={a.id} href={`/courses/${course.id}/tugas/${a.id}`}>
              <Card className="flex items-center justify-between transition-colors hover:bg-muted">
                <span className="text-sm font-medium">{a.title}</span>
                <span className="text-sm text-muted-foreground">Buka →</span>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
