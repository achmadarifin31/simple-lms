import { NextResponse } from 'next/server';
import net from 'node:net';
import dns from 'node:dns/promises';
import { prisma } from '@/server/lib/prisma';

export const runtime = 'nodejs';

function dbHost(): { host: string; port: number } | null {
  const raw = process.env.DATABASE_URL;
  if (!raw) return null;
  const normalized = raw.replace(':6543', ':5432');
  try {
    const u = new URL(normalized);
    return { host: u.hostname, port: Number(u.port || 5432) };
  } catch {
    return null;
  }
}

function tcpProbe(host: string, port: number, timeoutMs = 6000): Promise<string> {
  return new Promise((resolve) => {
    const sock = new net.Socket();
    const done = (msg: string) => {
      sock.destroy();
      resolve(msg);
    };
    sock.setTimeout(timeoutMs);
    sock.once('connect', () => done('TCP_OK'));
    sock.once('timeout', () => done('TCP_TIMEOUT'));
    sock.once('error', (e) => done('TCP_ERR:' + (e as Error).message));
    sock.connect(port, host);
  });
}

export async function GET() {
  const target = dbHost();
  let dns4: string[] | string = 'n/a';
  let dns6: string[] | string = 'n/a';
  let tcp = 'n/a';

  // Parsed credentials shape of the normalized DATABASE_URL (NO password shown).
  let dbUser: string | null = null;
  let hasPassword = false;
  let dbParams = '';
  try {
    const u = new URL((process.env.DATABASE_URL ?? '').replace(':6543', ':5432'));
    dbUser = decodeURIComponent(u.username);
    hasPassword = Boolean(u.password);
    dbParams = u.search;
  } catch {
    /* ignore */
  }

  if (target) {
    try {
      dns4 = (await dns.resolve4(target.host)).slice(0, 4);
    } catch (e) {
      dns4 = 'ERR:' + (e as Error).message;
    }
    try {
      dns6 = (await dns.resolve6(target.host)).slice(0, 4);
    } catch (e) {
      dns6 = 'ERR:' + (e as Error).message;
    }
    tcp = await tcpProbe(target.host, target.port);
  }

  let dbOk = false;
  let dbError: string | null = null;
  let dbErrName: string | null = null;
  let dbErrCode: string | null = null;
  try {
    await prisma.user.count();
    dbOk = true;
  } catch (e) {
    const err = e as Error & { errorCode?: string; code?: string };
    dbError = err?.message ?? String(e);
    dbErrName = err?.name ?? null;
    dbErrCode = err?.errorCode ?? err?.code ?? null;
  }

  return NextResponse.json({
    status: 'ok',
    build: 'netprobe-3',
    time: new Date().toISOString(),
    target,
    cred: { dbUser, hasPassword, dbParams },
    dns: { v4: dns4, v6: dns6 },
    tcp,
    db: { ok: dbOk, name: dbErrName, code: dbErrCode, error: dbError },
  });
}
