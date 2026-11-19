'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

/**
 * Client-side providers wrapper.
 * Lives here so the root layout stays a Server Component.
 * Add more providers (theme, toast, etc.) here as needed.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient inside component so each request gets its own instance
  // during SSR (prevents data leaking between users).
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
