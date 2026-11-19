import type { NextRequest } from 'next/server';
import { announcementService } from '@/server/services/announcement.service';
import { ok, created, handleError } from '@/server/lib/api-response';
import { requireAuth } from '@/server/middleware/with-auth';
import { requireRole } from '@/server/middleware/with-role';
import { parseBody } from '@/server/middleware/with-validation';
import { createAnnouncementSchema } from '@/server/types/announcement.types';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await requireAuth(req);
    const { id } = await params;
    const items = await announcementService.listByCourse(id);
    return ok({ items });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    await requireRole('GURU');
    const { id } = await params;
    const body = await parseBody(req, createAnnouncementSchema);
    const created_ = await announcementService.create(id, body);
    return created(created_);
  } catch (err) {
    return handleError(err);
  }
}
