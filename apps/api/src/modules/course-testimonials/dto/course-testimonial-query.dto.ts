import { createZodDto } from "nestjs-zod";
import { CourseTestimonialQuerySchema } from "@riseskill/shared";

export class CourseTestimonialQueryDto extends createZodDto(CourseTestimonialQuerySchema) {}
