import { createZodDto } from "nestjs-zod";
import { UpdateCourseSchema } from "@riseskill/shared";

export class UpdateCourseDto extends createZodDto(UpdateCourseSchema) {}
