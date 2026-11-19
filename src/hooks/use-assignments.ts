'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { courseKeys } from './use-courses';
import type { AssignmentItem, SubmissionMeta } from '@/lib/lms-types';

const submissionsKey = (courseId: string, assignmentId: string) =>
  ['submissions', courseId, assignmentId] as const;

type AssignmentInput = {
  title: string;
  instructions: string;
  allowedTypes?: string;
  maxSizeMb?: number;
  deadline?: string;
};

export function useAssignment(courseId: string, assignmentId: string) {
  return useQuery({
    queryKey: ['assignment', courseId, assignmentId],
    queryFn: () =>
      apiClient.get<AssignmentItem>(`/courses/${courseId}/assignments/${assignmentId}`),
    enabled: Boolean(courseId && assignmentId),
  });
}

export function useCreateAssignment(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignmentInput) =>
      apiClient.post<AssignmentItem>(`/courses/${courseId}/assignments`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.detail(courseId) }),
  });
}

export function useDeleteAssignment(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (assignmentId: string) =>
      apiClient.delete(`/courses/${courseId}/assignments/${assignmentId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.detail(courseId) }),
  });
}

/** GURU: all submissions for an assignment. */
export function useSubmissions(courseId: string, assignmentId: string, enabled = true) {
  return useQuery({
    queryKey: submissionsKey(courseId, assignmentId),
    queryFn: () =>
      apiClient.get<{ items: SubmissionMeta[] }>(
        `/courses/${courseId}/assignments/${assignmentId}/submissions`
      ),
    enabled: Boolean(courseId && assignmentId) && enabled,
  });
}

/** SISWA: own submission (null if none). */
export function useMySubmission(courseId: string, assignmentId: string, enabled = true) {
  return useQuery({
    queryKey: [...submissionsKey(courseId, assignmentId), 'mine'],
    queryFn: () =>
      apiClient.get<SubmissionMeta | null>(
        `/courses/${courseId}/assignments/${assignmentId}/submissions`
      ),
    enabled: Boolean(courseId && assignmentId) && enabled,
  });
}

export function useUploadSubmission(courseId: string, assignmentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('file', file);
      // Bypass apiClient (JSON-only) for multipart upload.
      const res = await fetch(
        `/api/courses/${courseId}/assignments/${assignmentId}/submissions`,
        { method: 'POST', body: form }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? 'Upload gagal');
      return json.data as SubmissionMeta;
    },
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: [...submissionsKey(courseId, assignmentId), 'mine'],
      }),
  });
}

export function useGradeSubmission(courseId: string, assignmentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { submissionId: string; grade?: number; feedback?: string }) =>
      apiClient.patch<SubmissionMeta>(`/submissions/${args.submissionId}`, {
        grade: args.grade,
        feedback: args.feedback,
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: submissionsKey(courseId, assignmentId) }),
  });
}
