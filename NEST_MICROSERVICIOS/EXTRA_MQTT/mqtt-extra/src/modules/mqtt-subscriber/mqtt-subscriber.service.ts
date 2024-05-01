import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, MqttContext } from '@nestjs/microservices';
import { connectionMqtt } from 'src/config/mqtt-connection';

@Injectable()
export class MqttSubscriberService {
    constructor(
        @Inject(connectionMqtt.clientID)
        private readonly client: ClientProxy
    ){}

    async publishTopic(topic: string, data: any){
        try {
            await this.client.connect() //esto comprueba la conexión
            this.client.send(topic, data).subscribe()
            return true
            
        } catch (error) {
            console.error('No hay conexión')
          return false  
        }
    }
  
    getData(context: MqttContext, payload: any){
        console.log({
            topic: context.getTopic(),
            data: payload.toString()
        })

    }a
}
