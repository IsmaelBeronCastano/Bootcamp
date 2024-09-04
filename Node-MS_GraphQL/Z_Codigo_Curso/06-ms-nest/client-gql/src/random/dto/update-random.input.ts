import { CreateRandomInput } from './create-random.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRandomInput extends PartialType(CreateRandomInput) {
  @Field(() => Int)
  id: number;
}
