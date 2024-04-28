import { Body, Controller, Post } from '@nestjs/common';
import { MqttPublisherService } from './mqtt-publisher.service';
import { MqttDataDto } from './dtos/mqtt-data.dto';

@Controller('api/v1/mqtt-publisher')
export class MqttPublisherController {
    constructor(private readonly mqttPublisherService: MqttPublisherService){

    }

    @Post('publish-topic')
    publishTopic(@Body() mqttData: MqttDataDto){
        return this.mqttPublisherService.publishTopic(`home/messages/${mqttData.topic}`, mqttData.data)
    }

}
