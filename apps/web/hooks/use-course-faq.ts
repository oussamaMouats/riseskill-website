"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CourseFaqItem, CreateCourseFaqItemInput } from "@riseskill/shared";
import { useSessionToken } from "./use-session-token";

export function useCourseFaq(courseId: string) {
  return useQuery({
    queryKey: ["admin", "course-faq", courseId],
    queryFn: () => apiClient.get<CourseFaqItem[]>(`/course-faq?courseId=${courseId}`),
    enabled: !!courseId,
  });
}

export function useCreateCourseFaqItem(courseId: string) {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation({
    mutationFn: (input: Omit<CreateCourseFaqItemInput, "courseId">) =>
      apiClient.post<CourseFaqItem>(
        "/course-faq",
        { ...input, courseId },
        { token: token ?? undefined },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "course-faq", courseId] });
    },
  });
}

export function useDeleteCourseFaqItem(courseId: string) {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/course-faq/${id}`, { token: token ?? undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "course-faq", courseId] });
    },
  });
}
