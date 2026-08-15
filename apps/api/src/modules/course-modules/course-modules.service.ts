import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  CourseModuleQuery,
  CreateCourseModuleInput,
  UpdateCourseModuleInput,
} from "@riseskill/shared";
import { CoursesRepository } from "../courses/courses.repository";
import { CourseModulesRepository } from "./course-modules.repository";

@Injectable()
export class CourseModulesService {
  constructor(
    private readonly courseModulesRepository: CourseModulesRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  findAll(query: CourseModuleQuery) {
    return this.courseModulesRepository.findByCourseId(query.courseId);
  }

  async findOne(id: string) {
    const courseModule = await this.courseModulesRepository.findById(id);
    if (!courseModule) {
      throw new NotFoundException(`Course module ${id} not found`);
    }
    return courseModule;
  }

  async create(data: CreateCourseModuleInput) {
    const course = await this.coursesRepository.findById(data.courseId);
    if (!course) {
      throw new NotFoundException(`Course ${data.courseId} not found`);
    }
    const orderIndex =
      data.orderIndex ?? (await this.courseModulesRepository.nextOrderIndex(data.courseId));
    return this.courseModulesRepository.create({ ...data, orderIndex });
  }

  async update(id: string, data: UpdateCourseModuleInput) {
    await this.findOne(id);
    return this.courseModulesRepository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.courseModulesRepository.delete(id);
  }
}
