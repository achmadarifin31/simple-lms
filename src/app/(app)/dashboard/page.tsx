import type { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Card } from '@/components/ui';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const session = await auth();
  const isGuru = session?.user.role === 'GURU';

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-light p-8 text-white shadow-md">
        <p className="text-sm/relaxed opacity-90">
          {isGuru ? 'Panel Guru' : 'Ruang Belajar Siswa'}
        </p>
        <h1 className="mt-1 text-3xl font-bold">
          Selamat datang, {session?.user.name} 👋
        </h1>
        <p className="mt-2 max-w-xl text-sm text-white/90">
          {isGuru
            ? 'Kelola kelas digital, materi, soal, tugas, dan pengumuman dari sini.'
            : 'Pelajari materi, kerjakan kuis, dan kumpulkan tugas pada kelas Anda.'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {isGuru && (
          <Link href="/guru">
            <Card className="group h-full border-brand/20 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-light text-lg text-white">
                🛠️
              </div>
              <p className="font-semibold group-hover:text-brand">Kelola Kelas</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Buat/ubah deskripsi course, materi, soal PG &amp; esai, tugas, dan pengumuman.
              </p>
            </Card>
          </Link>
        )}
        <Link href="/courses">
          <Card className="group h-full border-brand/20 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-light text-lg text-white">
              📚
            </div>
            <p className="font-semibold group-hover:text-brand">
              {isGuru ? 'Lihat Kelas' : 'Kelas Saya'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {isGuru
                ? 'Lihat kelas dari sudut pandang keseluruhan.'
                : 'Buka kelas, baca pengumuman & materi, kerjakan kuis dan tugas.'}
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
