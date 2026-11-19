import { NextResponse, type NextRequest } from 'next/server';
import { submissionService } from '@/server/services/submission.service';
import { handleError } from '@/server/lib/api-response';
import { requireAuth } from '@/server/middleware/with-auth';
import { ForbiddenError } from '@/server/lib/errors';

type Params = { params: Promise<{ submissionId: string }> };

/** GET — download the uploaded file. GURU or the owning SISWA only. */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth(req);
    const { submissionId } = await params;
    const submission = await submissionService.getFile(submissionId);

    if (session.user.role !== 'GURU' && submission.studentId !== session.user.id) {
      throw new ForbiddenError('Tidak boleh mengakses file ini');
    }

    const body = Buffer.from(submission.fileData);
    return new NextResponse(body, {
      headers: {
        'Content-Type': submission.fileMime,
        'Content-Length': String(submission.fileSize),
        'Content-Disposition': `attachment; filename="${encodeURIComponent(submission.fileName)}"`,
      },
    });
  } catch (err) {
    return handleError(err);
  }
}
