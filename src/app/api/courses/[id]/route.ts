import type { NextRequest } from 'next/server';
import { courseService } from '@/server/services/course.service';
import { ok, handleError } from '@/server/lib/api-response';
import { requireAuth } from '@/server/middleware/with-auth';
import { requireRole } from '@/server/middleware/with-role';
import { parseBody } from '@/server/middleware/with-validation';
import { updateCourseSchema } from '@/server/types/course.types';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await requireAuth(req);
    const { id } = await params;
    const course = await courseService.getById(id);
    return ok(course);
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireRole('GURU');
    const { id } = await params;
    const body = await parseBody(req, updateCourseSchema);
    const course = await courseService.update(id, body);
    return ok(course);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireRole('GURU');
    const { id } = await params;
    await courseService.delete(id);
    return ok({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
