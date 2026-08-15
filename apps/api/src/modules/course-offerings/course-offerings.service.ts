import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import type {
  CourseOfferingQuery,
  CreateCourseOfferingInput,
  UpdateCourseOfferingInput,
} from "@riseskill/shared";
import { CoursesRepository } from "../courses/courses.repository";
import { CourseOfferingsRepository } from "./course-offerings.repository";

@Injectable()
export class CourseOfferingsService {
  constructor(
    private readonly courseOfferingsRepository: CourseOfferingsRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  findAll(query: CourseOfferingQuery) {
    return this.courseOfferingsRepository.findByCourseId(query.courseId);
  }

  async findOne(id: string) {
    const offering = await this.courseOfferingsRepository.findById(id);
    if (!offering) {
      throw new NotFoundException(`Course offering ${id} not found`);
    }
    return offering;
  }

  async create(data: CreateCourseOfferingInput) {
    const course = await this.coursesRepository.findById(data.courseId);
    if (!course) {
      throw new NotFoundException(`Course ${data.courseId} not found`);
    }
    const existing = await this.courseOfferingsRepository.findByCourseAndFormat(
      data.courseId,
      data.format,
    );
    if (existing) {
      throw new ConflictException(
        `This course already has an offering for format "${data.format}"`,
      );
    }
    return this.courseOfferingsRepository.create(data);
  }

  async update(id: string, data: UpdateCourseOfferingInput) {
    await this.findOne(id);
    return this.courseOfferingsRepository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.courseOfferingsRepository.delete(id);
  }
}
