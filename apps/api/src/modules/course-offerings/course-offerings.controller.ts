import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AdminOnly } from "../../common/decorators/admin-only.decorator";
import { CourseOfferingQueryDto } from "./dto/course-offering-query.dto";
import { CreateCourseOfferingDto } from "./dto/create-course-offering.dto";
import { UpdateCourseOfferingDto } from "./dto/update-course-offering.dto";
import { CourseOfferingsService } from "./course-offerings.service";

@ApiTags("course-offerings")
@Controller("course-offerings")
export class CourseOfferingsController {
  constructor(private readonly courseOfferingsService: CourseOfferingsService) {}

  @Get()
  findAll(@Query() query: CourseOfferingQueryDto) {
    return this.courseOfferingsService.findAll(query);
  }

  @Post()
  @AdminOnly()
  create(@Body() dto: CreateCourseOfferingDto) {
    return this.courseOfferingsService.create(dto);
  }

  @Patch(":id")
  @AdminOnly()
  update(@Param("id") id: string, @Body() dto: UpdateCourseOfferingDto) {
    return this.courseOfferingsService.update(id, dto);
  }

  @Delete(":id")
  @AdminOnly()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.courseOfferingsService.remove(id);
  }
}
