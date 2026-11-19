import { prisma } from '../lib/prisma';
import type { Prisma } from '@prisma/client';

export const announcementRepository = {
  listByCourse(courseId: string) {
    return prisma.announcement.findMany({
      where: { courseId },
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    });
  },

  findById(id: string) {
    return prisma.announcement.findUnique({ where: { id } });
  },

  create(data: Prisma.AnnouncementCreateInput) {
    return prisma.announcement.create({ data });
  },

  update(id: string, data: Prisma.AnnouncementUpdateInput) {
    return prisma.announcement.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.announcement.delete({ where: { id } });
  },
};
