import type { NextRequest } from 'next/server';
import { announcementService } from '@/server/services/announcement.service';
import { ok, handleError } from '@/server/lib/api-response';
import { requireRole } from '@/server/middleware/with-role';
import { parseBody } from '@/server/middleware/with-validation';
import { updateAnnouncementSchema } from '@/server/types/announcement.types';

type Params = { params: Promise<{ id: string; announcementId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireRole('GURU');
    const { announcementId } = await params;
    const body = await parseBody(req, updateAnnouncementSchema);
    const updated = await announcementService.update(announcementId, body);
    return ok(updated);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireRole('GURU');
    const { announcementId } = await params;
    await announcementService.delete(announcementId);
    return ok({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
