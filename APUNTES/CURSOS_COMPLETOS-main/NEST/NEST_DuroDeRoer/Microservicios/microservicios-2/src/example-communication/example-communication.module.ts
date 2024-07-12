import { Module } from '@nestjs/common';
import { ExampleCommunicationService } from './example-communication.service';
import { ExampleCommunicationController } from './example-communication.controller';
import { MicroserviceConnectionModule } from 'src/microservice-connection/microservice-connection.module';

@Module({
  imports:[MicroserviceConnectionModule],
  controllers: [ExampleCommunicationController],
  providers: [ExampleCommunicationService],
})
export class ExampleCommunicationModule {}
