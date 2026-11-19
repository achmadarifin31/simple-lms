import type { NextRequest } from 'next/server';
import { submissionService } from '@/server/services/submission.service';
import { ok, created, handleError } from '@/server/lib/api-response';
import { requireAuth } from '@/server/middleware/with-auth';
import { requireRole } from '@/server/middleware/with-role';
import { AppError } from '@/server/lib/errors';

type Params = { params: Promise<{ id: string; assignmentId: string }> };

/** GET — GURU: all submissions; SISWA: their own submission (or null). */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth(req);
    const { assignmentId } = await params;
    if (session.user.role === 'GURU') {
      const items = await submissionService.listByAssignment(assignmentId);
      return ok({ items });
    }
    const mine = await submissionService.mySubmission(assignmentId, session.user.id);
    return ok(mine);
  } catch (err) {
    return handleError(err);
  }
}

/** POST — SISWA uploads a file (multipart/form-data, field name "file"). */
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await requireRole('SISWA');
    const { assignmentId } = await params;

    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      throw new AppError(400, 'File tidak ditemukan pada field "file"', 'VALIDATION_ERROR');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const submission = await submissionService.submit({
      assignmentId,
      studentId: session.user.id,
      fileName: file.name,
      fileMime: file.type || 'application/octet-stream',
      buffer,
    });
    return created(submission);
  } catch (err) {
    return handleError(err);
  }
}
