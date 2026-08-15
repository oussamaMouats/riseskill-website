import { createZodDto } from "nestjs-zod";
import { CourseQuerySchema } from "@riseskill/shared";

export class CourseQueryDto extends createZodDto(CourseQuerySchema) {}
