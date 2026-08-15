import { createZodDto } from "nestjs-zod";
import { UpdateCategorySchema } from "@riseskill/shared";

export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}
