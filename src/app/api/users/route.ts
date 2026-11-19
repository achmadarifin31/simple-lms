import type { NextRequest } from 'next/server';
import { userService } from '@/server/services/user.service';
import { ok, created, handleError } from '@/server/lib/api-response';
import { requireAuth } from '@/server/middleware/with-auth';
import { parseBody, parseQuery } from '@/server/middleware/with-validation';
import { createUserSchema, listUsersQuerySchema } from '@/server/types/user.types';

/**
 * ROUTE HANDLER = "route + controller" in Next.js App Router.
 * Framework locks this location: app/api/[resource]/route.ts
 *
 * Keep it THIN — same rule as Hono controllers:
 * parse input → call service → shape response → catch errors.
 * No business logic here.
 */
export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const query = parseQuery(req, listUsersQuerySchema);
    const result = await userService.list(query);
    return ok(result);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    const body = await parseBody(req, createUserSchema);
    const user = await userService.create(body);
    return created(user);
  } catch (err) {
    return handleError(err);
  }
}
