import { Module } from '@nestjs/common';
import { EmailsModule } from './emails/emails.module';
import { SERVICES } from './emails/email-config';

@Module({
  imports: [EmailsModule.register({
    from: 'miemail@gmail.com',
    password: 'mi-password',
    service: SERVICES.GMAIL
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
