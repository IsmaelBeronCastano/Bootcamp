import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true, description: "Page number" })
  page?: number;

  @Field(() => Int, { nullable: true, description: "Limit results" })
  limit?: number;
}
