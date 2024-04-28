import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { connectionMqtt } from './config/mqtt-connection';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.connectMicroservice({
    transport:Transport.MQTT,
    options:{
      url:`mqtt://${connectionMqtt.broker.host}:${connectionMqtt.broker.port}`
    }
  })
  
  app.startAllMicroservices()
  await app.listen(3000);
}
bootstrap();
