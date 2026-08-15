import { z } from "zod";
import { CourseFormatSchema } from "../enums/course-format.enum";
import { CourseSchema } from "./course.schema";

export const CourseOfferingSchema = z.object({
  id: z.string().uuid(),
  courseId: z.string().uuid(),
  format: CourseFormatSchema,
  price: z.number().int().nonnegative().nullable(),
  currency: z.string(),
  durationLabel: z.string().nullable(),
});
export type CourseOffering = z.infer<typeof CourseOfferingSchema>;

export const CreateCourseOfferingSchema = z.object({
  courseId: z.string().uuid(),
  format: CourseFormatSchema,
  price: z.number().int().nonnegative().optional(),
  currency: z.string().optional(),
  durationLabel: z.string().optional(),
});
export type CreateCourseOfferingInput = z.infer<typeof CreateCourseOfferingSchema>;

export const UpdateCourseOfferingSchema = CreateCourseOfferingSchema.omit({
  courseId: true,
  format: true,
}).partial();
export type UpdateCourseOfferingInput = z.infer<typeof UpdateCourseOfferingSchema>;

export const CourseOfferingQuerySchema = z.object({
  courseId: z.string().uuid(),
});
export type CourseOfferingQuery = z.infer<typeof CourseOfferingQuerySchema>;

// Card/list view: base course fields + its offerings, enough to show a price
// range and format badges without the full programme (modules/lessons).
export const CourseWithOfferingsSchema = CourseSchema.extend({
  offerings: z.array(CourseOfferingSchema),
});
export type CourseWithOfferings = z.infer<typeof CourseWithOfferingsSchema>;
