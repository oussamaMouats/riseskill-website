import { z } from "zod";

// Mirrored manually in apps/api/prisma/schema.prisma (enum EnrollmentRequestStatus).
export const EnrollmentRequestStatusSchema = z.enum([
  "PENDING",
  "FORWARDED_TO_ERP",
  "ACTIVE",
  "REJECTED",
]);
export type EnrollmentRequestStatus = z.infer<typeof EnrollmentRequestStatusSchema>;
