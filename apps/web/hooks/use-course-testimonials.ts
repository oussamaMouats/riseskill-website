"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CourseTestimonial, CreateCourseTestimonialInput } from "@riseskill/shared";
import { useSessionToken } from "./use-session-token";

export function useCourseTestimonials(courseId: string) {
  return useQuery({
    queryKey: ["admin", "course-testimonials", courseId],
    queryFn: () => apiClient.get<CourseTestimonial[]>(`/course-testimonials?courseId=${courseId}`),
    enabled: !!courseId,
  });
}

export function useCreateCourseTestimonial(courseId: string) {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation({
    mutationFn: (input: Omit<CreateCourseTestimonialInput, "courseId">) =>
      apiClient.post<CourseTestimonial>(
        "/course-testimonials",
        { ...input, courseId },
        { token: token ?? undefined },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "course-testimonials", courseId] });
    },
  });
}

export function useDeleteCourseTestimonial(courseId: string) {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/course-testimonials/${id}`, { token: token ?? undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "course-testimonials", courseId] });
    },
  });
}
