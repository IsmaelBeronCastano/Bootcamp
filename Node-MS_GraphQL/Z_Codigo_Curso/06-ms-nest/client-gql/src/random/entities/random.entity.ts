import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Random {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
