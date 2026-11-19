import { prisma } from '../lib/prisma';
import type { Prisma } from '@prisma/client';

/**
 * REPOSITORY — only DB access for courses.
 */
export const courseRepository = {
  findMany() {
    return prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        teacher: { select: { id: true, name: true } },
        _count: { select: { modules: true, quizzes: true, assignments: true } },
      },
    });
  },

  findById(id: string) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        teacher: { select: { id: true, name: true } },
        modules: { orderBy: { order: 'asc' } },
        announcements: { orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }] },
        quizzes: {
          orderBy: { createdAt: 'asc' },
          include: { _count: { select: { questions: true } } },
        },
        assignments: { orderBy: { createdAt: 'asc' } },
      },
    });
  },

  findBySlug(slug: string) {
    return prisma.course.findUnique({ where: { slug } });
  },

  create(data: Prisma.CourseCreateInput) {
    return prisma.course.create({ data });
  },

  update(id: string, data: Prisma.CourseUpdateInput) {
    return prisma.course.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.course.delete({ where: { id } });
  },
};
