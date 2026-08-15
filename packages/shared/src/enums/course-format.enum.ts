import { z } from "zod";

// Mirrored manually in apps/api/prisma/schema.prisma (enum CourseFormat).
export const CourseFormatSchema = z.enum(["IN_PERSON", "ONLINE_LIVE", "ONLINE_SELF_PACED"]);
export type CourseFormat = z.infer<typeof CourseFormatSchema>;

export const COURSE_FORMAT_LABELS_FR: Record<CourseFormat, string> = {
  IN_PERSON: "Présentiel",
  ONLINE_LIVE: "En ligne (live)",
  ONLINE_SELF_PACED: "En ligne (à son rythme)",
};
