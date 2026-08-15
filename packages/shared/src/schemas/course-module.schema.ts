import { z } from "zod";
import { CourseSchema } from "./course.schema";
import { CourseOfferingSchema } from "./course-offering.schema";
import { CourseTestimonialSchema } from "./course-testimonial.schema";
import { CourseFaqItemSchema } from "./course-faq.schema";

export const CourseModuleSchema = z.object({
  id: z.string().uuid(),
  courseId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().nullable(),
  orderIndex: z.number().int(),
});
export type CourseModule = z.infer<typeof CourseModuleSchema>;

export const CreateCourseModuleSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  // Omitted = appended at the end of the course's existing modules.
  orderIndex: z.number().int().optional(),
});
export type CreateCourseModuleInput = z.infer<typeof CreateCourseModuleSchema>;

export const UpdateCourseModuleSchema = CreateCourseModuleSchema.omit({ courseId: true }).partial();
export type UpdateCourseModuleInput = z.infer<typeof UpdateCourseModuleSchema>;

export const CourseModuleQuerySchema = z.object({
  courseId: z.string().uuid(),
});
export type CourseModuleQuery = z.infer<typeof CourseModuleQuerySchema>;

// Course detail view: base course fields + its programme (modules), its
// priced/scheduled variants (offerings), and its landing-page content
// (testimonials, FAQ) — consumed by both the catalog detail page and the
// dedicated ads landing route.
export const CourseWithModulesSchema = CourseSchema.extend({
  modules: z.array(CourseModuleSchema),
  offerings: z.array(CourseOfferingSchema),
  testimonials: z.array(CourseTestimonialSchema),
  faqItems: z.array(CourseFaqItemSchema),
});
export type CourseWithModules = z.infer<typeof CourseWithModulesSchema>;
