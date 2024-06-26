import { InputType, Int, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {

    @Field(()=>ID)
    id: string;
  
    @Field()
    body: string;
  
    @Field()
    authorId: string;


}
  

