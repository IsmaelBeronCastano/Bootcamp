# NEST MQTT 

> nest new mqtt

- Instalo

> npm i @nestjs/microservices class-validator class-transformer

- Dejo solo el app.module y el main
- Añado el useGlobalPipes en el main

~~~js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  await app.listen(3000);
}
bootstrap();
~~~

- Creemos los módulos necesarios (2)
- Creo la carpeta modules y dentro con nest g mo mqtt-subscriber (quien me dará los datos)
- Creo tambien su controlador y servicio con nest g co mqtt-subscriber y nest g s mqtt-subscriber
- Hago lo mismo con mqtt-publisher
- Al subscriber no lo llamaremos con endpoint 

~~~js
import { Controller } from '@nestjs/common';
import { MqttSubscriberService } from './mqtt-subscriber.service';

@Controller()
export class MqttSubscriberController {
    constructor(private readonly mqttSubscriberService: MqttSubscriberService){}
}
~~~

- Al publisher si lo llamaremos con endpoint

~~~js
import { Controller } from '@nestjs/common';
import { MqttPublisherService } from './mqtt-publisher.service';

@Controller('api/v1/mqtt-publisher')
export class MqttPublisherController {
    constructor(private readonly mqttPublisherService: MqttPublisherService){

    }
}
~~~

- Debo importarlos en app.module (siempre necesario con los módulos)

~~~js
import { Module } from '@nestjs/common';
import { MqttPublisherModule } from './modules/mqtt-publisher/mqtt-publisher.module';
import { MqttSubscriberModule } from './modules/mqtt-subscriber/mqtt-subscriber.module';


@Module({
  imports: [
    MqttPublisherModule,
    MqttSubscriberModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
~~~

- Subscriber va a estar dentro de publisher pero lo dejamos así de momento
------

## Creando la conexión con MQTT

- 

