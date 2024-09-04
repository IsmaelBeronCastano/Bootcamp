import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { AuthService } from "./auth.service";

import { AuthGuard } from "./guards/auth.guard";

import { LoginInput } from "./dto/login.input";
import { RegisterInput } from "./dto/register.input";

import { GetAuthenticatedUserByToken } from "../decorators/getUserByToken.decorator";
import { Auth } from "./entities/auth.entity";
import { Token } from "./entities/token.entity";

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth, { name: "login" })
  login(@Args("loginInput") loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => Auth, { name: "register" })
  register(@Args("registerInput") registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Query(() => Token, { name: "verifyJWT" })
  @UseGuards(AuthGuard)
  verifyToken(@GetAuthenticatedUserByToken() user: Token) {
    return this.authService.verifyToken(user);
  }
}
