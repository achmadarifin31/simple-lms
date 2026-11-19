import { moduleRepository } from '../repositories/module.repository';
import { courseRepository } from '../repositories/course.repository';
import { NotFoundError } from '../lib/errors';
import type { CreateModuleInput, UpdateModuleInput } from '../types/module.types';

export const moduleService = {
  listByCourse(courseId: string) {
    return moduleRepository.listByCourse(courseId);
  },

  async getById(id: string) {
    const mod = await moduleRepository.findById(id);
    if (!mod) throw new NotFoundError('Materi');
    return mod;
  },

  async create(courseId: string, input: CreateModuleInput) {
    const course = await courseRepository.findById(courseId);
    if (!course) throw new NotFoundError('Course');
    return moduleRepository.create({
      ...input,
      course: { connect: { id: courseId } },
    });
  },

  async update(id: string, input: UpdateModuleInput) {
    await moduleService.getById(id);
    return moduleRepository.update(id, input);
  },

  async delete(id: string) {
    await moduleService.getById(id);
    return moduleRepository.delete(id);
  },
};
