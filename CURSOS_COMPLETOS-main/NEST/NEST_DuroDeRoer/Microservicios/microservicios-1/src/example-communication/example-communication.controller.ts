import { Controller, Get } from '@nestjs/common';
import { ExampleCommunicationService } from './example-communication.service';
import { CreateExampleCommunicationDto } from './dto/create-example-communication.dto';
import { UpdateExampleCommunicationDto } from './dto/update-example-communication.dto';

@Controller('api/v1/microservices-b1')
export class ExampleCommunicationController {
  constructor(private readonly exampleCommunicationService: ExampleCommunicationService) {}

  @Get('send-message')
  sendMessage(){
    return this.exampleCommunicationService.sendMessage('hola')
  }
  
}
