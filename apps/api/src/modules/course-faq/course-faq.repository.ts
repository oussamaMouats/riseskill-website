import { Injectable } from "@nestjs/common";
import { CourseFaqItem } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { CreateCourseFaqItemInput, UpdateCourseFaqItemInput } from "@riseskill/shared";

@Injectable()
export class CourseFaqRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByCourseId(courseId: string): Promise<CourseFaqItem[]> {
    return this.prisma.courseFaqItem.findMany({
      where: { courseId },
      orderBy: { orderIndex: "asc" },
    });
  }

  findById(id: string): Promise<CourseFaqItem | null> {
    return this.prisma.courseFaqItem.findUnique({ where: { id } });
  }

  async nextOrderIndex(courseId: string): Promise<number> {
    const last = await this.prisma.courseFaqItem.findFirst({
      where: { courseId },
      orderBy: { orderIndex: "desc" },
    });
    return (last?.orderIndex ?? 0) + 1;
  }

  create(data: CreateCourseFaqItemInput & { orderIndex: number }): Promise<CourseFaqItem> {
    return this.prisma.courseFaqItem.create({ data });
  }

  update(id: string, data: UpdateCourseFaqItemInput): Promise<CourseFaqItem> {
    return this.prisma.courseFaqItem.update({ where: { id }, data });
  }

  delete(id: string): Promise<CourseFaqItem> {
    return this.prisma.courseFaqItem.delete({ where: { id } });
  }
}
