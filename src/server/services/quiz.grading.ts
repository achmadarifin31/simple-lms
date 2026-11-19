/**
 * Pure quiz-grading logic — no DB, no HTTP, fully unit-testable.
 *
 * - PG questions are auto-graded: full points if the chosen choice is the
 *   correct one, otherwise 0. `graded` is true immediately.
 * - ESSAY questions are stored ungraded (awardedPoints 0, graded false) for
 *   the teacher to grade manually later.
 */
export type GradableQuestion = {
  id: string;
  type: 'PG' | 'ESSAY';
  points: number;
  correctChoiceId: string | null;
};

export type SubmittedAnswer = {
  questionId: string;
  choiceId?: string;
  essayText?: string;
};

export type GradedAnswer = {
  questionId: string;
  choiceId: string | null;
  essayText: string | null;
  isCorrect: boolean | null;
  awardedPoints: number;
  graded: boolean;
};

export function gradeSubmission(
  questions: GradableQuestion[],
  submitted: SubmittedAnswer[]
): { graded: GradedAnswer[]; score: number; maxScore: number } {
  const graded: GradedAnswer[] = questions.map((q) => {
    const answer = submitted.find((s) => s.questionId === q.id);

    if (q.type === 'PG') {
      const choiceId = answer?.choiceId ?? null;
      const isCorrect = choiceId !== null && choiceId === q.correctChoiceId;
      return {
        questionId: q.id,
        choiceId,
        essayText: null,
        isCorrect,
        awardedPoints: isCorrect ? q.points : 0,
        graded: true,
      };
    }

    return {
      questionId: q.id,
      choiceId: null,
      essayText: answer?.essayText ?? '',
      isCorrect: null,
      awardedPoints: 0,
      graded: false,
    };
  });

  const score = graded.reduce((sum, g) => sum + g.awardedPoints, 0);
  const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
  return { graded, score, maxScore };
}
