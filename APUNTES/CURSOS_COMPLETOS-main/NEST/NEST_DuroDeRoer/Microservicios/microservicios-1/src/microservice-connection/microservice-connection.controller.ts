import { Controller } from '@nestjs/common';
import { MicroserviceConnectionService } from './microservice-connection.service';

@Controller('microservice-connection')
export class MicroserviceConnectionController {
  constructor(private readonly microserviceConnectionService: MicroserviceConnectionService) {}
}
