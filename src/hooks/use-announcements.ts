'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { courseKeys } from './use-courses';
import type { Announcement } from '@/lib/lms-types';

type AnnouncementInput = { title: string; content: string; pinned?: boolean };

export function useCreateAnnouncement(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AnnouncementInput) =>
      apiClient.post<Announcement>(`/courses/${courseId}/announcements`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.detail(courseId) }),
  });
}

export function useDeleteAnnouncement(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (announcementId: string) =>
      apiClient.delete(`/courses/${courseId}/announcements/${announcementId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.detail(courseId) }),
  });
}
