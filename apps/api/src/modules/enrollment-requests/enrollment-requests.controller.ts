import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AdminOnly } from "../../common/decorators/admin-only.decorator";
import { CreateEnrollmentRequestDto } from "./dto/create-enrollment-request.dto";
import { EnrollmentRequestQueryDto } from "./dto/enrollment-request-query.dto";
import { EnrollmentRequestsService } from "./enrollment-requests.service";

@ApiTags("enrollment-requests")
@Controller("enrollment-requests")
export class EnrollmentRequestsController {
  constructor(private readonly enrollmentRequestsService: EnrollmentRequestsService) {}

  @Get()
  @AdminOnly()
  findAll(@Query() query: EnrollmentRequestQueryDto) {
    return this.enrollmentRequestsService.findAll(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateEnrollmentRequestDto) {
    return this.enrollmentRequestsService.create(dto);
  }
}
