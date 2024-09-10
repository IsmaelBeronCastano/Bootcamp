import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

import { RpcException } from "@nestjs/microservices";
import { CreateCourseDto } from "./dto/create-course.dto";
import { PaginationDto } from "./dto/pagination.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Injectable()
export class CourseService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger("Course Service");

  async onModuleInit() {
    await this.$connect();
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const currentPage = paginationDto.page - 1;
      const limit = paginationDto.limit;

      const courses = await this.course.findMany({
        where: {
          active: true,
        },
        take: limit,
        skip: currentPage * limit,
      });

      return courses;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  findOne(id: string) {
    return this.course.findUnique({
      where: {
        id,
        active: true,
      },
    });
  }

  async create(createCourseDto: CreateCourseDto) {
    try {
      const course = await this.course.create({
        data: createCourseDto,
      });

      return course;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  update(updateCourseDto: UpdateCourseDto) {
    return this.course.update({
      data: updateCourseDto,
      where: {
        id: updateCourseDto.id,
      },
    });
  }

  remove(id: string) {
    // soft delete => Eliminación suave o eliminación lógica
    return this.course.update({
      data: {
        active: false,
      },
      where: {
        id,
      },
    });
  }

  removeHard(id: string) {
    // hard delete => Eliminación fisica
    return this.course.delete({
      where: {
        id,
      },
    });
  }
}
