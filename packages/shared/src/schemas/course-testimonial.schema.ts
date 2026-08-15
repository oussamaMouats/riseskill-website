import { z } from "zod";

export const CourseTestimonialSchema = z.object({
  id: z.string().uuid(),
  courseId: z.string().uuid(),
  authorName: z.string().min(1),
  authorRole: z.string().nullable(),
  photoUrl: z.string().url().nullable(),
  quote: z.string().min(1),
  rating: z.number().int().min(1).max(5).nullable(),
  orderIndex: z.number().int(),
});
export type CourseTestimonial = z.infer<typeof CourseTestimonialSchema>;

export const CreateCourseTestimonialSchema = z.object({
  courseId: z.string().uuid(),
  authorName: z.string().min(1),
  authorRole: z.string().optional(),
  photoUrl: z.string().url().optional(),
  quote: z.string().min(1),
  rating: z.number().int().min(1).max(5).optional(),
  // Omitted = appended at the end of the course's existing testimonials.
  orderIndex: z.number().int().optional(),
});
export type CreateCourseTestimonialInput = z.infer<typeof CreateCourseTestimonialSchema>;

export const UpdateCourseTestimonialSchema = CreateCourseTestimonialSchema.omit({
  courseId: true,
}).partial();
export type UpdateCourseTestimonialInput = z.infer<typeof UpdateCourseTestimonialSchema>;

export const CourseTestimonialQuerySchema = z.object({
  courseId: z.string().uuid(),
});
export type CourseTestimonialQuery = z.infer<typeof CourseTestimonialQuerySchema>;
