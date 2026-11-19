import type { NextRequest } from 'next/server';
import { quizService } from '@/server/services/quiz.service';
import { created, handleError } from '@/server/lib/api-response';
import { requireRole } from '@/server/middleware/with-role';
import { parseBody } from '@/server/middleware/with-validation';
import { createQuestionSchema } from '@/server/types/quiz.types';

type Params = { params: Promise<{ id: string; quizId: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    await requireRole('GURU');
    const { quizId } = await params;
    const body = await parseBody(req, createQuestionSchema);
    const question = await quizService.addQuestion(quizId, body);
    return created(question);
  } catch (err) {
    return handleError(err);
  }
}
