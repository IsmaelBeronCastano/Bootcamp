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
