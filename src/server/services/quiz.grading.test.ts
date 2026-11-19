import { describe, it, expect } from 'vitest';
import { gradeSubmission, type GradableQuestion } from './quiz.grading';

const questions: GradableQuestion[] = [
  { id: 'q1', type: 'PG', points: 10, correctChoiceId: 'q1-b' },
  { id: 'q2', type: 'PG', points: 10, correctChoiceId: 'q2-a' },
  { id: 'q3', type: 'ESSAY', points: 20, correctChoiceId: null },
];

describe('gradeSubmission', () => {
  it('awards full points for a correct PG choice and zero for a wrong one', () => {
    const { graded, score, maxScore } = gradeSubmission(questions, [
      { questionId: 'q1', choiceId: 'q1-b' }, // correct
      { questionId: 'q2', choiceId: 'q2-c' }, // wrong
      { questionId: 'q3', essayText: 'jawaban esai' },
    ]);

    expect(maxScore).toBe(40);
    expect(score).toBe(10); // only q1 correct; essay ungraded
    expect(graded.find((g) => g.questionId === 'q1')?.isCorrect).toBe(true);
    expect(graded.find((g) => g.questionId === 'q2')?.isCorrect).toBe(false);
  });

  it('stores essays ungraded with zero points and graded=false', () => {
    const { graded } = gradeSubmission(questions, [
      { questionId: 'q3', essayText: 'penjelasan panjang' },
    ]);
    const essay = graded.find((g) => g.questionId === 'q3');
    expect(essay?.graded).toBe(false);
    expect(essay?.awardedPoints).toBe(0);
    expect(essay?.isCorrect).toBeNull();
    expect(essay?.essayText).toBe('penjelasan panjang');
  });

  it('handles an unanswered PG question as incorrect', () => {
    const { graded, score } = gradeSubmission(questions, []);
    expect(score).toBe(0);
    const q1 = graded.find((g) => g.questionId === 'q1');
    expect(q1?.choiceId).toBeNull();
    expect(q1?.isCorrect).toBe(false);
  });

  it('produces one graded answer per question, ignoring stray submissions', () => {
    const { graded } = gradeSubmission(questions, [
      { questionId: 'does-not-exist', choiceId: 'x' },
      { questionId: 'q1', choiceId: 'q1-b' },
    ]);
    expect(graded).toHaveLength(questions.length);
  });
});
