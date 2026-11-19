'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { courseKeys } from './use-courses';
import type { Attempt, Quiz, QuizListItem } from '@/lib/lms-types';

const quizKey = (courseId: string, quizId: string) => ['quiz', courseId, quizId] as const;
const attemptsKey = (courseId: string, quizId: string) =>
  ['quiz', courseId, quizId, 'attempts'] as const;

export function useQuiz(courseId: string, quizId: string) {
  return useQuery({
    queryKey: quizKey(courseId, quizId),
    queryFn: () => apiClient.get<Quiz>(`/courses/${courseId}/quizzes/${quizId}`),
    enabled: Boolean(courseId && quizId),
  });
}

export function useCreateQuiz(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; description?: string }) =>
      apiClient.post<QuizListItem>(`/courses/${courseId}/quizzes`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.detail(courseId) }),
  });
}

type QuestionInput = {
  type: 'PG' | 'ESSAY';
  text: string;
  points: number;
  order?: number;
  choices: { label: string; text: string; isCorrect: boolean }[];
};

export function useAddQuestion(courseId: string, quizId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: QuestionInput) =>
      apiClient.post(`/courses/${courseId}/quizzes/${quizId}/questions`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: quizKey(courseId, quizId) }),
  });
}

export function useDeleteQuestion(courseId: string, quizId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (questionId: string) =>
      apiClient.delete(`/courses/${courseId}/quizzes/${quizId}/questions/${questionId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: quizKey(courseId, quizId) }),
  });
}

export function useSubmitAttempt(courseId: string, quizId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (answers: { questionId: string; choiceId?: string; essayText?: string }[]) =>
      apiClient.post<Attempt>(`/courses/${courseId}/quizzes/${quizId}/attempts`, { answers }),
    onSuccess: () => qc.invalidateQueries({ queryKey: attemptsKey(courseId, quizId) }),
  });
}

/** SISWA: own latest attempt (null if none). */
export function useMyAttempt(courseId: string, quizId: string, enabled = true) {
  return useQuery({
    queryKey: [...attemptsKey(courseId, quizId), 'mine'],
    queryFn: () =>
      apiClient.get<Attempt | null>(`/courses/${courseId}/quizzes/${quizId}/attempts`),
    enabled: Boolean(courseId && quizId) && enabled,
  });
}

/** GURU: all attempts for grading. */
export function useAttempts(courseId: string, quizId: string, enabled = true) {
  return useQuery({
    queryKey: attemptsKey(courseId, quizId),
    queryFn: () =>
      apiClient.get<{ items: Attempt[] }>(`/courses/${courseId}/quizzes/${quizId}/attempts`),
    enabled: Boolean(courseId && quizId) && enabled,
  });
}

export function useGradeEssays(courseId: string, quizId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      attemptId: string;
      grades: { answerId: string; awardedPoints: number }[];
    }) =>
      apiClient.patch(
        `/courses/${courseId}/quizzes/${quizId}/attempts/${args.attemptId}`,
        { grades: args.grades }
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: attemptsKey(courseId, quizId) }),
  });
}
