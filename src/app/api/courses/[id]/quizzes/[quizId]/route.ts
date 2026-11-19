import type { NextRequest } from 'next/server';
import { quizService } from '@/server/services/quiz.service';
import { ok, handleError } from '@/server/lib/api-response';
import { requireAuth } from '@/server/middleware/with-auth';
import { requireRole } from '@/server/middleware/with-role';
import { parseBody } from '@/server/middleware/with-validation';
import { updateQuizSchema } from '@/server/types/quiz.types';

type Params = { params: Promise<{ id: string; quizId: string }> };

/**
 * GURU gets the full quiz (with answer keys) for editing; SISWA gets the
 * play view with `isCorrect` stripped out.
 */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth(req);
    const { quizId } = await params;
    const quiz =
      session.user.role === 'GURU'
        ? await quizService.getForEdit(quizId)
        : await quizService.getForPlay(quizId);
    return ok(quiz);
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireRole('GURU');
    const { quizId } = await params;
    const body = await parseBody(req, updateQuizSchema);
    const quiz = await quizService.update(quizId, body);
    return ok(quiz);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireRole('GURU');
    const { quizId } = await params;
    await quizService.delete(quizId);
    return ok({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
