import { IsOptional, IsString } from "class-validator";

// DTO => Data Transfer Object

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  author_id: string;
}
