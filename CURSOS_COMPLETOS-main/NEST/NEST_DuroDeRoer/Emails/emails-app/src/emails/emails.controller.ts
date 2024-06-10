import { Controller, Get, Post, Body } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailDto } from './dto/create-email.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post()
  @ApiOperation({
    description: 'envía un email',

  })
  @ApiBody({
    description: 'envía un email usando un emailDto',
    type: EmailDto,
    examples:{
      ejemplo1:{
        value: {
          subject: "Test correo",
          body: "<h1>Hola mundo! </h1>",
          receivers: [
           { email: "perico@gmail.com"}
          ] 
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: "Correo enviado correctamente"
  })
  sendEmail(@Body() emailDto: EmailDto) {
    return this.emailsService.sendEmail(emailDto);
  }

}
