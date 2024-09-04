import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";

import { envs } from "../config/envs";
import { QueuesEnum, ServicesTokens } from "../enums";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesTokens.AUTH_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [envs.rmqUrl],
          queue: QueuesEnum.AuthQueue,
          queueOptions: {
            durable: true,
          },
          noAck: true,
        },
      },
    ]),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
