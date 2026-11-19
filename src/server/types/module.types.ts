import { z } from 'zod';

export const createModuleSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  order: z.coerce.number().int().min(0).default(0),
});

export const updateModuleSchema = createModuleSchema.partial();

export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;
