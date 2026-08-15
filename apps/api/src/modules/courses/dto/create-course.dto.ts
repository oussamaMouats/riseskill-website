import { createZodDto } from "nestjs-zod";
import { CreateCourseSchema } from "@riseskill/shared";

export class CreateCourseDto extends createZodDto(CreateCourseSchema) {}
