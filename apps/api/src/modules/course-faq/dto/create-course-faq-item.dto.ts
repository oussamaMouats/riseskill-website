import { createZodDto } from "nestjs-zod";
import { CreateCourseFaqItemSchema } from "@riseskill/shared";

export class CreateCourseFaqItemDto extends createZodDto(CreateCourseFaqItemSchema) {}
