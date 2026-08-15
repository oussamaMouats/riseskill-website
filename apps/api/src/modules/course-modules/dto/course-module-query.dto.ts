import { createZodDto } from "nestjs-zod";
import { CourseModuleQuerySchema } from "@riseskill/shared";

export class CourseModuleQueryDto extends createZodDto(CourseModuleQuerySchema) {}
