# NEST MQTT 

> nest new mqtt

- Instalo

> npm i @nestjs/microservices mqtt class-validator class-transformer

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

- Creo src/config/mqtt-connection.ts

~~~js
export const connectionMqtt={
    broker:{
        host: "192.168.0.11", 
        port: 1883

    },
    clientID: "MQTT_MICROSERVICE" //se coloca en MQTT EXPLORER/Advanced/MQTT_client (en el bottom de la interfaz)
}
~~~

- En el main

~~~js
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
~~~

- En el subscriber registro el ClientModule de @nestjs/microservices

~~~js
import { Module } from '@nestjs/common';
import { MqttSubscriberController } from './mqtt-subscriber.controller';
import { MqttSubscriberService } from './mqtt-subscriber.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { connectionMqtt } from 'src/config/mqtt-connection';

@Module({
  imports:[
    ClientsModule.register([{
      transport: Transport.MQTT,
      name: connectionMqtt.clientID,
      options:{
        url: `mqtt://${connectionMqtt.broker.host}:${connectionMqtt.broker.port}`
      
      }
    }])
  ],
  controllers: [MqttSubscriberController],
  providers: [MqttSubscriberService]
})
export class MqttSubscriberModule {}
~~~

- En el servicio tengo que inyectar el clientID para crear la conexión

~~~js
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { connectionMqtt } from 'src/config/mqtt-connection';

@Injectable()
export class MqttSubscriberService {
    constructor(
        @Inject(connectionMqtt.clientID)
        private readonly client: ClientProxy
    ){}
}
~~~
-------

## Publicando un topic

- Creo el topic con MQTT EXPLORER / Advanced /Topic (le pongo home/messages)
- Para mandar un mensaje de prueba voy al servicio (mqtt-subscriber.service)

~~~js
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { connectionMqtt } from 'src/config/mqtt-connection';

@Injectable()
export class MqttSubscriberService {
    constructor(
        @Inject(connectionMqtt.clientID)
        private readonly client: ClientProxy
    ){
        this.client.send('home/messages', 'Hello from MQTT Subscriber').subscribe()
    }
}
~~~

- Los topics se publican automáticamente, puedo poner el topic que quiera
- En MQTT Explorer recibo este objeto

~~~json
{
  "pattern": "home/messages",
  "data": "Hello from MQTT Subscriber",
  "id": "6244865aed821136c77de"
}
~~~ 

- Lo puedo serializar
- En lugar de 'Hello from MQTT Subscriber' puedo mandar un objeto json
- En el módulo subscriber añado una clase que llamaré MessageSerializer que implemenat Serializer (de @nestjs/microservices)
- Para usarla, en el objeto options creo una nueva instancia

~~~js
import { Module } from '@nestjs/common';
import { MqttSubscriberController } from './mqtt-subscriber.controller';
import { MqttSubscriberService } from './mqtt-subscriber.service';
import { ClientsModule, Serializer, Transport } from '@nestjs/microservices';
import { connectionMqtt } from 'src/config/mqtt-connection';


export class MessageSerializer implements Serializer{
  
  serialize(value: any, options?:Record<string,any>): any {
    return value.data
  }
}

@Module({
  imports:[
    ClientsModule.register([{
      transport: Transport.MQTT,
      name: connectionMqtt.clientID,
      options:{
        url: `mqtt://${connectionMqtt.broker.host}:${connectionMqtt.broker.port}`,
        serializer: new MessageSerializer()
      }
    }])
  ],
  controllers: [MqttSubscriberController],
  providers: [MqttSubscriberService]
})
export class MqttSubscriberModule {}
~~~
----

## mqtt-dto

- Creemos un DTO para enviar y publicar nuestros mensajes
- En publisher/dtos/mqtt-data.dto.ts

~~~js
import { IsNotEmpty, IsString} from "class-validator"

export class MqttDataDto{
    
    @IsString()
    @IsNotEmpty()
    topic: string
    
    @IsNotEmpty()
    data: string  //en el message no pongo string porque puede ser un objeto 
}
~~~
------

## Publicar un topic desde un endpoint

- Creo un @Post en el publisher controller

~~~js
import { Body, Controller, Post } from '@nestjs/common';
import { MqttPublisherService } from './mqtt-publisher.service';
import { MqttDataDto } from './dtos/mqtt-data.dto';

@Controller('api/v1/mqtt-publisher')
export class MqttPublisherController {
    constructor(private readonly mqttPublisherService: MqttPublisherService){

    }

    @Post('publish-topic')
    publishTopic(@Body() mqttData: MqttDataDto){   //puedo pasarle un topic "padre"
      return this.mqttPublisherService.publishTopic(`home/messages/${mqttData.topic}`, mqttData.data)
    }
}
~~~

- En el publisher service

~~~js
import { Injectable } from '@nestjs/common';

@Injectable()
export class MqttPublisherService {
    constructor(){}

    publishTopic(topic: string, data: any){
    
    }
}
~~~

- Importo el módulo de Subscriber en el imports de Publisher para poder usar el servicio

~~~js
import { Module } from '@nestjs/common';
import { MqttPublisherController } from './mqtt-publisher.controller';
import { MqttPublisherService } from './mqtt-publisher.service';
import { MqttSubscriberModule } from '../mqtt-subscriber/mqtt-subscriber.module';
import { MqttSubscriberService } from '../mqtt-subscriber/mqtt-subscriber.service';

@Module({
  imports:[MqttSubscriberModule],
  controllers: [MqttPublisherController],
  providers: [MqttPublisherService]
})
export class MqttPublisherModule {}
~~~

Debo exportar el servicio de Subscriber en su exports

~~~js
import { Module } from '@nestjs/common';
import { MqttSubscriberController } from './mqtt-subscriber.controller';
import { MqttSubscriberService } from './mqtt-subscriber.service';
import { ClientsModule, Serializer, Transport } from '@nestjs/microservices';
import { connectionMqtt } from 'src/config/mqtt-connection';


export class MessageSerializer implements Serializer{
  
  serialize(value: any, options?:Record<string,any>): any {
    return value.data
  }
}

@Module({
  imports:[
    ClientsModule.register([{
      transport: Transport.MQTT,
      name: connectionMqtt.clientID,
      options:{
        url: `mqtt://${connectionMqtt.broker.host}:${connectionMqtt.broker.port}`,
        serializer: new MessageSerializer()
      }
    }])
  ],
  controllers: [MqttSubscriberController],
  providers: [MqttSubscriberService],
  exports: [MqttSubscriberService]
})
export class MqttSubscriberModule {}
~~~

- Ahora puedo inyectar el servicio en publisher

~~~js
import { Injectable } from '@nestjs/common';
import { MqttSubscriberService } from '../mqtt-subscriber/mqtt-subscriber.service';

@Injectable()
export class MqttPublisherService {
    constructor(
        private readonly mqttSubscriberService: MqttSubscriberService
    ){}

    publishTopic(topic: string, data: any){
        return this.mqttSubscriberService.publishTopic(topic, data) //tengo que crear publish en Subscriber todavía
    }
}
~~~

- Debo crear el método publish en SubscriberService
- Le paso el topic, la data **y uso el método subscribe!!**
~~~js
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { connectionMqtt } from 'src/config/mqtt-connection';
import { MqttDataDto } from '../mqtt-publisher/dtos/mqtt-data.dto';

@Injectable()
export class MqttSubscriberService {
    constructor(
        @Inject(connectionMqtt.clientID)
        private readonly client: ClientProxy
    ){}

    publishTopic(topic: string, data: any){
        this.client.send(topic, data).subscribe()
        return true
    }  
}
~~~

- 


