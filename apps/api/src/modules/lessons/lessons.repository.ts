import { Injectable } from "@nestjs/common";
import { Lesson } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { CreateLessonInput, UpdateLessonInput } from "@riseskill/shared";

@Injectable()
export class LessonsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByModuleId(moduleId: string): Promise<Lesson[]> {
    return this.prisma.lesson.findMany({ where: { moduleId }, orderBy: { orderIndex: "asc" } });
  }

  findById(id: string): Promise<Lesson | null> {
    return this.prisma.lesson.findUnique({ where: { id } });
  }

  async nextOrderIndex(moduleId: string): Promise<number> {
    const last = await this.prisma.lesson.findFirst({
      where: { moduleId },
      orderBy: { orderIndex: "desc" },
    });
    return (last?.orderIndex ?? 0) + 1;
  }

  create(data: CreateLessonInput & { orderIndex: number }): Promise<Lesson> {
    return this.prisma.lesson.create({ data });
  }

  update(id: string, data: UpdateLessonInput): Promise<Lesson> {
    return this.prisma.lesson.update({ where: { id }, data });
  }

  delete(id: string): Promise<Lesson> {
    return this.prisma.lesson.delete({ where: { id } });
  }
}
