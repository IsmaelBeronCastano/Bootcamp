import { PartialType } from "@nestjs/mapped-types";
import { IsUUID } from "class-validator";
import { CreateCourseDto } from "./create-course.dto";

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsUUID()
  id: string;
}
