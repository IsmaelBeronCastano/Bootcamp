import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateCourseInput {
  @Field(() => String, { description: "Course title" })
  title: string;

  @Field(() => String, { description: "Course description" })
  description: string;

  @Field(() => String, { description: "Course Author ID", nullable: true })
  author_id?: string;
}
