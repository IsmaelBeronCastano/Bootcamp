import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
class UserJWT {
  @Field(() => String, {
    name: "id",
    description: "id of the user",
  })
  id: string;

  @Field(() => String, {
    name: "email",
    description: "email of the user",
  })
  email: string;
}

@ObjectType()
export class Token {
  @Field(() => String, {
    name: "token",
    description: "jwt of the user",
    nullable: true,
  })
  token: string;

  @Field(() => UserJWT, {
    name: "user",
    description: "user data",
  })
  user: UserJWT;
}
