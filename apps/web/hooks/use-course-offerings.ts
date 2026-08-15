"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  CourseOffering,
  CreateCourseOfferingInput,
  UpdateCourseOfferingInput,
} from "@riseskill/shared";
import { useSessionToken } from "./use-session-token";

export function useCourseOfferings(courseId: string) {
  return useQuery({
    queryKey: ["admin", "course-offerings", courseId],
    queryFn: () => apiClient.get<CourseOffering[]>(`/course-offerings?courseId=${courseId}`),
    enabled: !!courseId,
  });
}

export function useCreateCourseOffering(courseId: string) {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation({
    mutationFn: (input: Omit<CreateCourseOfferingInput, "courseId">) =>
      apiClient.post<CourseOffering>(
        "/course-offerings",
        { ...input, courseId },
        { token: token ?? undefined },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "course-offerings", courseId] });
    },
  });
}

export function useUpdateCourseOffering(courseId: string) {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation({
    mutationFn: ({ id, ...input }: UpdateCourseOfferingInput & { id: string }) =>
      apiClient.patch<CourseOffering>(`/course-offerings/${id}`, input, {
        token: token ?? undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "course-offerings", courseId] });
    },
  });
}

export function useDeleteCourseOffering(courseId: string) {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/course-offerings/${id}`, { token: token ?? undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "course-offerings", courseId] });
    },
  });
}
