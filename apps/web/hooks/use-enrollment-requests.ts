"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { EnrollmentRequest } from "@riseskill/shared";
import { useSessionToken } from "./use-session-token";

interface PaginatedEnrollmentRequests {
  items: EnrollmentRequest[];
  total: number;
  page: number;
  limit: number;
}

export function useAdminEnrollmentRequests() {
  const token = useSessionToken();

  return useQuery({
    queryKey: ["admin", "enrollment-requests"],
    queryFn: () =>
      apiClient.get<PaginatedEnrollmentRequests>("/enrollment-requests?limit=200", {
        token: token ?? undefined,
      }),
    enabled: !!token,
  });
}
