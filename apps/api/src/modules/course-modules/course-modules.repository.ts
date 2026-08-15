import { Injectable } from "@nestjs/common";
import { CourseModule } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { CreateCourseModuleInput, UpdateCourseModuleInput } from "@riseskill/shared";

@Injectable()
export class CourseModulesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByCourseId(courseId: string): Promise<CourseModule[]> {
    return this.prisma.courseModule.findMany({
      where: { courseId },
      orderBy: { orderIndex: "asc" },
    });
  }

  findById(id: string): Promise<CourseModule | null> {
    return this.prisma.courseModule.findUnique({ where: { id } });
  }

  async nextOrderIndex(courseId: string): Promise<number> {
    const last = await this.prisma.courseModule.findFirst({
      where: { courseId },
      orderBy: { orderIndex: "desc" },
    });
    return (last?.orderIndex ?? 0) + 1;
  }

  create(data: CreateCourseModuleInput & { orderIndex: number }): Promise<CourseModule> {
    return this.prisma.courseModule.create({ data });
  }

  update(id: string, data: UpdateCourseModuleInput): Promise<CourseModule> {
    return this.prisma.courseModule.update({ where: { id }, data });
  }

  delete(id: string): Promise<CourseModule> {
    return this.prisma.courseModule.delete({ where: { id } });
  }
}
