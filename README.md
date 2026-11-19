# LMS Keluarga Awal Kehidupan

Learning Management System (LMS) sederhana berbasis web responsif untuk mata pelajaran dengan tema **"Keluarga Awal Kehidupan"**. Aplikasi ini dibangun ulang dari konsep LMS pada laporan pengelolaan kelas digital (aslinya Moodle) menjadi aplikasi custom dengan **Next.js 15 + Prisma + Supabase**.

Guru dapat menyusun kelas lengkap, dan siswa dapat belajar, mengerjakan kuis, serta mengumpulkan tugas — dari perangkat apa pun.

---

## ✨ Fitur

Dua peran dengan login terpisah: **Guru** (menyusun konten) dan **Siswa** (mengikuti kelas).

| # | Fitur | Guru | Siswa |
|---|-------|------|-------|
| 1 | **Deskripsi Course** | Membuat/mengubah deskripsi, capaian pembelajaran, komponen penilaian | Melihat ringkasan kelas |
| 2 | **Materi Pembelajaran** | Menyusun materi modular yang berurutan | Membaca materi per modul |
| 3 | **Soal Pilihan Ganda** | Membuat soal PG (opsi A–D + kunci) dan soal esai | Mengerjakan kuis — **PG dinilai otomatis**, skor tampil langsung |
| 4 | **Tugas Upload File** | Membuat instruksi tugas (tipe file, ukuran maks, deadline), melihat & menilai | Mengunggah file (PDF/DOCX), melihat nilai & umpan balik |
| 5 | **Pengumuman / Panduan** | Membuat pengumuman (bisa disematkan) | Membaca panduan di halaman kelas |

- Soal esai dikumpulkan dan **dinilai manual** oleh guru; skor percobaan kuis dihitung ulang setelah penilaian.
- File tugas disimpan **di dalam database** (`bytea`), sehingga portabel saat deployment.

---

## 🧱 Tech Stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **Prisma 6** ORM
- **Supabase** (PostgreSQL) sebagai database
- **NextAuth v5** (Credentials provider, JWT session + role)
- **TanStack Query** untuk data-fetching sisi klien
- **Tailwind CSS** (tema hijau `#238B45` → `#41AB5D`)
- **Vitest** untuk unit test, **ESLint** + **Prettier**

---

## 🚀 Menjalankan Project

### 1. Prasyarat
- Node.js 22+
- Akun & project **Supabase** (atau PostgreSQL lain)

### 2. Instalasi
```bash
npm install
```

### 3. Konfigurasi environment
Salin `.env.example` → `.env.local`, lalu isi. Minimal:

```env
DATABASE_URL="postgresql://postgres.<ref>:<password>@aws-1-<region>.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.<ref>:<password>@aws-1-<region>.pooler.supabase.com:5432/postgres"
NEXTAUTH_SECRET="<hasil: openssl rand -base64 32>"
AUTH_SECRET="<sama dengan NEXTAUTH_SECRET>"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="LMS Keluarga Awal Kehidupan"
```

`DIRECT_URL` dipakai Prisma untuk migrasi. Di lokal boleh sama dengan `DATABASE_URL` (Session pooler).

> **Catatan Supabase (penting):** host *direct* `db.<ref>.supabase.co` kini **IPv6-only** dan tidak tersambung dari jaringan IPv4. Gunakan **Session Pooler** (`aws-1-<region>.pooler.supabase.com:5432`, user `postgres.<ref>`) seperti contoh di atas — ambil dari dashboard Supabase → *Project Settings → Database → Connection string → Session pooler*.
>
> `DATABASE_URL` perlu ada di **`.env.local`** (dibaca oleh Next.js) **dan `.env`** (dibaca oleh Prisma CLI).

### 4. Migrasi & seed database
```bash
npm run db:migrate   # menerapkan skema (prisma migrate dev)
npm run db:seed      # mengisi akun + kelas "Keluarga Awal Kehidupan"
```

### 5. Jalankan
```bash
npm run dev          # http://localhost:3000
```

### Akun demo (hasil seed)
| Peran | Email | Password |
|-------|-------|----------|
| Guru | `guru@lms.test` | `password123` |
| Siswa | `siswa@lms.test` | `password123` |

Siswa baru juga bisa mendaftar sendiri melalui halaman **Daftar**.

---

## 🧰 Scripts

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Menjalankan dev server |
| `npm run build` / `npm start` | Build & serve produksi |
| `npm run typecheck` | Pengecekan tipe TypeScript |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm test` / `npm run test:watch` | Unit test (Vitest) |
| `npm run db:migrate` | Migrasi dev Prisma |
| `npm run db:migrate:deploy` | Migrasi produksi |
| `npm run db:generate` | Regenerasi Prisma Client |
| `npm run db:seed` | Seed data |
| `npm run db:studio` | Prisma Studio |

---

## 🏗️ Arsitektur

### Backend — alur 4 lapis
Setiap request API mengalir: **Route Handler → Service → Repository → Prisma**.

- **Route Handler** (`src/app/api/**/route.ts`) — tipis: autentikasi → validasi (Zod) → panggil service → bentuk respons → `handleError`.
- **Service** (`src/server/services/*.ts`) — logika bisnis, tanpa dependensi HTTP (mis. auto-grading kuis di `quiz.grading.ts`, murni & teruji).
- **Repository** (`src/server/repositories/*.ts`) — satu-satunya lapisan yang menyentuh database.
- **Types** (`src/server/types/*.ts`) — skema Zod + tipe TS turunannya.

Helper lintas-potong: `src/server/lib/` (`api-response.ts`, `errors.ts`, `prisma.ts`, `logger.ts`) dan guard `src/server/middleware/` (`with-auth.ts`, `with-role.ts`, `with-validation.ts`).

### Frontend — alur data
**Komponen → hook fitur → `apiClient` → `/api`**. Komponen tidak pernah memanggil `fetch`/`apiClient` langsung; hook (`src/hooks/use-*.ts`) memegang query key, query, mutation, dan invalidasi cache.

Route group: `(auth)` publik (login/daftar), `(app)` terproteksi, `(app)/guru` khusus role GURU. Autentikasi memakai NextAuth v5 dengan konfigurasi *edge-safe* terpisah (`src/lib/auth.config.ts`) untuk middleware dan konfigurasi penuh (`src/lib/auth.ts`) untuk runtime Node.

### Model data (Prisma)
`User` (role GURU/SISWA) · `Course` · `Announcement` · `Module` · `Quiz` → `Question` → `Choice` · `QuizAttempt` → `Answer` · `Assignment` → `Submission` (file sebagai `bytea`). Lihat `prisma/schema.prisma`.

---

## 📂 Struktur Ringkas
```
src/
  app/
    (auth)/            login, register
    (app)/             dashboard, courses/* (siswa), guru/* (guru)
    api/               route handlers (courses, quizzes, assignments, dst.)
  components/
    ui.tsx             primitive UI
    features/          komponen per fitur (courses, quiz, assignments, ...)
    shared/            providers, navigasi
  hooks/               TanStack Query per fitur
  lib/                 auth, api-client, tipe, util
  server/              config, lib, middleware, repositories, services, types
prisma/
  schema.prisma        model data
  seed.ts              akun + kelas "Keluarga Awal Kehidupan" (10 PG + 5 esai)
tailwind.config.ts     konfigurasi Tailwind (termasuk palet brand hijau)
postcss.config.mjs     mengaktifkan Tailwind + Autoprefixer (WAJIB — tanpa ini styling tidak ter-render)
```

---

## ✅ Testing
```bash
npm run typecheck && npm run lint && npm test
```
Unit test fokus pada logika auto-grading kuis (`src/server/services/quiz.grading.test.ts`) dan validasi skema. CI (`.github/workflows/ci.yml`) menjalankan `prisma generate → typecheck → lint → test` pada setiap push ke `main` dan PR.

---

## ▲ Deploy ke Vercel

Project sudah disiapkan untuk Vercel: `build` menjalankan `prisma generate && next build`, ada `postinstall` untuk regenerasi Prisma Client, dan `schema.prisma` memakai `directUrl`.

1. **Push ke GitHub**, lalu import repo di [vercel.com/new](https://vercel.com/new) (framework terdeteksi Next.js).
2. **Set Environment Variables** (Production) di Vercel:
   - `DATABASE_URL` → **Transaction pooler** Supabase (`...pooler.supabase.com:6543/postgres?pgbouncer=true`)
   - `DIRECT_URL` → **Session pooler** (`...pooler.supabase.com:5432/postgres`)
   - `NEXTAUTH_SECRET` dan `AUTH_SECRET` (nilai sama, `openssl rand -base64 32`)
   - `NEXTAUTH_URL` → URL produksi (mis. `https://<proyek>.vercel.app`)
   - `AUTH_TRUST_HOST=true`
   - `NEXT_PUBLIC_APP_NAME`
3. **Deploy.** Setelah domain final didapat, perbarui `NEXTAUTH_URL` lalu redeploy.
4. Migrasi berikutnya dijalankan dari lokal: `npm run db:migrate:deploy` (memakai `DIRECT_URL`).

> **Batas upload:** fungsi serverless Vercel membatasi body request ±4.5 MB, karena itu `maxSizeMb` tugas default **4 MB**. Untuk file lebih besar, pindahkan penyimpanan ke Supabase Storage (saat ini file disimpan sebagai `bytea` di database).

## 🧪 Troubleshooting

- **Tampilan tanpa styling (Tailwind tidak jalan).** Pastikan `postcss.config.mjs` ada di root — Tailwind v3 butuh konfigurasi PostCSS agar Next.js memprosesnya. Tanpa file ini, CSS hasil build sangat kecil dan tidak ada utility (warna/gradient/spacing). Setelah menambah/mengubahnya, hentikan dev server lalu `npm run dev` ulang.
- **Perubahan UI tidak muncul / port bukan 3000.** Jika terminal menampilkan `http://localhost:3001`, berarti port 3000 masih dipakai server dev lama yang menyajikan hasil compile basi. Hentikan semua dev server dulu (`npx kill-port 3000 3001`), jalankan ulang, lalu hard refresh browser (`Ctrl+Shift+R`).
- **`P1001 Can't reach database server`.** Anda memakai host Supabase *direct* (IPv6-only). Ganti ke **Session Pooler** (lihat bagian konfigurasi environment).

## 📌 Catatan
- Bagian **hosting/deployment** belum disertakan (database sudah di cloud/Supabase). Saat deploy serverless, gunakan **Transaction Pooler** (`:6543?pgbouncer=true`) sebagai `url` dan Session Pooler sebagai `directUrl` di `schema.prisma`.
- Bank soal awal diambil dari `soal.txt`; materi & soal bertema "Keluarga Awal Kehidupan".
