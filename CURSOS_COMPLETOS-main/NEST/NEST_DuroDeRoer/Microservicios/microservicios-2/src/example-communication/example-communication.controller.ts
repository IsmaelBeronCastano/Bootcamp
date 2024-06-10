import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExampleCommunicationService } from './example-communication.service';
import { MessagePattern } from '@nestjs/microservices';
import { PATTERNS } from './example-communication.constants';

@Controller('api/v1/microservices-b2')
export class ExampleCommunicationController {
  constructor(private readonly exampleCommunicationService: ExampleCommunicationService) {}

  @Get('send-message')
  sendMessage(){
    return this.exampleCommunicationService.sendMessage('adiós')
  }

  @MessagePattern(PATTERNS.MESSAGES.SEND_MESSAGE)
  receivemessageFromMessagePatternB1(data: {msg: string}){
    console.log("Mensaje de B1 recibido", data.msg)
    return true
  }
}
