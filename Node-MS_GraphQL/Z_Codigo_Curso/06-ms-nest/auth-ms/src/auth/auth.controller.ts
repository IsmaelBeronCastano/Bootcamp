import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";

import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern("auth.healt")
  healt() {
    return { status: 200, message: "ok" };
  }

  @MessagePattern("auth.verify.token")
  verifyToken(@Payload("token") token: string) {
    return this.authService.verifyToken(token);
  }

  @MessagePattern("auth.login")
  login(@Payload() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @MessagePattern("auth.register")
  register(@Payload() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
