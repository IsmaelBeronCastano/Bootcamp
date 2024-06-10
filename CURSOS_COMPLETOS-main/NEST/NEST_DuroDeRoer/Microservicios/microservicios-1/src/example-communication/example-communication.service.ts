import { Injectable } from '@nestjs/common';
import { MicroserviceConnectionService } from 'src/microservice-connection/microservice-connection.service';
import { PATTERNS } from './example-communication.constants';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExampleCommunicationService {

  constructor(private microServiceConnection:MicroserviceConnectionService){ }

  sendMessage(msg: string){
    return firstValueFrom(
      this.microServiceConnection
      .getClient()
      .send(
        PATTERNS.MESSAGES.SEND_MESSAGE,
        {
          msg
        }
      )
      ) 
  }
}




