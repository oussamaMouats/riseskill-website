import { Module } from "@nestjs/common";
import { CoursesModule } from "../courses/courses.module";
import { CourseOfferingsController } from "./course-offerings.controller";
import { CourseOfferingsRepository } from "./course-offerings.repository";
import { CourseOfferingsService } from "./course-offerings.service";

@Module({
  imports: [CoursesModule],
  controllers: [CourseOfferingsController],
  providers: [CourseOfferingsService, CourseOfferingsRepository],
})
export class CourseOfferingsModule {}
