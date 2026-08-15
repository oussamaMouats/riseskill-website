"use client";

import { useState } from "react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { CreateEnrollmentRequestInput } from "@riseskill/shared";

export function useEnrollmentRequest() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(input: CreateEnrollmentRequestInput): Promise<boolean> {
    setStatus("submitting");
    setError(null);
    try {
      await apiClient.post("/enrollment-requests", input);
      setStatus("success");
      return true;
    } catch (err) {
      setError(
        err instanceof ApiError ? "Vérifiez les informations saisies." : "Une erreur est survenue.",
      );
      setStatus("error");
      return false;
    }
  }

  return { status, error, submit };
}
