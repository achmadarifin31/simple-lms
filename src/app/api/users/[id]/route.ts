import type { NextRequest } from 'next/server';
import { userService } from '@/server/services/user.service';
import { ok, handleError } from '@/server/lib/api-response';
import { requireAuth } from '@/server/middleware/with-auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(req);
    const { id } = await params;
    const user = await userService.getById(id);
    return ok(user);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(req);
    const { id } = await params;
    await userService.delete(id);
    return ok({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
