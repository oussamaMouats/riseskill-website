import { createZodDto } from "nestjs-zod";
import { UpdateCourseModuleSchema } from "@riseskill/shared";

export class UpdateCourseModuleDto extends createZodDto(UpdateCourseModuleSchema) {}
