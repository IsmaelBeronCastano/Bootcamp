import { Controller, Get, Param, Put } from '@nestjs/common';
import { CronService } from './cron.service';


@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Put('/desactivate/:name')
  desactivateCron(@Param('name') name: string ){
    return this.cronService.desactivateCron(name)
  }
  @Put('/activate/:name')
  activateCron(@Param('name') name: string ){
    return this.cronService.activateCron(name)
  }
 
  @Get()
  getNameCrons(){
    return this.cronService.getNameCrons() 
  }

  @Put('desactivate-all')
  desactivateAllCrons(){
    return this.cronService.desactivateAllCrons()
  }
  
  @Put('activate-all')
  activateAllCrons(){
    return this.cronService.activateAllCrons()
  }
}
