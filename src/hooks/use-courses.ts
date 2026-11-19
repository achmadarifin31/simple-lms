'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { CourseDetail, CourseListItem } from '@/lib/lms-types';

const KEYS = {
  all: ['courses'] as const,
  detail: (id: string) => ['courses', 'detail', id] as const,
};

export function useCourses() {
  return useQuery({
    queryKey: KEYS.all,
    queryFn: () => apiClient.get<{ items: CourseListItem[] }>('/courses'),
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => apiClient.get<CourseDetail>(`/courses/${id}`),
    enabled: Boolean(id),
  });
}

type CourseInput = {
  title: string;
  description: string;
  capaian?: string;
  penilaian?: string;
  published?: boolean;
};

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CourseInput) => apiClient.post<CourseListItem>('/courses', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateCourse(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CourseInput>) =>
      apiClient.patch<CourseDetail>(`/courses/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: KEYS.all });
    },
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/courses/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export const courseKeys = KEYS;
