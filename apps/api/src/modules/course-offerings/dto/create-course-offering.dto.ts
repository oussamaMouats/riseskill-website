import { createZodDto } from "nestjs-zod";
import { CreateCourseOfferingSchema } from "@riseskill/shared";

export class CreateCourseOfferingDto extends createZodDto(CreateCourseOfferingSchema) {}
