import type { NextRequest } from 'next/server';
import { assignmentService } from '@/server/services/assignment.service';
import { ok, handleError } from '@/server/lib/api-response';
import { requireAuth } from '@/server/middleware/with-auth';
import { requireRole } from '@/server/middleware/with-role';
import { parseBody } from '@/server/middleware/with-validation';
import { updateAssignmentSchema } from '@/server/types/assignment.types';

type Params = { params: Promise<{ id: string; assignmentId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await requireAuth(req);
    const { assignmentId } = await params;
    const assignment = await assignmentService.getById(assignmentId);
    return ok(assignment);
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireRole('GURU');
    const { assignmentId } = await params;
    const body = await parseBody(req, updateAssignmentSchema);
    const assignment = await assignmentService.update(assignmentId, body);
    return ok(assignment);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireRole('GURU');
    const { assignmentId } = await params;
    await assignmentService.delete(assignmentId);
    return ok({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
