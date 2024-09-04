import { Module } from "@nestjs/common";

import { ClientsModule, Transport } from "@nestjs/microservices";

import { CourseController } from "./course.controller";

import { QueuesEnum, ServicesTokens } from "../enums";

import { envs } from "../config/envs";

@Module({
  controllers: [CourseController],
  providers: [],
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
      {
        name: ServicesTokens.COURSE_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [envs.rmqUrl],
          queue: QueuesEnum.CoursesQueue,
          queueOptions: {
            durable: true,
          },
          noAck: true,
        },
      },
    ]),
  ],
})
export class CourseModule {}
