import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import type { CourseQuery, CreateCourseInput, UpdateCourseInput } from "@riseskill/shared";
import { CoursesRepository } from "./courses.repository";

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async findAll(query: CourseQuery) {
    const [items, total] = await Promise.all([
      this.coursesRepository.findMany(query),
      this.coursesRepository.count(query),
    ]);
    return { items, total, page: query.page, limit: query.limit };
  }

  async findOne(id: string) {
    const course = await this.coursesRepository.findById(id);
    if (!course) {
      throw new NotFoundException(`Course ${id} not found`);
    }
    return course;
  }

  async findBySlugWithModules(slug: string) {
    const course = await this.coursesRepository.findBySlugWithModules(slug);
    if (!course) {
      throw new NotFoundException(`Course "${slug}" not found`);
    }
    return course;
  }

  async create(data: CreateCourseInput) {
    const existing = await this.coursesRepository.findBySlug(data.slug);
    if (existing) {
      throw new ConflictException(`A course with slug "${data.slug}" already exists`);
    }
    return this.coursesRepository.create(data);
  }

  async update(id: string, data: UpdateCourseInput) {
    await this.findOne(id);
    return this.coursesRepository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.coursesRepository.delete(id);
  }
}
