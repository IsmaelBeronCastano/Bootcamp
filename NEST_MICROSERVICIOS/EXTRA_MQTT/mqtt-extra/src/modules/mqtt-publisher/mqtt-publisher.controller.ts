import { Controller } from '@nestjs/common';
import { MqttPublisherService } from './mqtt-publisher.service';

@Controller('api/v1/mqtt-publisher')
export class MqttPublisherController {
    constructor(private readonly mqttPublisherService: MqttPublisherService){

    }
}
