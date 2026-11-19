import type { NextRequest } from 'next/server';
import type { ZodSchema } from 'zod';

/**
 * Parses + validates request body against a Zod schema.
 * Throws ZodError on failure — caught by handleError() in the route handler.
 *
 * Usage:
 *   const body = await parseBody(req, createUserSchema);
 */
export async function parseBody<T>(req: NextRequest, schema: ZodSchema<T>): Promise<T> {
  const json = await req.json();
  return schema.parseAsync(json);
}

/**
 * Parses + validates URL search params against a Zod schema.
 *
 * Usage:
 *   const query = parseQuery(req, listUsersQuerySchema);
 */
export function parseQuery<T>(req: NextRequest, schema: ZodSchema<T>): T {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  return schema.parse(params);
}
