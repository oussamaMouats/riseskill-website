import { createZodDto } from "nestjs-zod";
import { CreateLessonSchema } from "@riseskill/shared";

export class CreateLessonDto extends createZodDto(CreateLessonSchema) {}
