import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ServicesTokens } from "../enums";
import { CreateCourseInput } from "./dto/create-course.input";
import { PaginationInput } from "./dto/pagination.input";
import { UpdateCourseInput } from "./dto/update-course.input";

@Injectable()
export class CoursesService {
  constructor(
    @Inject(ServicesTokens.COURSE_SERVICE)
    private readonly courseService: ClientProxy,
  ) {}

  findAll(paginationInput: PaginationInput) {
    return this.courseService.send(
      { cmd: "get_all_courses" },
      { ...paginationInput },
    );
  }

  findOne(id: string) {
    return this.courseService.send({ cmd: "get_course" }, { id });
  }

  create(createCourseInput: CreateCourseInput) {
    return this.courseService.send(
      { cmd: "create_course" },
      { ...createCourseInput },
    );
  }

  update(updateCourseInput: UpdateCourseInput) {
    return this.courseService.send(
      { cmd: "update_course" },
      { ...updateCourseInput },
    );
  }

  remove(id: string) {
    return this.courseService.send({ cmd: "delete_course" }, { id });
  }
}
