import { Injectable, NotFoundException } from "@nestjs/common";
import type { CreateLessonInput, LessonQuery, UpdateLessonInput } from "@riseskill/shared";
import { CourseModulesRepository } from "../course-modules/course-modules.repository";
import { LessonsRepository } from "./lessons.repository";

@Injectable()
export class LessonsService {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly courseModulesRepository: CourseModulesRepository,
  ) {}

  findAll(query: LessonQuery) {
    return this.lessonsRepository.findByModuleId(query.moduleId);
  }

  async findOne(id: string) {
    const lesson = await this.lessonsRepository.findById(id);
    if (!lesson) {
      throw new NotFoundException(`Lesson ${id} not found`);
    }
    return lesson;
  }

  async create(data: CreateLessonInput) {
    const courseModule = await this.courseModulesRepository.findById(data.moduleId);
    if (!courseModule) {
      throw new NotFoundException(`Course module ${data.moduleId} not found`);
    }
    const orderIndex =
      data.orderIndex ?? (await this.lessonsRepository.nextOrderIndex(data.moduleId));
    return this.lessonsRepository.create({ ...data, orderIndex });
  }

  async update(id: string, data: UpdateLessonInput) {
    await this.findOne(id);
    return this.lessonsRepository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.lessonsRepository.delete(id);
  }
}
