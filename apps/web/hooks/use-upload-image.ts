"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useSessionToken } from "./use-session-token";

export function useUploadImage() {
  const token = useSessionToken();

  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiClient.upload<{ url: string }>("/uploads", formData, { token: token ?? undefined });
    },
  });
}
