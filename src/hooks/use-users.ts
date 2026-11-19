'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

/**
 * Feature hooks co-locate query keys, fetching, and mutations.
 * Components import these — they never call apiClient directly.
 *
 * Pattern: one hook file per feature (use-users, use-posts, etc.)
 */
const KEYS = {
  all: ['users'] as const,
  list: (page: number, pageSize: number) => ['users', 'list', page, pageSize] as const,
  detail: (id: string) => ['users', 'detail', id] as const,
};

type User = { id: string; email: string; name: string; createdAt: string };
type ListResult = { items: User[]; total: number; page: number; totalPages: number };

export function useUsers(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: KEYS.list(page, pageSize),
    queryFn: () =>
      apiClient.get<ListResult>(`/users?page=${page}&pageSize=${pageSize}`),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => apiClient.get<User>(`/users/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; name: string }) =>
      apiClient.post<User>('/users', data),
    onSuccess: () => {
      // Invalidate list so it refetches after a new user is created
      queryClient.invalidateQueries({ queryKey: KEYS.all });
    },
  });
}
