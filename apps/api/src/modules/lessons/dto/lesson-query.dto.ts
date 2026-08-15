import { createZodDto } from "nestjs-zod";
import { LessonQuerySchema } from "@riseskill/shared";

export class LessonQueryDto extends createZodDto(LessonQuerySchema) {}
