import { prisma } from '../lib/prisma';
import type { Prisma } from '@prisma/client';

export const moduleRepository = {
  listByCourse(courseId: string) {
    return prisma.module.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });
  },

  findById(id: string) {
    return prisma.module.findUnique({ where: { id } });
  },

  create(data: Prisma.ModuleCreateInput) {
    return prisma.module.create({ data });
  },

  update(id: string, data: Prisma.ModuleUpdateInput) {
    return prisma.module.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.module.delete({ where: { id } });
  },
};
