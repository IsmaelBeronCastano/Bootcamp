import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Auth {
  @Field(() => String, {
    name: "id",
    description: "id of the user",
  })
  id: string;

  @Field(() => String, {
    name: "name",
    description: "name of the user",
  })
  name: string;

  @Field(() => String, {
    name: "email",
    description: "email of the user",
  })
  email: string;

  @Field(() => String, {
    name: "token",
    description: "jwt of the user",
    nullable: true,
  })
  token: string;
}
