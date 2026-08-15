import { createZodDto } from "nestjs-zod";
import { UpdateCourseOfferingSchema } from "@riseskill/shared";

export class UpdateCourseOfferingDto extends createZodDto(UpdateCourseOfferingSchema) {}
