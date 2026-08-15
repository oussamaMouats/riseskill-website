import { createZodDto } from "nestjs-zod";
import { EnrollmentRequestSchema } from "@riseskill/shared";

export class EnrollmentRequestResponseDto extends createZodDto(EnrollmentRequestSchema) {}
