import { env } from '../config/env';

type Level = 'debug' | 'info' | 'warn' | 'error';
const order: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 };

function log(level: Level, msg: string, meta?: Record<string, unknown>) {
  if (order[level] < order[env.LOG_LEVEL]) return;
  console.log(JSON.stringify({ level, msg, time: new Date().toISOString(), ...meta }));
}

export const logger = {
  debug: (m: string, meta?: Record<string, unknown>) => log('debug', m, meta),
  info: (m: string, meta?: Record<string, unknown>) => log('info', m, meta),
  warn: (m: string, meta?: Record<string, unknown>) => log('warn', m, meta),
  error: (m: string, meta?: Record<string, unknown>) => log('error', m, meta),
};
