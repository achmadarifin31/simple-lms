import { describe, it, expect } from 'vitest';
import { createUserSchema } from '../types/user.types';

/**
 * Service logic is testable in isolation BECAUSE it has no HTTP dependency.
 * That's the payoff of keeping business logic in services.
 */
describe('createUserSchema', () => {
  it('accepts valid input', () => {
    const result = createUserSchema.safeParse({ email: 'a@b.com', name: 'Alice' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = createUserSchema.safeParse({ email: 'not-an-email', name: 'Alice' });
    expect(result.success).toBe(false);
  });

  it('rejects empty name', () => {
    const result = createUserSchema.safeParse({ email: 'a@b.com', name: '' });
    expect(result.success).toBe(false);
  });
});
