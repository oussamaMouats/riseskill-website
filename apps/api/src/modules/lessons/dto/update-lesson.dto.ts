import { createZodDto } from "nestjs-zod";
import { UpdateLessonSchema } from "@riseskill/shared";

export class UpdateLessonDto extends createZodDto(UpdateLessonSchema) {}
