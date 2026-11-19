import { NextResponse } from 'next/server';

/**
 * Health + deploy/env diagnostic. Reports only booleans (presence), never the
 * secret values. `build` lets us confirm which code version is live.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    build: 'authfix-2',
    time: new Date().toISOString(),
    env: {
      AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
      NEXTAUTH_SECRET: Boolean(process.env.NEXTAUTH_SECRET),
      DATABASE_URL: Boolean(process.env.DATABASE_URL),
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? null,
    },
  });
}
