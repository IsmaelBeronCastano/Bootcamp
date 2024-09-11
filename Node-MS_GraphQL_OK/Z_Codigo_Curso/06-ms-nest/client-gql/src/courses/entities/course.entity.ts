import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Course {
  @Field(() => String, { description: "ID by course" })
  id: string;

  @Field(() => String, { description: "title by course" })
  title: string;

  @Field(() => String, { description: "description by course" })
  description: string;

  @Field(() => String, { description: "Author ID by course" })
  author_id: string;
}
