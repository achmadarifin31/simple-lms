import { z } from 'zod';

export const createAssignmentSchema = z.object({
  title: z.string().min(1).max(200),
  instructions: z.string().min(1),
  allowedTypes: z.string().min(1).default('pdf,docx'),
  maxSizeMb: z.coerce.number().int().min(1).max(100).default(4),
  deadline: z.coerce.date().optional(),
});

export const updateAssignmentSchema = createAssignmentSchema.partial();

export const gradeSubmissionSchema = z.object({
  grade: z.coerce.number().int().min(0).max(100).optional(),
  feedback: z.string().optional(),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>;
