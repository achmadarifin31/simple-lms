import { prisma } from '../lib/prisma';
import type { Prisma } from '@prisma/client';

export const assignmentRepository = {
  listByCourse(courseId: string) {
    return prisma.assignment.findMany({
      where: { courseId },
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { submissions: true } } },
    });
  },

  findById(id: string) {
    return prisma.assignment.findUnique({ where: { id } });
  },

  create(data: Prisma.AssignmentCreateInput) {
    return prisma.assignment.create({ data });
  },

  update(id: string, data: Prisma.AssignmentUpdateInput) {
    return prisma.assignment.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.assignment.delete({ where: { id } });
  },
};
