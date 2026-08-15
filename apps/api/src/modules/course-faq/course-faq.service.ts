import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  CourseFaqItemQuery,
  CreateCourseFaqItemInput,
  UpdateCourseFaqItemInput,
} from "@riseskill/shared";
import { CoursesRepository } from "../courses/courses.repository";
import { CourseFaqRepository } from "./course-faq.repository";

@Injectable()
export class CourseFaqService {
  constructor(
    private readonly courseFaqRepository: CourseFaqRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  findAll(query: CourseFaqItemQuery) {
    return this.courseFaqRepository.findByCourseId(query.courseId);
  }

  async findOne(id: string) {
    const item = await this.courseFaqRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`Course FAQ item ${id} not found`);
    }
    return item;
  }

  async create(data: CreateCourseFaqItemInput) {
    const course = await this.coursesRepository.findById(data.courseId);
    if (!course) {
      throw new NotFoundException(`Course ${data.courseId} not found`);
    }
    const orderIndex =
      data.orderIndex ?? (await this.courseFaqRepository.nextOrderIndex(data.courseId));
    return this.courseFaqRepository.create({ ...data, orderIndex });
  }

  async update(id: string, data: UpdateCourseFaqItemInput) {
    await this.findOne(id);
    return this.courseFaqRepository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.courseFaqRepository.delete(id);
  }
}
