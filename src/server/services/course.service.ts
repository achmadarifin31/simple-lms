import { courseRepository } from '../repositories/course.repository';
import { NotFoundError, ConflictError } from '../lib/errors';
import {
  slugify,
  type CreateCourseInput,
  type UpdateCourseInput,
} from '../types/course.types';

export const courseService = {
  list() {
    return courseRepository.findMany();
  },

  async getById(id: string) {
    const course = await courseRepository.findById(id);
    if (!course) throw new NotFoundError('Course');
    return course;
  },

  async create(input: CreateCourseInput, teacherId: string) {
    const slug = await uniqueSlug(input.title);
    return courseRepository.create({
      title: input.title,
      slug,
      description: input.description,
      capaian: input.capaian,
      penilaian: input.penilaian,
      published: input.published,
      teacher: { connect: { id: teacherId } },
    });
  },

  async update(id: string, input: UpdateCourseInput) {
    await courseService.getById(id);
    const data: Record<string, unknown> = { ...input };
    if (input.title) data.slug = await uniqueSlug(input.title, id);
    return courseRepository.update(id, data);
  },

  async delete(id: string) {
    await courseService.getById(id);
    return courseRepository.delete(id);
  },
};

async function uniqueSlug(title: string, ignoreId?: string): Promise<string> {
  const base = slugify(title) || 'course';
  let candidate = base;
  let n = 1;
  while (true) {
    const found = await courseRepository.findBySlug(candidate);
    if (!found || found.id === ignoreId) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
    if (n > 50) throw new ConflictError('Tidak bisa membuat slug unik');
  }
}
