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
import { CourseModuleQueryDto } from "./dto/course-module-query.dto";
import { CreateCourseModuleDto } from "./dto/create-course-module.dto";
import { UpdateCourseModuleDto } from "./dto/update-course-module.dto";
import { CourseModulesService } from "./course-modules.service";

@ApiTags("course-modules")
@Controller("course-modules")
export class CourseModulesController {
  constructor(private readonly courseModulesService: CourseModulesService) {}

  @Get()
  findAll(@Query() query: CourseModuleQueryDto) {
    return this.courseModulesService.findAll(query);
  }

  @Post()
  @AdminOnly()
  create(@Body() dto: CreateCourseModuleDto) {
    return this.courseModulesService.create(dto);
  }

  @Patch(":id")
  @AdminOnly()
  update(@Param("id") id: string, @Body() dto: UpdateCourseModuleDto) {
    return this.courseModulesService.update(id, dto);
  }

  @Delete(":id")
  @AdminOnly()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.courseModulesService.remove(id);
  }
}
