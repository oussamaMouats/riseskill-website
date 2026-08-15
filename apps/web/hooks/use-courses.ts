"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  Course,
  CourseWithOfferings,
  CreateCourseInput,
  UpdateCourseInput,
} from "@riseskill/shared";
import { useSessionToken } from "./use-session-token";

interface PaginatedCourses {
  items: CourseWithOfferings[];
  total: number;
  page: number;
  limit: number;
}

export function useAdminCourses() {
  return useQuery({
    queryKey: ["admin", "courses"],
    queryFn: () => apiClient.get<PaginatedCourses>("/courses?limit=200"),
  });
}

export function useAdminCourse(id: string) {
  return useQuery({
    queryKey: ["admin", "courses", id],
    queryFn: () => apiClient.get<Course>(`/courses/${id}`),
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation({
    mutationFn: (input: CreateCourseInput) =>
      apiClient.post<Course>("/courses", input, { token: token ?? undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    },
  });
}

export function useUpdateCourse(id: string) {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation({
    mutationFn: (input: UpdateCourseInput) =>
      apiClient.patch<Course>(`/courses/${id}`, input, { token: token ?? undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "courses", id] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation({
    mutationFn: (courseId: string) =>
      apiClient.delete(`/courses/${courseId}`, { token: token ?? undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    },
  });
}
