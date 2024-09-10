import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { GqlExecutionContext } from "@nestjs/graphql";
import { ClientProxy } from "@nestjs/microservices";
import { Request } from "express";
import { firstValueFrom } from "rxjs";
import { ServicesTokens } from "../../enums";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(ServicesTokens.AUTH_SERVICE)
    private readonly authService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request = context.switchToHttp().getRequest();

    if (!request) {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    const { token: renewToken, user } = await firstValueFrom(
      this.authService.send("auth.verify.token", { token }),
    );

    request["token"] = renewToken;
    request["user"] = user;

    return renewToken;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];

    return type === "Bearer" ? token : undefined;
  }
}
