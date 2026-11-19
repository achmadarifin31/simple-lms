import { submissionRepository } from '../repositories/submission.repository';
import { assignmentRepository } from '../repositories/assignment.repository';
import { AppError, NotFoundError } from '../lib/errors';
import type { GradeSubmissionInput } from '../types/assignment.types';

function extensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  return dot === -1 ? '' : fileName.slice(dot + 1).toLowerCase();
}

export const submissionService = {
  async submit(args: {
    assignmentId: string;
    studentId: string;
    fileName: string;
    fileMime: string;
    buffer: Buffer;
  }) {
    const assignment = await assignmentRepository.findById(args.assignmentId);
    if (!assignment) throw new NotFoundError('Tugas');

    const allowed = assignment.allowedTypes
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    const ext = extensionOf(args.fileName);
    if (allowed.length && !allowed.includes(ext)) {
      throw new AppError(
        400,
        `Tipe file tidak diizinkan. Diperbolehkan: ${allowed.join(', ')}`,
        'VALIDATION_ERROR'
      );
    }

    const maxBytes = assignment.maxSizeMb * 1024 * 1024;
    if (args.buffer.length > maxBytes) {
      throw new AppError(
        400,
        `Ukuran file melebihi batas ${assignment.maxSizeMb} MB`,
        'VALIDATION_ERROR'
      );
    }

    return submissionRepository.upsert({
      assignmentId: args.assignmentId,
      studentId: args.studentId,
      fileName: args.fileName,
      fileMime: args.fileMime,
      fileSize: args.buffer.length,
      fileData: args.buffer,
    });
  },

  listByAssignment(assignmentId: string) {
    return submissionRepository.listByAssignment(assignmentId);
  },

  mySubmission(assignmentId: string, studentId: string) {
    return submissionRepository.findByStudent(assignmentId, studentId);
  },

  async getFile(id: string) {
    const submission = await submissionRepository.findWithFile(id);
    if (!submission) throw new NotFoundError('Pengumpulan');
    return submission;
  },

  async getMeta(id: string) {
    const submission = await submissionRepository.findMeta(id);
    if (!submission) throw new NotFoundError('Pengumpulan');
    return submission;
  },

  async grade(id: string, input: GradeSubmissionInput) {
    await submissionService.getMeta(id);
    return submissionRepository.updateGrade(id, input);
  },
};
