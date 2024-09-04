import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class LoginInput {
  @Field(() => String, { name: "email", description: "User email" })
  email: string;

  @Field(() => String, { name: "password", description: "User password" })
  password: string;
}
