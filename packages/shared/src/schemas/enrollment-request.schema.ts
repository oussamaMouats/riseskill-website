import { z } from "zod";
import { CourseFormatSchema } from "../enums/course-format.enum";
import { EnrollmentRequestStatusSchema } from "../enums/enrollment-request-status.enum";
import { PaginationQuerySchema } from "./common.schema";

export const EnrollmentRequestSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().nullable(),
  courseId: z.string().uuid(),
  format: CourseFormatSchema,
  message: z.string().nullable(),
  status: EnrollmentRequestStatusSchema,
  createdAt: z.coerce.date(),
});
export type EnrollmentRequest = z.infer<typeof EnrollmentRequestSchema>;

// Public site submission — no status, always starts at PENDING server-side.
export const CreateEnrollmentRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  courseId: z.string().uuid(),
  format: CourseFormatSchema,
  message: z.string().optional(),
});
export type CreateEnrollmentRequestInput = z.infer<typeof CreateEnrollmentRequestSchema>;

export const EnrollmentRequestQuerySchema = PaginationQuerySchema.extend({
  status: EnrollmentRequestStatusSchema.optional(),
});
export type EnrollmentRequestQuery = z.infer<typeof EnrollmentRequestQuerySchema>;
