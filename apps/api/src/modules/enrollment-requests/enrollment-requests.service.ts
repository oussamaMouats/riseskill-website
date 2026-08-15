import { Injectable, NotFoundException } from "@nestjs/common";
import type { CreateEnrollmentRequestInput, EnrollmentRequestQuery } from "@riseskill/shared";
import { CoursesRepository } from "../courses/courses.repository";
import { EnrollmentRequestsRepository } from "./enrollment-requests.repository";

@Injectable()
export class EnrollmentRequestsService {
  constructor(
    private readonly enrollmentRequestsRepository: EnrollmentRequestsRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async findAll(query: EnrollmentRequestQuery) {
    const [items, total] = await Promise.all([
      this.enrollmentRequestsRepository.findMany(query),
      this.enrollmentRequestsRepository.count(query),
    ]);
    return { items, total, page: query.page, limit: query.limit };
  }

  async create(data: CreateEnrollmentRequestInput) {
    const course = await this.coursesRepository.findById(data.courseId);
    if (!course) {
      throw new NotFoundException(`Course ${data.courseId} not found`);
    }
    return this.enrollmentRequestsRepository.create(data);
  }
}
