import { PrismaClient, type Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PG: { text: string; choices: [string, string, string, string]; key: 0 | 1 | 2 | 3 }[] = [
  {
    text: 'Keluarga disebut sebagai awal kehidupan karena...',
    choices: ['Tempat pertama manusia belajar', 'Tempat bermain dengan teman', 'Tempat mencari uang', 'Tempat liburan'],
    key: 0,
  },
  {
    text: 'Yang termasuk keluarga inti adalah...',
    choices: ['Ayah, Ibu, Anak, Kakek', 'Ayah, Ibu, Anak', 'Ayah, Paman, Bibi', 'Kakek, Nenek, Sepupu'],
    key: 1,
  },
  {
    text: 'Fungsi keluarga dalam memberikan kasih sayang disebut fungsi...',
    choices: ['Ekonomi', 'Reproduksi', 'Afeksi', 'Sosialisasi'],
    key: 2,
  },
  {
    text: 'Contoh fungsi ekonomi dalam keluarga adalah...',
    choices: ['Ayah membelikan buku dan seragam sekolah', 'Ibu memeluk anak yang sedih', 'Ayah mengajarkan sholat', 'Ibu menasihati anak agar jujur'],
    key: 0,
  },
  {
    text: 'Peran anak dalam keluarga adalah...',
    choices: ['Mencari nafkah utama', 'Memimpin keluarga', 'Berbakti dan belajar dengan rajin', 'Mengatur keuangan keluarga'],
    key: 2,
  },
  {
    text: 'Keluarga besar terdiri dari...',
    choices: ['Hanya Ayah dan Ibu', 'Ayah, Ibu, Anak + Kakek, Nenek, Paman', 'Hanya Anak saja', 'Teman sekolah'],
    key: 1,
  },
  {
    text: 'Tempat pertama anak belajar sopan santun adalah...',
    choices: ['Sekolah', 'Masyarakat', 'Keluarga', 'Media sosial'],
    key: 2,
  },
  {
    text: 'Berikut ini yang BUKAN fungsi keluarga adalah...',
    choices: ['Memberi perlindungan', 'Memberi pendidikan', 'Memberi hukuman berat', 'Memberi kasih sayang'],
    key: 2,
  },
  {
    text: 'Kepala keluarga umumnya adalah...',
    choices: ['Anak sulung', 'Ibu', 'Ayah', 'Kakek'],
    key: 2,
  },
  {
    text: 'Jika keluarga harmonis, maka anak akan tumbuh menjadi...',
    choices: ['Pemalas dan pemarah', 'Percaya diri dan berkarakter baik', 'Suka melawan orang tua', 'Tidak peduli lingkungan'],
    key: 1,
  },
];

const ESSAYS = [
  'Jelaskan mengapa keluarga disebut sebagai lingkungan pertama bagi kehidupan manusia!',
  'Sebutkan 4 fungsi keluarga beserta 1 contohnya!',
  'Apa perbedaan keluarga inti dan keluarga besar? Berikan contohnya!',
  'Apa yang harus dilakukan seorang anak agar keluarganya harmonis?',
  'Menurutmu, mengapa semangat positif harus dibangun dari keluarga?',
];

const LABELS = ['A', 'B', 'C', 'D'];

function questionData(): Prisma.QuestionCreateWithoutQuizInput[] {
  const pg: Prisma.QuestionCreateWithoutQuizInput[] = PG.map((q, i) => ({
    type: 'PG',
    text: q.text,
    points: 10,
    order: i + 1,
    choices: {
      create: q.choices.map((text, idx) => ({
        label: LABELS[idx],
        text,
        isCorrect: idx === q.key,
      })),
    },
  }));

  const essays: Prisma.QuestionCreateWithoutQuizInput[] = ESSAYS.map((text, i) => ({
    type: 'ESSAY',
    text,
    points: 20,
    order: PG.length + i + 1,
  }));

  return [...pg, ...essays];
}

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const guru = await prisma.user.upsert({
    where: { email: 'guru@lms.test' },
    update: { role: 'GURU', password: passwordHash, name: 'Fatimah, S.Pd., M.Pd.' },
    create: {
      email: 'guru@lms.test',
      name: 'Fatimah, S.Pd., M.Pd.',
      password: passwordHash,
      role: 'GURU',
    },
  });

  await prisma.user.upsert({
    where: { email: 'siswa@lms.test' },
    update: { role: 'SISWA', password: passwordHash, name: 'Budi Siswa' },
    create: {
      email: 'siswa@lms.test',
      name: 'Budi Siswa',
      password: passwordHash,
      role: 'SISWA',
    },
  });

  // Re-seed the course from scratch (cascade removes old children).
  const slug = 'keluarga-awal-kehidupan';
  const existing = await prisma.course.findUnique({ where: { slug } });
  if (existing) await prisma.course.delete({ where: { id: existing.id } });

  await prisma.course.create({
    data: {
      title: 'Keluarga Awal Kehidupan',
      slug,
      description:
        'Kelas ini membahas keluarga sebagai lingkungan pertama kehidupan manusia: pengertian, jenis (inti & besar), fungsi, peran anggota keluarga, serta pentingnya keluarga yang harmonis.',
      capaian:
        'Peserta didik mampu menjelaskan pengertian keluarga, membedakan keluarga inti dan keluarga besar, mengidentifikasi fungsi keluarga, serta memahami peran tiap anggota keluarga.',
      penilaian: 'Kehadiran & Keaktifan (20%), Kuis Pilihan Ganda (30%), Tugas (50%).',
      published: true,
      teacher: { connect: { id: guru.id } },
      announcements: {
        create: {
          title: 'Panduan Penggunaan Kelas Digital',
          pinned: true,
          content:
            'Selamat datang di Kelas Digital "Keluarga Awal Kehidupan"!\n\n' +
            'Agar belajar lancar dari perangkat apa pun (HP/Laptop), ikuti panduan berikut:\n' +
            '1. Lengkapi profil Anda sesuai data absensi kelas.\n' +
            '2. Pelajari MATERI terlebih dahulu sebelum mengerjakan KUIS dan TUGAS.\n' +
            '3. Unggah file tugas sesuai format dan batas waktu yang ditentukan.\n' +
            '4. Gunakan pengumuman ini sebagai rujukan jika mengalami kendala.',
        },
      },
      modules: {
        create: [
          {
            title: 'Pengertian Keluarga sebagai Awal Kehidupan',
            order: 1,
            content:
              'Keluarga adalah lingkungan pertama tempat manusia lahir dan tumbuh. Di keluarga, anak pertama kali belajar berbicara, berjalan, bersikap sopan, dan mengenal nilai-nilai kehidupan. Karena itu keluarga disebut sebagai awal kehidupan.',
          },
          {
            title: 'Keluarga Inti dan Keluarga Besar',
            order: 2,
            content:
              'Keluarga inti terdiri dari Ayah, Ibu, dan Anak. Keluarga besar adalah keluarga inti ditambah kerabat lain seperti Kakek, Nenek, Paman, Bibi, dan Sepupu.',
          },
          {
            title: 'Fungsi-Fungsi Keluarga',
            order: 3,
            content:
              'Beberapa fungsi keluarga: (1) Reproduksi — melanjutkan keturunan; (2) Ekonomi — memenuhi kebutuhan, mis. membelikan buku & seragam; (3) Sosialisasi — mengajarkan nilai dan aturan; (4) Afeksi — memberi kasih sayang dan perlindungan.',
          },
          {
            title: 'Peran Anggota Keluarga & Keluarga Harmonis',
            order: 4,
            content:
              'Ayah umumnya kepala keluarga, Ibu merawat dan mendidik, Anak berbakti serta rajin belajar. Keluarga yang harmonis membuat anak tumbuh percaya diri dan berkarakter baik.',
          },
        ],
      },
      quizzes: {
        create: {
          title: 'Kuis Keluarga Awal Kehidupan',
          description: '10 soal pilihan ganda (otomatis) dan 5 soal esai (dinilai guru).',
          questions: { create: questionData() },
        },
      },
      assignments: {
        create: {
          title: 'Tugas 1 — Ringkasan Materi Keluarga',
          instructions:
            'Buatlah ringkasan materi mengenai fungsi keluarga dalam kehidupan sehari-hari minimal 1 halaman.\n' +
            'Cantumkan identitas lengkap (Nama, Kelas, Nomor Absen) di bagian atas dokumen.\n' +
            'Simpan dengan format penamaan: Kelas_NamaLengkap_Tugas1.pdf',
          allowedTypes: 'pdf,docx',
          maxSizeMb: 4,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  console.log('Seed complete:');
  console.log('  Guru : guru@lms.test  / password123');
  console.log('  Siswa: siswa@lms.test / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
