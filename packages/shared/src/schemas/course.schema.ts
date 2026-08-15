import { z } from "zod";
import { CourseFormatSchema } from "../enums/course-format.enum";
import { PaginationQuerySchema } from "./common.schema";

export const CourseSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().nullable(),
  description: z.string().min(1),
  categoryId: z.string().uuid().nullable(),
  level: z.string().nullable(),
  techStack: z.array(z.string()),
  objectives: z.array(z.string()),
  coverImageUrl: z.string().url().nullable(),
  published: z.boolean(),
  // --- Ads landing page content ---
  promoHeadline: z.string().nullable(),
  promoSubheadline: z.string().nullable(),
  heroVideoUrl: z.string().url().nullable(),
  enrolledCount: z.number().int().nonnegative().nullable(),
  trustBadges: z.array(z.string()),
  guaranteeText: z.string().nullable(),
  urgencyText: z.string().nullable(),
  instructorName: z.string().nullable(),
  instructorTitle: z.string().nullable(),
  instructorPhotoUrl: z.string().url().nullable(),
  instructorBio: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Course = z.infer<typeof CourseSchema>;

export const CreateCourseSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().optional(),
  description: z.string().min(1),
  categoryId: z.string().uuid().optional(),
  level: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
  coverImageUrl: z.string().url().optional(),
  published: z.boolean().optional(),
  promoHeadline: z.string().optional(),
  promoSubheadline: z.string().optional(),
  heroVideoUrl: z.string().url().optional(),
  enrolledCount: z.number().int().nonnegative().optional(),
  trustBadges: z.array(z.string()).optional(),
  guaranteeText: z.string().optional(),
  urgencyText: z.string().optional(),
  instructorName: z.string().optional(),
  instructorTitle: z.string().optional(),
  instructorPhotoUrl: z.string().url().optional(),
  instructorBio: z.string().optional(),
});
export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;

export const UpdateCourseSchema = CreateCourseSchema.partial();
export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;

export const CourseQuerySchema = PaginationQuerySchema.extend({
  categoryId: z.string().uuid().optional(),
  // Matches courses that have at least one offering in this format.
  format: CourseFormatSchema.optional(),
  published: z.coerce.boolean().optional(),
  search: z.string().min(1).optional(),
});
export type CourseQuery = z.infer<typeof CourseQuerySchema>;
