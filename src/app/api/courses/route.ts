import type { NextRequest } from 'next/server';
import { courseService } from '@/server/services/course.service';
import { ok, created, handleError } from '@/server/lib/api-response';
import { requireAuth } from '@/server/middleware/with-auth';
import { requireRole } from '@/server/middleware/with-role';
import { parseBody } from '@/server/middleware/with-validation';
import { createCourseSchema } from '@/server/types/course.types';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const items = await courseService.list();
    return ok({ items });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole('GURU');
    const body = await parseBody(req, createCourseSchema);
    const course = await courseService.create(body, session.user.id);
    return created(course);
  } catch (err) {
    return handleError(err);
  }
}
