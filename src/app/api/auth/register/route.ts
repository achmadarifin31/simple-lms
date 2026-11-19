import type { NextRequest } from 'next/server';
import { authService } from '@/server/services/auth.service';
import { created, handleError } from '@/server/lib/api-response';
import { parseBody } from '@/server/middleware/with-validation';
import { registerSchema } from '@/server/types/auth.types';

/**
 * Public student registration. No auth required.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req, registerSchema);
    const user = await authService.register(body);
    return created(user);
  } catch (err) {
    return handleError(err);
  }
}
