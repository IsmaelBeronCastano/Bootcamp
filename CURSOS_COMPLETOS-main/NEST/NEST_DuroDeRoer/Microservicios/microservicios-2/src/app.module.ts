import { Module } from '@nestjs/common';
import { ExampleCommunicationModule } from './example-communication/example-communication.module';
import { MicroserviceConnectionModule } from './microservice-connection/microservice-connection.module';


@Module({
  imports: [ExampleCommunicationModule, MicroserviceConnectionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
