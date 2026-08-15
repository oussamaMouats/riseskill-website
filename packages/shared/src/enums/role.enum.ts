import { z } from "zod";

// App-level guard concept only — riseskill stores admins/students in separate
// Prisma tables (AdminProfile/StudentProfile), not a shared role column.
export const RoleSchema = z.enum(["ADMIN", "STUDENT"]);
export type Role = z.infer<typeof RoleSchema>;
