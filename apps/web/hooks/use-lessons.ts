"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Lesson } from "@riseskill/shared";
import { useSessionToken } from "./use-session-token";

export function useLessons(moduleId: string, enabled: boolean) {
  const token = useSessionToken();

  return useQuery({
    queryKey: ["admin", "lessons", moduleId],
    queryFn: () =>
      apiClient.get<Lesson[]>(`/lessons?moduleId=${moduleId}`, { token: token ?? undefined }),
    enabled: enabled && !!token,
  });
}

export function useCreateLesson(moduleId: string) {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation({
    mutationFn: (input: { title: string; content?: string }) =>
      apiClient.post<Lesson>("/lessons", { moduleId, ...input }, { token: token ?? undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "lessons", moduleId] });
    },
  });
}

export function useDeleteLesson(moduleId: string) {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation({
    mutationFn: (lessonId: string) =>
      apiClient.delete(`/lessons/${lessonId}`, { token: token ?? undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "lessons", moduleId] });
    },
  });
}
