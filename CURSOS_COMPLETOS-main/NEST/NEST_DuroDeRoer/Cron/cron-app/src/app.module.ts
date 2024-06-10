import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './modules/cron/cron.module';


@Module({
  imports: [CronModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
