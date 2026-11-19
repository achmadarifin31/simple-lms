'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { apiClient } from '@/lib/api-client';
import { Button, Card, Field, Input } from '@/components/ui';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiClient.post('/auth/register', form);
      await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pendaftaran gagal.');
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-bold">Daftar Siswa</h1>
        <p className="mt-1 text-sm text-muted-foreground">Buat akun untuk mengikuti kelas</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Nama Lengkap">
            <Input value={form.name} onChange={update('name')} required />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={update('email')} required />
          </Field>
          <Field label="Password" hint="Minimal 6 karakter">
            <Input
              type="password"
              value={form.password}
              onChange={update('password')}
              required
              minLength={6}
            />
          </Field>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium underline">
            Masuk
          </Link>
        </p>
      </Card>
    </main>
  );
}
