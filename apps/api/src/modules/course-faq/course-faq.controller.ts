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
import { CourseFaqItemQueryDto } from "./dto/course-faq-item-query.dto";
import { CreateCourseFaqItemDto } from "./dto/create-course-faq-item.dto";
import { UpdateCourseFaqItemDto } from "./dto/update-course-faq-item.dto";
import { CourseFaqService } from "./course-faq.service";

@ApiTags("course-faq")
@Controller("course-faq")
export class CourseFaqController {
  constructor(private readonly courseFaqService: CourseFaqService) {}

  @Get()
  findAll(@Query() query: CourseFaqItemQueryDto) {
    return this.courseFaqService.findAll(query);
  }

  @Post()
  @AdminOnly()
  create(@Body() dto: CreateCourseFaqItemDto) {
    return this.courseFaqService.create(dto);
  }

  @Patch(":id")
  @AdminOnly()
  update(@Param("id") id: string, @Body() dto: UpdateCourseFaqItemDto) {
    return this.courseFaqService.update(id, dto);
  }

  @Delete(":id")
  @AdminOnly()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.courseFaqService.remove(id);
  }
}
