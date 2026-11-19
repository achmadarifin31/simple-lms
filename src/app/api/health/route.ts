import { NextResponse } from 'next/server';
import { prisma } from '@/server/lib/prisma';

export const runtime = 'nodejs';

/**
 * Health + deploy/env/DB diagnostic. Reports only booleans + error text,
 * never secret values.
 */
export async function GET() {
  let dbOk = false;
  let dbError: string | null = null;
  try {
    await prisma.user.count();
    dbOk = true;
  } catch (e) {
    dbError = e instanceof Error ? e.message.slice(0, 300) : String(e);
  }

  return NextResponse.json({
    status: 'ok',
    build: 'authfix-3',
    time: new Date().toISOString(),
    env: {
      AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
      NEXTAUTH_SECRET: Boolean(process.env.NEXTAUTH_SECRET),
      DATABASE_URL: Boolean(process.env.DATABASE_URL),
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? null,
    },
    db: { ok: dbOk, error: dbError },
  });
}
