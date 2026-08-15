import { z } from "zod";

export const CourseFaqItemSchema = z.object({
  id: z.string().uuid(),
  courseId: z.string().uuid(),
  question: z.string().min(1),
  answer: z.string().min(1),
  orderIndex: z.number().int(),
});
export type CourseFaqItem = z.infer<typeof CourseFaqItemSchema>;

export const CreateCourseFaqItemSchema = z.object({
  courseId: z.string().uuid(),
  question: z.string().min(1),
  answer: z.string().min(1),
  // Omitted = appended at the end of the course's existing FAQ items.
  orderIndex: z.number().int().optional(),
});
export type CreateCourseFaqItemInput = z.infer<typeof CreateCourseFaqItemSchema>;

export const UpdateCourseFaqItemSchema = CreateCourseFaqItemSchema.omit({
  courseId: true,
}).partial();
export type UpdateCourseFaqItemInput = z.infer<typeof UpdateCourseFaqItemSchema>;

export const CourseFaqItemQuerySchema = z.object({
  courseId: z.string().uuid(),
});
export type CourseFaqItemQuery = z.infer<typeof CourseFaqItemQuerySchema>;
