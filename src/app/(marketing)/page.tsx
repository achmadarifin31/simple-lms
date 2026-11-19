import Link from 'next/link';

/**
 * Public landing page — no auth required.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div>
        <h1 className="text-4xl font-bold">LMS Keluarga Awal Kehidupan</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Kelas digital untuk belajar materi, mengerjakan kuis, dan mengumpulkan tugas —
          dapat diakses dari perangkat apa pun.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="inline-flex h-10 items-center rounded-md bg-foreground px-5 text-sm font-medium text-background hover:opacity-90"
        >
          Masuk
        </Link>
        <Link
          href="/register"
          className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium hover:bg-muted"
        >
          Daftar Siswa
        </Link>
      </div>
    </main>
  );
}
