import { Injectable } from "@nestjs/common";
import { EnrollmentRequest, Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { CreateEnrollmentRequestInput, EnrollmentRequestQuery } from "@riseskill/shared";

@Injectable()
export class EnrollmentRequestsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(
    query: Pick<EnrollmentRequestQuery, "status">,
  ): Prisma.EnrollmentRequestWhereInput {
    return { status: query.status };
  }

  findMany(query: EnrollmentRequestQuery): Promise<EnrollmentRequest[]> {
    return this.prisma.enrollmentRequest.findMany({
      where: this.buildWhere(query),
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { createdAt: "desc" },
    });
  }

  count(query: EnrollmentRequestQuery): Promise<number> {
    return this.prisma.enrollmentRequest.count({ where: this.buildWhere(query) });
  }

  findById(id: string): Promise<EnrollmentRequest | null> {
    return this.prisma.enrollmentRequest.findUnique({ where: { id } });
  }

  create(data: CreateEnrollmentRequestInput): Promise<EnrollmentRequest> {
    return this.prisma.enrollmentRequest.create({ data });
  }
}
