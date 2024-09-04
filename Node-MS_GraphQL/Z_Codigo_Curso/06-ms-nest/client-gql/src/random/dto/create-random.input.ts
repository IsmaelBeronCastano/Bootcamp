import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRandomInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
