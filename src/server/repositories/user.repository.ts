import { prisma } from '../lib/prisma';
import type { Prisma } from '@prisma/client';

/**
 * REPOSITORY — the ONLY place that talks to the database.
 * No business rules, no HTTP. If you swap Prisma, only this file changes.
 *
 * `safeSelect` omits the password hash — use it for anything returned to a
 * client. `findByEmail` returns the full row (incl. password) because the
 * auth layer needs the hash to verify a login.
 */
const safeSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: safeSelect });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findMany(skip: number, take: number) {
    return prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: safeSelect,
    });
  },

  count() {
    return prisma.user.count();
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data, select: safeSelect });
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data, select: safeSelect });
  },

  delete(id: string) {
    return prisma.user.delete({ where: { id }, select: safeSelect });
  },
};
