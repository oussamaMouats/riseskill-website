import { createZodDto } from "nestjs-zod";
import { UpdateCourseFaqItemSchema } from "@riseskill/shared";

export class UpdateCourseFaqItemDto extends createZodDto(UpdateCourseFaqItemSchema) {}
