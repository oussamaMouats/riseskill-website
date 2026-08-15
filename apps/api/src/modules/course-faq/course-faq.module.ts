import { Module } from "@nestjs/common";
import { CoursesModule } from "../courses/courses.module";
import { CourseFaqController } from "./course-faq.controller";
import { CourseFaqRepository } from "./course-faq.repository";
import { CourseFaqService } from "./course-faq.service";

@Module({
  imports: [CoursesModule],
  controllers: [CourseFaqController],
  providers: [CourseFaqService, CourseFaqRepository],
  exports: [CourseFaqRepository],
})
export class CourseFaqModule {}
