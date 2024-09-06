import { Int, Query, Resolver } from "@nestjs/graphql";

import { Random } from "./entities/random.entity";
import { RandomService } from "./random.service";

@Resolver(() => Random)
export class RandomResolver {
  constructor(private readonly randomService: RandomService) {}

  @Query(() => Int, {
    name: "getRandomNumber",
    description: "Get a random number",
  })
  findAll() {
    return this.randomService.findAll();
  }
}
