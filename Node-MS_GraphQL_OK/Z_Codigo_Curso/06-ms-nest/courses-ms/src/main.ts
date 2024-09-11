import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { AppModule } from "./app.module";
import { QueuesEnum } from "./enums/queue.enum";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RMQ_URL],
        queue: QueuesEnum.CoursesQueue,
        queueOptions: {
          durable: true,
        },
        noAck: true,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();
}
bootstrap();
