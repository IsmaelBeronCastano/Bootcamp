import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, MqttContext } from '@nestjs/microservices';
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
  
    getData(context: MqttContext, payload: any){
        console.log({
            topic: context.getTopic(),
            data: payload.toString()
        })

    }a
}
