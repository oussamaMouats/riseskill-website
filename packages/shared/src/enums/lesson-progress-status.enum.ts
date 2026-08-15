import { z } from "zod";

// Mirrored manually in apps/api/prisma/schema.prisma (enum LessonProgressStatus).
export const LessonProgressStatusSchema = z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]);
export type LessonProgressStatus = z.infer<typeof LessonProgressStatusSchema>;
