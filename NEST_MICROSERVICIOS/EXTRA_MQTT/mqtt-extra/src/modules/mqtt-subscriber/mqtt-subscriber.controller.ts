import { Controller } from '@nestjs/common';
import { MqttSubscriberService } from './mqtt-subscriber.service';

@Controller()
export class MqttSubscriberController {
    constructor(private readonly mqttSubscriberService: MqttSubscriberService){}
}
