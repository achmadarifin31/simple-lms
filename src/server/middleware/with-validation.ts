import type { NextRequest } from 'next/server';
import type { ZodSchema, output } from 'zod';

/**
 * Parses + validates request body against a Zod schema.
 * Throws ZodError on failure — caught by handleError() in the route handler.
 * Returns the schema's OUTPUT type, so `.default()` fields are present.
 *
 * Usage:
 *   const body = await parseBody(req, createUserSchema);
 */
export async function parseBody<S extends ZodSchema>(
  req: NextRequest,
  schema: S
): Promise<output<S>> {
  const json = await req.json();
  return schema.parseAsync(json);
}

/**
 * Parses + validates URL search params against a Zod schema.
 *
 * Usage:
 *   const query = parseQuery(req, listUsersQuerySchema);
 */
export function parseQuery<S extends ZodSchema>(req: NextRequest, schema: S): output<S> {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  return schema.parse(params);
}
