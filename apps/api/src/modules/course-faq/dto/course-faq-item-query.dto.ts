import { createZodDto } from "nestjs-zod";
import { CourseFaqItemQuerySchema } from "@riseskill/shared";

export class CourseFaqItemQueryDto extends createZodDto(CourseFaqItemQuerySchema) {}
