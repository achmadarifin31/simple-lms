import type { NextRequest } from 'next/server';
import { moduleService } from '@/server/services/module.service';
import { ok, handleError } from '@/server/lib/api-response';
import { requireAuth } from '@/server/middleware/with-auth';
import { requireRole } from '@/server/middleware/with-role';
import { parseBody } from '@/server/middleware/with-validation';
import { updateModuleSchema } from '@/server/types/module.types';

type Params = { params: Promise<{ id: string; moduleId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await requireAuth(req);
    const { moduleId } = await params;
    const mod = await moduleService.getById(moduleId);
    return ok(mod);
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireRole('GURU');
    const { moduleId } = await params;
    const body = await parseBody(req, updateModuleSchema);
    const mod = await moduleService.update(moduleId, body);
    return ok(mod);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireRole('GURU');
    const { moduleId } = await params;
    await moduleService.delete(moduleId);
    return ok({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
