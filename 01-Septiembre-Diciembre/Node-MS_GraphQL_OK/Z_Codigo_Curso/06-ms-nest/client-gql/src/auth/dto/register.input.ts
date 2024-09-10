import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class RegisterInput {
  @Field(() => String, { name: "email", description: "User email" })
  email: string;

  @Field(() => String, { name: "username", description: "Username" })
  username: string;

  @Field(() => String, { name: "password", description: "User password" })
  password: string;
}
