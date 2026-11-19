import type { NextRequest } from 'next/server';
import { quizService } from '@/server/services/quiz.service';
import { ok, handleError } from '@/server/lib/api-response';
import { requireRole } from '@/server/middleware/with-role';
import { parseBody } from '@/server/middleware/with-validation';
import { gradeEssaysSchema } from '@/server/types/quiz.types';

type Params = { params: Promise<{ id: string; quizId: string; attemptId: string }> };

/** PATCH — GURU grades essay answers; score is recomputed. */
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireRole('GURU');
    const { attemptId } = await params;
    const body = await parseBody(req, gradeEssaysSchema);
    const attempt = await quizService.gradeEssays(attemptId, body);
    return ok(attempt);
  } catch (err) {
    return handleError(err);
  }
}
