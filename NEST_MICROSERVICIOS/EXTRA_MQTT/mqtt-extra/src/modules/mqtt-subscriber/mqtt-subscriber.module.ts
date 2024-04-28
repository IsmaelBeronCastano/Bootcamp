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
