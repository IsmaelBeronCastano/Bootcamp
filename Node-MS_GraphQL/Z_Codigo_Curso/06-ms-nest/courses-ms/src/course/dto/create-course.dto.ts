import { IsString } from "class-validator";

// DTO => Data Transfer Object

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  author_id: string;
}
