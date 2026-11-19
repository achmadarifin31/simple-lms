import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/shared/providers';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { template: '%s | App', default: 'App' },
  description: 'Your application description',
};

/**
 * Root layout — wraps every page.
 * Client providers (TanStack Query, auth session) live in <Providers>
 * so this file stays a Server Component.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
