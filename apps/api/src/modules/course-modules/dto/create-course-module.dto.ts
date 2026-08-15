import { createZodDto } from "nestjs-zod";
import { CreateCourseModuleSchema } from "@riseskill/shared";

export class CreateCourseModuleDto extends createZodDto(CreateCourseModuleSchema) {}
