import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  CourseTestimonialQuery,
  CreateCourseTestimonialInput,
  UpdateCourseTestimonialInput,
} from "@riseskill/shared";
import { CoursesRepository } from "../courses/courses.repository";
import { CourseTestimonialsRepository } from "./course-testimonials.repository";

@Injectable()
export class CourseTestimonialsService {
  constructor(
    private readonly courseTestimonialsRepository: CourseTestimonialsRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  findAll(query: CourseTestimonialQuery) {
    return this.courseTestimonialsRepository.findByCourseId(query.courseId);
  }

  async findOne(id: string) {
    const testimonial = await this.courseTestimonialsRepository.findById(id);
    if (!testimonial) {
      throw new NotFoundException(`Course testimonial ${id} not found`);
    }
    return testimonial;
  }

  async create(data: CreateCourseTestimonialInput) {
    const course = await this.coursesRepository.findById(data.courseId);
    if (!course) {
      throw new NotFoundException(`Course ${data.courseId} not found`);
    }
    const orderIndex =
      data.orderIndex ?? (await this.courseTestimonialsRepository.nextOrderIndex(data.courseId));
    return this.courseTestimonialsRepository.create({ ...data, orderIndex });
  }

  async update(id: string, data: UpdateCourseTestimonialInput) {
    await this.findOne(id);
    return this.courseTestimonialsRepository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.courseTestimonialsRepository.delete(id);
  }
}
