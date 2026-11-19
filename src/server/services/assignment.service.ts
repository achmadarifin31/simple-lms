import { assignmentRepository } from '../repositories/assignment.repository';
import { courseRepository } from '../repositories/course.repository';
import { NotFoundError } from '../lib/errors';
import type {
  CreateAssignmentInput,
  UpdateAssignmentInput,
} from '../types/assignment.types';

export const assignmentService = {
  listByCourse(courseId: string) {
    return assignmentRepository.listByCourse(courseId);
  },

  async getById(id: string) {
    const assignment = await assignmentRepository.findById(id);
    if (!assignment) throw new NotFoundError('Tugas');
    return assignment;
  },

  async create(courseId: string, input: CreateAssignmentInput) {
    const course = await courseRepository.findById(courseId);
    if (!course) throw new NotFoundError('Course');
    return assignmentRepository.create({
      ...input,
      course: { connect: { id: courseId } },
    });
  },

  async update(id: string, input: UpdateAssignmentInput) {
    await assignmentService.getById(id);
    return assignmentRepository.update(id, input);
  },

  async delete(id: string) {
    await assignmentService.getById(id);
    return assignmentRepository.delete(id);
  },
};
