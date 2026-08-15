import { createZodDto } from "nestjs-zod";
import { CourseSchema } from "@riseskill/shared";

export class CourseResponseDto extends createZodDto(CourseSchema) {}
