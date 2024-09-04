import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { Token } from "../auth/entities/token.entity";

export const GetAuthenticatedUserByToken = createParamDecorator(
  (data, context: ExecutionContext): Token => {
    let request = context.switchToHttp().getRequest();

    if (!request) {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    }

    return { token: request.token, user: request.user };
  },
);
