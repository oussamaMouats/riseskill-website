import { Module } from "@nestjs/common";
import { CoursesModule } from "../courses/courses.module";
import { EnrollmentRequestsController } from "./enrollment-requests.controller";
import { EnrollmentRequestsRepository } from "./enrollment-requests.repository";
import { EnrollmentRequestsService } from "./enrollment-requests.service";

@Module({
  imports: [CoursesModule],
  controllers: [EnrollmentRequestsController],
  providers: [EnrollmentRequestsService, EnrollmentRequestsRepository],
})
export class EnrollmentRequestsModule {}
