import { createZodDto } from "nestjs-zod";
import { CourseOfferingQuerySchema } from "@riseskill/shared";

export class CourseOfferingQueryDto extends createZodDto(CourseOfferingQuerySchema) {}
