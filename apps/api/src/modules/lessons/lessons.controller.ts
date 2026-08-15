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
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { LessonQueryDto } from "./dto/lesson-query.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { LessonsService } from "./lessons.service";

@ApiTags("lessons")
@Controller("lessons")
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @AdminOnly()
  findAll(@Query() query: LessonQueryDto) {
    return this.lessonsService.findAll(query);
  }

  @Post()
  @AdminOnly()
  create(@Body() dto: CreateLessonDto) {
    return this.lessonsService.create(dto);
  }

  @Patch(":id")
  @AdminOnly()
  update(@Param("id") id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonsService.update(id, dto);
  }

  @Delete(":id")
  @AdminOnly()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.lessonsService.remove(id);
  }
}
