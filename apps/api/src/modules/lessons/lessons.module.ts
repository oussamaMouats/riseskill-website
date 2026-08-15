import { Module } from "@nestjs/common";
import { CourseModulesModule } from "../course-modules/course-modules.module";
import { LessonsController } from "./lessons.controller";
import { LessonsRepository } from "./lessons.repository";
import { LessonsService } from "./lessons.service";

@Module({
  imports: [CourseModulesModule],
  controllers: [LessonsController],
  providers: [LessonsService, LessonsRepository],
})
export class LessonsModule {}
