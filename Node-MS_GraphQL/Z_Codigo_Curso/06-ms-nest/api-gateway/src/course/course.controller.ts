import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";

import { ClientProxy } from "@nestjs/microservices";

import { AuthGuard } from "../auth/guards/auth.guard";
import { ServicesTokens } from "../enums";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Controller("course")
export class CourseController {
  private readonly logger = new Logger("Course Controller");

  constructor(
    @Inject(ServicesTokens.COURSE_SERVICE)
    private readonly courseService: ClientProxy,
  ) {}

  @Get("healt")
  healt() {
    return this.courseService.send({ cmd: "healt_course" }, {});
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query("limit", ParseIntPipe) limit: number = 5,
    @Query("page", ParseIntPipe) page = 1,
  ) {
    return this.courseService.send({ cmd: "get_all_courses" }, { limit, page });
  }

  @UseGuards(AuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.courseService.send({ cmd: "get_course" }, { id });
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto, @Request() request) {
    createCourseDto.author_id = request.user.id;

    return this.courseService.send(
      { cmd: "create_course" },
      { ...createCourseDto },
    );
  }

  @UseGuards(AuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.send(
      { cmd: "update_course" },
      { ...updateCourseDto, id },
    );
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.courseService.send({ cmd: "delete_course" }, { id });
  }

  @UseGuards(AuthGuard)
  @Delete("hard/:id")
  removeHard(@Param("id") id: string) {
    return this.courseService.send({ cmd: "hard_delete_course" }, { id });
  }
}
