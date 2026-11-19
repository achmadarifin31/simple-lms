import { z } from 'zod';

export const createQuizSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
});
export const updateQuizSchema = createQuizSchema.partial();

const choiceInputSchema = z.object({
  label: z.string().min(1).max(4),
  text: z.string().min(1),
  isCorrect: z.boolean().default(false),
});

export const createQuestionSchema = z
  .object({
    type: z.enum(['PG', 'ESSAY']),
    text: z.string().min(1),
    points: z.coerce.number().int().min(1).max(100).default(10),
    order: z.coerce.number().int().min(0).default(0),
    choices: z.array(choiceInputSchema).default([]),
  })
  .superRefine((val, ctx) => {
    if (val.type === 'PG') {
      if (val.choices.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['choices'],
          message: 'Soal PG minimal punya 2 pilihan',
        });
      }
      const correct = val.choices.filter((c) => c.isCorrect).length;
      if (correct !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['choices'],
          message: 'Soal PG harus punya tepat 1 kunci jawaban benar',
        });
      }
    }
  });

export const updateQuestionSchema = createQuestionSchema;

export const submitAttemptSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        choiceId: z.string().optional(),
        essayText: z.string().optional(),
      })
    )
    .min(1),
});

export const gradeEssaysSchema = z.object({
  grades: z
    .array(
      z.object({
        answerId: z.string().min(1),
        awardedPoints: z.coerce.number().int().min(0),
      })
    )
    .min(1),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type SubmitAttemptInput = z.infer<typeof submitAttemptSchema>;
export type GradeEssaysInput = z.infer<typeof gradeEssaysSchema>;
