'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { courseKeys } from './use-courses';
import type { ModuleItem } from '@/lib/lms-types';

type ModuleInput = { title: string; content: string; order?: number };

export function useModule(courseId: string, moduleId: string) {
  return useQuery({
    queryKey: ['modules', courseId, moduleId],
    queryFn: () => apiClient.get<ModuleItem>(`/courses/${courseId}/modules/${moduleId}`),
    enabled: Boolean(courseId && moduleId),
  });
}

export function useCreateModule(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ModuleInput) =>
      apiClient.post<ModuleItem>(`/courses/${courseId}/modules`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.detail(courseId) }),
  });
}

export function useDeleteModule(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (moduleId: string) =>
      apiClient.delete(`/courses/${courseId}/modules/${moduleId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.detail(courseId) }),
  });
}
