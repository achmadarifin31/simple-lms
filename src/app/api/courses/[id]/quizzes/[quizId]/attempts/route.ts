import type { NextRequest } from 'next/server';
import { quizService } from '@/server/services/quiz.service';
import { ok, created, handleError } from '@/server/lib/api-response';
import { requireAuth } from '@/server/middleware/with-auth';
import { requireRole } from '@/server/middleware/with-role';
import { parseBody } from '@/server/middleware/with-validation';
import { submitAttemptSchema } from '@/server/types/quiz.types';

type Params = { params: Promise<{ id: string; quizId: string }> };

/**
 * GET — GURU: all attempts for the quiz; SISWA: their own latest attempt.
 */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth(req);
    const { quizId } = await params;
    if (session.user.role === 'GURU') {
      const items = await quizService.listAttempts(quizId);
      return ok({ items });
    }
    const latest = await quizService.latestAttempt(quizId, session.user.id);
    return ok(latest);
  } catch (err) {
    return handleError(err);
  }
}

/** POST — SISWA submits answers; PG auto-graded, essays stored ungraded. */
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await requireRole('SISWA');
    const { quizId } = await params;
    const body = await parseBody(req, submitAttemptSchema);
    const attempt = await quizService.submitAttempt(quizId, session.user.id, body);
    return created(attempt);
  } catch (err) {
    return handleError(err);
  }
}
