import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository';
import { ConflictError } from '../lib/errors';
import type { RegisterInput } from '../types/auth.types';

/**
 * Registration for students (siswa). Teacher (guru) accounts are created via
 * the seed, so public self-registration is always role SISWA.
 */
export const authService = {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw new ConflictError('Email sudah terdaftar');
    const password = await bcrypt.hash(input.password, 10);
    return userRepository.create({
      name: input.name,
      email: input.email,
      password,
      role: 'SISWA',
    });
  },
};
