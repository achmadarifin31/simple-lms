import { quizRepository } from '../repositories/quiz.repository';
import { courseRepository } from '../repositories/course.repository';
import { AppError, NotFoundError, ForbiddenError } from '../lib/errors';
import { gradeSubmission, type GradableQuestion } from './quiz.grading';
import type {
  CreateQuizInput,
  UpdateQuizInput,
  CreateQuestionInput,
  SubmitAttemptInput,
  GradeEssaysInput,
} from '../types/quiz.types';

export const quizService = {
  listByCourse(courseId: string) {
    return quizRepository.listByCourse(courseId);
  },

  async getForEdit(id: string) {
    const quiz = await quizRepository.findByIdFull(id);
    if (!quiz) throw new NotFoundError('Kuis');
    return quiz;
  },

  /** Student view — strips the `isCorrect` flag so answers aren't leaked. */
  async getForPlay(id: string) {
    const quiz = await quizRepository.findByIdFull(id);
    if (!quiz) throw new NotFoundError('Kuis');
    return {
      ...quiz,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        type: q.type,
        text: q.text,
        points: q.points,
        order: q.order,
        choices: q.choices.map((c) => ({ id: c.id, label: c.label, text: c.text })),
      })),
    };
  },

  async create(courseId: string, input: CreateQuizInput) {
    const course = await courseRepository.findById(courseId);
    if (!course) throw new NotFoundError('Course');
    return quizRepository.create({ ...input, course: { connect: { id: courseId } } });
  },

  async update(id: string, input: UpdateQuizInput) {
    await quizService.getForEdit(id);
    return quizRepository.update(id, input);
  },

  async delete(id: string) {
    await quizService.getForEdit(id);
    return quizRepository.delete(id);
  },

  async addQuestion(quizId: string, input: CreateQuestionInput) {
    const quiz = await quizRepository.findByIdFull(quizId);
    if (!quiz) throw new NotFoundError('Kuis');
    return quizRepository.createQuestion({
      quiz: { connect: { id: quizId } },
      type: input.type,
      text: input.text,
      points: input.points,
      order: input.order,
      choices:
        input.type === 'PG'
          ? { createMany: { data: input.choices } }
          : undefined,
    });
  },

  async updateQuestion(questionId: string, input: CreateQuestionInput) {
    const existing = await quizRepository.findQuestion(questionId);
    if (!existing) throw new NotFoundError('Soal');
    return quizRepository.replaceQuestion(
      questionId,
      { type: input.type, text: input.text, points: input.points, order: input.order },
      input.type === 'PG' ? input.choices : []
    );
  },

  async deleteQuestion(questionId: string) {
    const existing = await quizRepository.findQuestion(questionId);
    if (!existing) throw new NotFoundError('Soal');
    return quizRepository.deleteQuestion(questionId);
  },

  /** Student submits answers → PG auto-graded, essays stored ungraded. */
  async submitAttempt(quizId: string, studentId: string, input: SubmitAttemptInput) {
    const quiz = await quizRepository.findByIdFull(quizId);
    if (!quiz) throw new NotFoundError('Kuis');
    if (quiz.questions.length === 0) {
      throw new AppError(400, 'Kuis belum memiliki soal', 'VALIDATION_ERROR');
    }

    const gradable: GradableQuestion[] = quiz.questions.map((q) => ({
      id: q.id,
      type: q.type,
      points: q.points,
      correctChoiceId: q.choices.find((c) => c.isCorrect)?.id ?? null,
    }));

    const { graded, score, maxScore } = gradeSubmission(gradable, input.answers);

    return quizRepository.createAttempt({
      quiz: { connect: { id: quizId } },
      student: { connect: { id: studentId } },
      score,
      maxScore,
      answers: {
        create: graded.map((g) => ({
          question: { connect: { id: g.questionId } },
          choice: g.choiceId ? { connect: { id: g.choiceId } } : undefined,
          essayText: g.essayText,
          isCorrect: g.isCorrect,
          awardedPoints: g.awardedPoints,
          graded: g.graded,
        })),
      },
    });
  },

  listAttempts(quizId: string) {
    return quizRepository.listAttemptsByQuiz(quizId);
  },

  latestAttempt(quizId: string, studentId: string) {
    return quizRepository.latestAttempt(quizId, studentId);
  },

  /** Teacher grades essay answers → recomputes the attempt score. */
  async gradeEssays(attemptId: string, input: GradeEssaysInput) {
    const attempt = await quizRepository.findAttempt(attemptId);
    if (!attempt) throw new NotFoundError('Percobaan kuis');

    const answersById = new Map(attempt.answers.map((a) => [a.id, a]));

    for (const grade of input.grades) {
      const answer = answersById.get(grade.answerId);
      if (!answer) throw new NotFoundError('Jawaban');
      if (answer.question.type !== 'ESSAY') {
        throw new ForbiddenError('Hanya soal esai yang dinilai manual');
      }
      const capped = Math.min(grade.awardedPoints, answer.question.points);
      await quizRepository.updateAnswer(grade.answerId, {
        awardedPoints: capped,
        graded: true,
      });
      answer.awardedPoints = capped;
      answer.graded = true;
    }

    const score = attempt.answers.reduce((sum, a) => sum + a.awardedPoints, 0);
    await quizRepository.updateAttemptScore(attemptId, score);
    return quizRepository.findAttempt(attemptId);
  },
};
