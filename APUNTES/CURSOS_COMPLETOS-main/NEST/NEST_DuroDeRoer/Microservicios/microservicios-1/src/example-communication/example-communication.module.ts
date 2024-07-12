import { Module } from '@nestjs/common';
import { ExampleCommunicationService } from './example-communication.service';
import { ExampleCommunicationController } from './example-communication.controller';
import { MicroserviceConnectionModule } from 'src/microservice-connection/microservice-connection.module';
import { MicroserviceConnectionService } from 'src/microservice-connection/microservice-connection.service';

@Module({
  imports:[MicroserviceConnectionModule],
  controllers: [ExampleCommunicationController],
  providers: [ExampleCommunicationService, MicroserviceConnectionService],
})
export class ExampleCommunicationModule {}
