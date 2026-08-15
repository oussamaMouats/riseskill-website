import { createZodDto } from "nestjs-zod";
import { CreateCourseTestimonialSchema } from "@riseskill/shared";

export class CreateCourseTestimonialDto extends createZodDto(CreateCourseTestimonialSchema) {}
