import { Injectable } from "@nestjs/common";
import { CourseTestimonial } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { CreateCourseTestimonialInput, UpdateCourseTestimonialInput } from "@riseskill/shared";

@Injectable()
export class CourseTestimonialsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByCourseId(courseId: string): Promise<CourseTestimonial[]> {
    return this.prisma.courseTestimonial.findMany({
      where: { courseId },
      orderBy: { orderIndex: "asc" },
    });
  }

  findById(id: string): Promise<CourseTestimonial | null> {
    return this.prisma.courseTestimonial.findUnique({ where: { id } });
  }

  async nextOrderIndex(courseId: string): Promise<number> {
    const last = await this.prisma.courseTestimonial.findFirst({
      where: { courseId },
      orderBy: { orderIndex: "desc" },
    });
    return (last?.orderIndex ?? 0) + 1;
  }

  create(data: CreateCourseTestimonialInput & { orderIndex: number }): Promise<CourseTestimonial> {
    return this.prisma.courseTestimonial.create({ data });
  }

  update(id: string, data: UpdateCourseTestimonialInput): Promise<CourseTestimonial> {
    return this.prisma.courseTestimonial.update({ where: { id }, data });
  }

  delete(id: string): Promise<CourseTestimonial> {
    return this.prisma.courseTestimonial.delete({ where: { id } });
  }
}
