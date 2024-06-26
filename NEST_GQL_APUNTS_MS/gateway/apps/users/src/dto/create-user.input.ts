import { InputType, Int, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {

  @Field(()=> ID)
  id: string

  @Field(()=> String)
  email: string

  @Field(()=> String)
  password: string

}

