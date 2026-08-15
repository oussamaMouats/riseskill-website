import { createZodDto } from "nestjs-zod";
import { EnrollmentRequestQuerySchema } from "@riseskill/shared";

export class EnrollmentRequestQueryDto extends createZodDto(EnrollmentRequestQuerySchema) {}
