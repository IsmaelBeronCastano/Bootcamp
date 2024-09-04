import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { ServicesTokens } from "../enums";

import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";
import { AuthGuard } from "./guards/auth.guard";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(ServicesTokens.AUTH_SERVICE)
    private readonly authService: ClientProxy,
  ) {}

  @Get()
  healt() {
    return this.authService.send("auth.healt", {});
  }

  @UseGuards(AuthGuard)
  @Get("verify-token")
  verifyToken(@Request() request: any) {
    return { token: request.token, user: request.user };
  }

  @Post("login")
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.send("auth.login", { ...loginUserDto });
  }

  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.send("auth.register", { ...createUserDto });
  }
}
