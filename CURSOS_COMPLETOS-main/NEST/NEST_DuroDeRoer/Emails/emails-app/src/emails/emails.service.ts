import { Inject, Injectable } from '@nestjs/common';
import { EmailConfig } from './email-config';
import * as nodemailer from 'nodemailer'
import { EmailDto } from './dto/create-email.dto';

@Injectable()
export class EmailsService {

  constructor(
    @Inject('CONFIG_OPTIONS')
    private options: EmailConfig
  ){
  
  }

  sendEmail(message: EmailDto){

    try {
      const transporter = nodemailer.createTransport({
        service: this.options.service,
        auth: {
          user: this.options.from,
          pass: this.options.password
        }
      })
  
  
      const to = message.receivers.map(e =>e.email )
  
      const mailOptions = {
        from: this.options.from,
        to,
        subject: message.subject,
        html: message.body
      }
  
      return transporter.sendEmail(mailOptions)  
    } catch (error) {
      console.error(error)

      return null
    }
    
  }
  findAll() {
    return `This action returns all emails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }



  remove(id: number) {
    return `This action removes a #${id} email`;
  }
}
