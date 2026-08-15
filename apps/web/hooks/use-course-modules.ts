"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CourseModule } from "@riseskill/shared";
import { useSessionToken } from "./use-session-token";

export function useCourseModules(courseId: string) {
  return useQuery({
    queryKey: ["admin", "course-modules", courseId],
    queryFn: () => apiClient.get<CourseModule[]>(`/course-modules?courseId=${courseId}`),
    enabled: !!courseId,
  });
}

export function useCreateCourseModule(courseId: string) {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation({
    mutationFn: (title: string) =>
      apiClient.post<CourseModule>(
        "/course-modules",
        { courseId, title },
        { token: token ?? undefined },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "course-modules", courseId] });
    },
  });
}

export function useDeleteCourseModule(courseId: string) {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation({
    mutationFn: (moduleId: string) =>
      apiClient.delete(`/course-modules/${moduleId}`, { token: token ?? undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "course-modules", courseId] });
    },
  });
}
