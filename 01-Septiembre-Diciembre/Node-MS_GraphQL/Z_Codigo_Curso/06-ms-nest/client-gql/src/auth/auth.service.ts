import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { firstValueFrom } from "rxjs";
import { ServicesTokens } from "../enums";
import { LoginInput } from "./dto/login.input";
import { RegisterInput } from "./dto/register.input";
import { Auth } from "./entities/auth.entity";
import { Token } from "./entities/token.entity";

@Injectable()
export class AuthService {
  constructor(
    @Inject(ServicesTokens.AUTH_SERVICE)
    private readonly authService: ClientProxy,
  ) {}

  async login(loginInput: LoginInput): Promise<Auth> {
    const {
      id,
      token,
      email,
      username: name,
    } = await firstValueFrom(
      this.authService.send("auth.login", { ...loginInput }),
    );

    return {
      id,
      email,
      name,
      token,
    };
  }

  async register(registerInput: RegisterInput): Promise<Auth> {
    const {
      id,
      token,
      email,
      username: name,
    } = await firstValueFrom(
      this.authService.send("auth.register", { ...registerInput }),
    );

    return {
      id,
      email,
      name,
      token,
    };
  }

  verifyToken({ token, user }: Token): Token {
    return { token, user };
  }
}
