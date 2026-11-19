import { announcementRepository } from '../repositories/announcement.repository';
import { courseRepository } from '../repositories/course.repository';
import { NotFoundError } from '../lib/errors';
import type {
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from '../types/announcement.types';

export const announcementService = {
  listByCourse(courseId: string) {
    return announcementRepository.listByCourse(courseId);
  },

  async create(courseId: string, input: CreateAnnouncementInput) {
    const course = await courseRepository.findById(courseId);
    if (!course) throw new NotFoundError('Course');
    return announcementRepository.create({
      ...input,
      course: { connect: { id: courseId } },
    });
  },

  async update(id: string, input: UpdateAnnouncementInput) {
    const existing = await announcementRepository.findById(id);
    if (!existing) throw new NotFoundError('Pengumuman');
    return announcementRepository.update(id, input);
  },

  async delete(id: string) {
    const existing = await announcementRepository.findById(id);
    if (!existing) throw new NotFoundError('Pengumuman');
    return announcementRepository.delete(id);
  },
};
