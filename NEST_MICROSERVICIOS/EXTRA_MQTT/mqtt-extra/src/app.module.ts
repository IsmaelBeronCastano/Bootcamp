import { Module } from '@nestjs/common';
import { MqttPublisherModule } from './modules/mqtt-publisher/mqtt-publisher.module';
import { MqttSubscriberModule } from './modules/mqtt-subscriber/mqtt-subscriber.module';


@Module({
  imports: [
    MqttPublisherModule,
    MqttSubscriberModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
