import { z } from "zod";

export const LessonSchema = z.object({
  id: z.string().uuid(),
  moduleId: z.string().uuid(),
  title: z.string().min(1),
  content: z.string().nullable(),
  videoUrl: z.string().nullable(),
  orderIndex: z.number().int(),
});
export type Lesson = z.infer<typeof LessonSchema>;

export const CreateLessonSchema = z.object({
  moduleId: z.string().uuid(),
  title: z.string().min(1),
  content: z.string().optional(),
  videoUrl: z.string().url().optional(),
  // Omitted = appended at the end of the module's existing lessons.
  orderIndex: z.number().int().optional(),
});
export type CreateLessonInput = z.infer<typeof CreateLessonSchema>;

export const UpdateLessonSchema = CreateLessonSchema.omit({ moduleId: true }).partial();
export type UpdateLessonInput = z.infer<typeof UpdateLessonSchema>;

export const LessonQuerySchema = z.object({
  moduleId: z.string().uuid(),
});
export type LessonQuery = z.infer<typeof LessonQuerySchema>;
