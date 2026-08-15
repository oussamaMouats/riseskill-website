import { createZodDto } from "nestjs-zod";
import { CreateEnrollmentRequestSchema } from "@riseskill/shared";

export class CreateEnrollmentRequestDto extends createZodDto(CreateEnrollmentRequestSchema) {}
