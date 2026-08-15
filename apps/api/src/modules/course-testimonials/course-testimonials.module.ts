import { Module } from "@nestjs/common";
import { CoursesModule } from "../courses/courses.module";
import { CourseTestimonialsController } from "./course-testimonials.controller";
import { CourseTestimonialsRepository } from "./course-testimonials.repository";
import { CourseTestimonialsService } from "./course-testimonials.service";

@Module({
  imports: [CoursesModule],
  controllers: [CourseTestimonialsController],
  providers: [CourseTestimonialsService, CourseTestimonialsRepository],
  exports: [CourseTestimonialsRepository],
})
export class CourseTestimonialsModule {}
