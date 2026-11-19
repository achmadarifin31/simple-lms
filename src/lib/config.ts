/**
 * PUBLIC environment variables — safe to import anywhere including client code.
 * Only put NEXT_PUBLIC_* vars here. Never put secrets here.
 */
export const config = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'App',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL ?? '/api',
} as const;
