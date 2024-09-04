import { IsNumber, IsOptional } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  limit = 5;

  @IsOptional()
  @IsNumber()
  page = 1;
}
