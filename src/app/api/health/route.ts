import { NextResponse } from 'next/server';
import { prisma } from '@/server/lib/prisma';

export const runtime = 'nodejs';

/** Lightweight health check: app status + database reachability (boolean only). */
export async function GET() {
  let dbOk = false;
  try {
    await prisma.user.count();
    dbOk = true;
  } catch {
    dbOk = false;
  }

  return NextResponse.json(
    { status: 'ok', db: dbOk ? 'up' : 'down', time: new Date().toISOString() },
    { status: dbOk ? 200 : 503 },
  );
}
