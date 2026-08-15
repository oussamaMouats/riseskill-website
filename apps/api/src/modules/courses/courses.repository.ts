import { Injectable } from "@nestjs/common";
import { Prisma, Course } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { CourseQuery, CreateCourseInput, UpdateCourseInput } from "@riseskill/shared";

@Injectable()
export class CoursesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(
    query: Pick<CourseQuery, "categoryId" | "format" | "published" | "search">,
  ): Prisma.CourseWhereInput {
    return {
      categoryId: query.categoryId,
      published: query.published,
      ...(query.format ? { offerings: { some: { format: query.format } } } : {}),
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };
  }

  findMany(query: CourseQuery) {
    return this.prisma.course.findMany({
      where: this.buildWhere(query),
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { createdAt: "desc" },
      include: { offerings: true },
    });
  }

  count(query: CourseQuery): Promise<number> {
    return this.prisma.course.count({ where: this.buildWhere(query) });
  }

  findById(id: string): Promise<Course | null> {
    return this.prisma.course.findUnique({ where: { id } });
  }

  findBySlug(slug: string): Promise<Course | null> {
    return this.prisma.course.findUnique({ where: { slug } });
  }

  findBySlugWithModules(slug: string) {
    return this.prisma.course.findUnique({
      where: { slug },
      include: {
        modules: { orderBy: { orderIndex: "asc" } },
        offerings: true,
        testimonials: { orderBy: { orderIndex: "asc" } },
        faqItems: { orderBy: { orderIndex: "asc" } },
      },
    });
  }

  create(data: CreateCourseInput): Promise<Course> {
    return this.prisma.course.create({ data });
  }

  update(id: string, data: UpdateCourseInput): Promise<Course> {
    return this.prisma.course.update({ where: { id }, data });
  }

  delete(id: string): Promise<Course> {
    return this.prisma.course.delete({ where: { id } });
  }
}
