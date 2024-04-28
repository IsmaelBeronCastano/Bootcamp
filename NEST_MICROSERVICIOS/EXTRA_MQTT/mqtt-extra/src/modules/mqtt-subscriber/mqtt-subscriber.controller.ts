import { Controller } from '@nestjs/common';
import { MqttSubscriberService } from './mqtt-subscriber.service';
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';

@Controller()
export class MqttSubscriberController {
    constructor(private readonly mqttSubscriberService: MqttSubscriberService){}

    @MessagePattern('home/messages/#') //que esté pendiente del topic
    listenTopic(@Ctx() context: MqttContext, @Payload() payload: any){ 

        return this.mqttSubscriberService.getData(context, payload)
    }

}
