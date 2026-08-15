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
import { CourseTestimonialQueryDto } from "./dto/course-testimonial-query.dto";
import { CreateCourseTestimonialDto } from "./dto/create-course-testimonial.dto";
import { UpdateCourseTestimonialDto } from "./dto/update-course-testimonial.dto";
import { CourseTestimonialsService } from "./course-testimonials.service";

@ApiTags("course-testimonials")
@Controller("course-testimonials")
export class CourseTestimonialsController {
  constructor(private readonly courseTestimonialsService: CourseTestimonialsService) {}

  @Get()
  findAll(@Query() query: CourseTestimonialQueryDto) {
    return this.courseTestimonialsService.findAll(query);
  }

  @Post()
  @AdminOnly()
  create(@Body() dto: CreateCourseTestimonialDto) {
    return this.courseTestimonialsService.create(dto);
  }

  @Patch(":id")
  @AdminOnly()
  update(@Param("id") id: string, @Body() dto: UpdateCourseTestimonialDto) {
    return this.courseTestimonialsService.update(id, dto);
  }

  @Delete(":id")
  @AdminOnly()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.courseTestimonialsService.remove(id);
  }
}
