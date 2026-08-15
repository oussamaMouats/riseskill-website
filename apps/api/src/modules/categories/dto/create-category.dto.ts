import { createZodDto } from "nestjs-zod";
import { CreateCategorySchema } from "@riseskill/shared";

export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}
