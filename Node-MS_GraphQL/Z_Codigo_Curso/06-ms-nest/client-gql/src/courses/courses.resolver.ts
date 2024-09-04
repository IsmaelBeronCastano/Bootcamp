import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Token } from "../auth/entities/token.entity";
import { AuthGuard } from "../auth/guards/auth.guard";
import { GetAuthenticatedUserByToken } from "../decorators/getUserByToken.decorator";
import { CoursesService } from "./courses.service";
import { CreateCourseInput } from "./dto/create-course.input";
import { PaginationInput } from "./dto/pagination.input";
import { UpdateCourseInput } from "./dto/update-course.input";
import { Course } from "./entities/course.entity";

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  @Query(() => [Course], { name: "getAllCourses" })
  @UseGuards(AuthGuard)
  findAll(@Args("paginationInput") paginationInput: PaginationInput) {
    return this.coursesService.findAll(paginationInput);
  }

  @Query(() => Course, { name: "getCourseById", nullable: true })
  @UseGuards(AuthGuard)
  findOne(@Args("id", { type: () => String }) id: string) {
    return this.coursesService.findOne(id);
  }

  @Mutation(() => Course)
  @UseGuards(AuthGuard)
  createCourse(
    @Args("createCourseInput") createCourseInput: CreateCourseInput,
    @GetAuthenticatedUserByToken() { user }: Token,
  ) {
    createCourseInput.author_id = user.id;

    return this.coursesService.create(createCourseInput);
  }

  @Mutation(() => Course)
  @UseGuards(AuthGuard)
  updateCourse(
    @Args("updateCourseInput") updateCourseInput: UpdateCourseInput,
  ) {
    return this.coursesService.update(updateCourseInput);
  }

  @Mutation(() => Course, { name: "deleteCourse" })
  @UseGuards(AuthGuard)
  removeCourse(@Args("id", { type: () => String }) id: string) {
    return this.coursesService.remove(id);
  }
}
