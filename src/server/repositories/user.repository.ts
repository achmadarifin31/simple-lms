import { prisma } from '../lib/prisma';
import type { Prisma } from '@prisma/client';

/**
 * REPOSITORY — the ONLY place that talks to the database.
 * No business rules, no HTTP. If you swap Prisma, only this file changes.
 */
export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findMany(skip: number, take: number) {
    return prisma.user.findMany({ skip, take, orderBy: { createdAt: 'desc' } });
  },

  count() {
    return prisma.user.count();
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
