import { createZodDto } from "nestjs-zod";
import { UpdateCourseTestimonialSchema } from "@riseskill/shared";

export class UpdateCourseTestimonialDto extends createZodDto(UpdateCourseTestimonialSchema) {}
