import { Module } from '@nestjs/common';
import { MqttSubscriberController } from './mqtt-subscriber.controller';
import { MqttSubscriberService } from './mqtt-subscriber.service';

@Module({
  controllers: [MqttSubscriberController],
  providers: [MqttSubscriberService]
})
export class MqttSubscriberModule {}
