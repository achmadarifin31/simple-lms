import { prisma } from '../lib/prisma';
import type { Prisma } from '@prisma/client';

const questionInclude = {
  questions: {
    orderBy: { order: 'asc' },
    include: { choices: { orderBy: { label: 'asc' } } },
  },
} satisfies Prisma.QuizInclude;

export const quizRepository = {
  listByCourse(courseId: string) {
    return prisma.quiz.findMany({
      where: { courseId },
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { questions: true } } },
    });
  },

  findByIdFull(id: string) {
    return prisma.quiz.findUnique({ where: { id }, include: questionInclude });
  },

  create(data: Prisma.QuizCreateInput) {
    return prisma.quiz.create({ data });
  },
  update(id: string, data: Prisma.QuizUpdateInput) {
    return prisma.quiz.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.quiz.delete({ where: { id } });
  },

  // --- Questions ---
  createQuestion(data: Prisma.QuestionCreateInput) {
    return prisma.question.create({ data, include: { choices: true } });
  },
  findQuestion(id: string) {
    return prisma.question.findUnique({ where: { id }, include: { choices: true } });
  },
  deleteQuestion(id: string) {
    return prisma.question.delete({ where: { id } });
  },
  async replaceQuestion(id: string, data: Prisma.QuestionUpdateInput, choices: Prisma.ChoiceCreateManyQuestionInput[]) {
    return prisma.$transaction(async (tx) => {
      await tx.choice.deleteMany({ where: { questionId: id } });
      return tx.question.update({
        where: { id },
        data: { ...data, choices: { createMany: { data: choices } } },
        include: { choices: true },
      });
    });
  },

  // --- Attempts ---
  createAttempt(data: Prisma.QuizAttemptCreateInput) {
    return prisma.quizAttempt.create({
      data,
      include: { answers: { include: { question: true, choice: true } } },
    });
  },
  findAttempt(id: string) {
    return prisma.quizAttempt.findUnique({
      where: { id },
      include: { answers: { include: { question: true, choice: true } }, quiz: true },
    });
  },
  listAttemptsByQuiz(quizId: string) {
    return prisma.quizAttempt.findMany({
      where: { quizId },
      orderBy: { submittedAt: 'desc' },
      include: {
        student: { select: { id: true, name: true, email: true } },
        answers: { include: { question: true, choice: true } },
      },
    });
  },
  latestAttempt(quizId: string, studentId: string) {
    return prisma.quizAttempt.findFirst({
      where: { quizId, studentId },
      orderBy: { submittedAt: 'desc' },
      include: { answers: { include: { question: true, choice: true } } },
    });
  },
  updateAnswer(id: string, data: Prisma.AnswerUpdateInput) {
    return prisma.answer.update({ where: { id }, data });
  },
  updateAttemptScore(id: string, score: number) {
    return prisma.quizAttempt.update({ where: { id }, data: { score } });
  },
};
