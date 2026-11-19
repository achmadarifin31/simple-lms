import { userRepository } from '../repositories/user.repository';
import { ConflictError, NotFoundError } from '../lib/errors';
import type { CreateUserInput, ListUsersQuery } from '../types/user.types';

/**
 * SERVICE — business logic lives here, not in the Route Handler.
 * No HTTP dependency. Callable from Route Handlers, cron jobs, tests — identically.
 */
export const userService = {
  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('User');
    return user;
  },

  async list({ page, pageSize }: ListUsersQuery) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      userRepository.findMany(skip, pageSize),
      userRepository.count(),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async create(input: CreateUserInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw new ConflictError('Email already registered');
    return userRepository.create({ email: input.email, name: input.name });
  },

  async delete(id: string) {
    await userService.getById(id); // throws NotFoundError if missing
    return userRepository.delete(id);
  },
};
