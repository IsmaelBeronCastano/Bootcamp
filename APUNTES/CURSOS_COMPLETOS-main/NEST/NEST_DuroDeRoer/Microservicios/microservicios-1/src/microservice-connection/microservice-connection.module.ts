import { Module } from '@nestjs/common';
import { MicroserviceConnectionService } from './microservice-connection.service';
import { MicroserviceConnectionController } from './microservice-connection.controller';

@Module({
  controllers: [MicroserviceConnectionController],
  providers: [MicroserviceConnectionService],
})
export class MicroserviceConnectionModule {}
