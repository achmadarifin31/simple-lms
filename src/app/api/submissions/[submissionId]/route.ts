import type { NextRequest } from 'next/server';
import { submissionService } from '@/server/services/submission.service';
import { ok, handleError } from '@/server/lib/api-response';
import { requireRole } from '@/server/middleware/with-role';
import { parseBody } from '@/server/middleware/with-validation';
import { gradeSubmissionSchema } from '@/server/types/assignment.types';

type Params = { params: Promise<{ submissionId: string }> };

/** PATCH — GURU grades a submission (grade + feedback). */
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireRole('GURU');
    const { submissionId } = await params;
    const body = await parseBody(req, gradeSubmissionSchema);
    const submission = await submissionService.grade(submissionId, body);
    return ok(submission);
  } catch (err) {
    return handleError(err);
  }
}
