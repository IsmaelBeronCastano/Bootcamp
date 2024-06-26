import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { User } from "./entities/users.entity";
import { PostsService } from "./posts.service";
import { Post } from "./entities/post.entity";

@Resolver(()=>User)
export class UsersResolver{
    constructor(private readonly postsService: PostsService){

    }

    @ResolveField(()=>[Post])
    posts(@Parent() user: User) : Post[]{
        return this.postsService.forAuthor(user.id)
    }

    

}