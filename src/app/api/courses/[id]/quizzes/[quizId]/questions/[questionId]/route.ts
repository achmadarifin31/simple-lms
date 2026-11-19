import type { NextRequest } from 'next/server';
import { quizService } from '@/server/services/quiz.service';
import { ok, handleError } from '@/server/lib/api-response';
import { requireRole } from '@/server/middleware/with-role';
import { parseBody } from '@/server/middleware/with-validation';
import { updateQuestionSchema } from '@/server/types/quiz.types';

type Params = { params: Promise<{ id: string; quizId: string; questionId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireRole('GURU');
    const { questionId } = await params;
    const body = await parseBody(req, updateQuestionSchema);
    const question = await quizService.updateQuestion(questionId, body);
    return ok(question);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireRole('GURU');
    const { questionId } = await params;
    await quizService.deleteQuestion(questionId);
    return ok({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
