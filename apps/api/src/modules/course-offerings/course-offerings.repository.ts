import { Injectable } from "@nestjs/common";
import { CourseOffering } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { CreateCourseOfferingInput, UpdateCourseOfferingInput } from "@riseskill/shared";

@Injectable()
export class CourseOfferingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByCourseId(courseId: string): Promise<CourseOffering[]> {
    return this.prisma.courseOffering.findMany({
      where: { courseId },
      orderBy: { createdAt: "asc" },
    });
  }

  findById(id: string): Promise<CourseOffering | null> {
    return this.prisma.courseOffering.findUnique({ where: { id } });
  }

  findByCourseAndFormat(
    courseId: string,
    format: CourseOffering["format"],
  ): Promise<CourseOffering | null> {
    return this.prisma.courseOffering.findUnique({
      where: { courseId_format: { courseId, format } },
    });
  }

  create(data: CreateCourseOfferingInput): Promise<CourseOffering> {
    return this.prisma.courseOffering.create({ data });
  }

  update(id: string, data: UpdateCourseOfferingInput): Promise<CourseOffering> {
    return this.prisma.courseOffering.update({ where: { id }, data });
  }

  delete(id: string): Promise<CourseOffering> {
    return this.prisma.courseOffering.delete({ where: { id } });
  }
}
