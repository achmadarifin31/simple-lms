import { prisma } from '../lib/prisma';
import type { Prisma } from '@prisma/client';

/** Omit the heavy `fileData` blob from list/detail reads. */
const metaSelect = {
  id: true,
  assignmentId: true,
  studentId: true,
  fileName: true,
  fileMime: true,
  fileSize: true,
  grade: true,
  feedback: true,
  submittedAt: true,
} satisfies Prisma.SubmissionSelect;

export const submissionRepository = {
  upsert(args: {
    assignmentId: string;
    studentId: string;
    fileName: string;
    fileMime: string;
    fileSize: number;
    fileData: Buffer;
  }) {
    const { assignmentId, studentId, ...file } = args;
    return prisma.submission.upsert({
      where: { assignmentId_studentId: { assignmentId, studentId } },
      create: { assignmentId, studentId, ...file },
      update: { ...file, grade: null, feedback: null, submittedAt: new Date() },
      select: metaSelect,
    });
  },

  listByAssignment(assignmentId: string) {
    return prisma.submission.findMany({
      where: { assignmentId },
      orderBy: { submittedAt: 'desc' },
      select: { ...metaSelect, student: { select: { id: true, name: true, email: true } } },
    });
  },

  findByStudent(assignmentId: string, studentId: string) {
    return prisma.submission.findUnique({
      where: { assignmentId_studentId: { assignmentId, studentId } },
      select: metaSelect,
    });
  },

  findMeta(id: string) {
    return prisma.submission.findUnique({ where: { id }, select: metaSelect });
  },

  findWithFile(id: string) {
    return prisma.submission.findUnique({ where: { id } });
  },

  updateGrade(id: string, data: { grade?: number; feedback?: string }) {
    return prisma.submission.update({ where: { id }, data, select: metaSelect });
  },
};
