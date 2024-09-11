import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

import { CourseService } from "./course.service";
import { PaginationDto } from "./dto/pagination.dto";

@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @MessagePattern({ cmd: "healt_course" })
  healt() {
    return { healt: true };
  }

  @MessagePattern({ cmd: "get_all_courses" })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.courseService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: "get_course" })
  findOne(@Payload("id") id: string) {
    return this.courseService.findOne(id);
  }

  @MessagePattern({ cmd: "create_course" })
  create(@Payload() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @MessagePattern({ cmd: "update_course" })
  update(@Payload() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(updateCourseDto);
  }

  @MessagePattern({ cmd: "delete_course" })
  remove(@Payload("id") id: string) {
    return this.courseService.remove(id);
  }

  @MessagePattern({ cmd: "hard_delete_course" })
  removeHard(@Payload("id") id: string) {
    return this.courseService.removeHard(id);
  }
}
