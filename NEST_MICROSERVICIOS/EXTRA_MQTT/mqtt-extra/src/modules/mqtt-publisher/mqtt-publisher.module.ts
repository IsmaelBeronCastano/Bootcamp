import { Module } from '@nestjs/common';
import { MqttPublisherController } from './mqtt-publisher.controller';
import { MqttPublisherService } from './mqtt-publisher.service';

@Module({
  controllers: [MqttPublisherController],
  providers: [MqttPublisherService]
})
export class MqttPublisherModule {}
