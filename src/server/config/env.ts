import { z } from 'zod';

/**
 * Env validation — validated at startup.
 * App crashes immediately if anything required is missing.
 * Never import this in client-side code (files without 'server' in path
 * or outside src/server/). Use src/lib/config.ts for public env vars.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(16, 'NEXTAUTH_SECRET must be at least 16 chars'),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
