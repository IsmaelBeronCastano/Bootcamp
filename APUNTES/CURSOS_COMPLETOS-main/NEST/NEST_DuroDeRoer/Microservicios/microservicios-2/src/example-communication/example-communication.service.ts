import { Injectable } from '@nestjs/common';
import { CreateExampleCommunicationDto } from './dto/create-example-communication.dto';
import { UpdateExampleCommunicationDto } from './dto/update-example-communication.dto';

@Injectable()
export class ExampleCommunicationService {

  sendMessage(msg: string){
    return msg
  }
}
