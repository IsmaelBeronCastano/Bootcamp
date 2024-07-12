import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CronService {

  constructor(private readonly scheduleRegistry: SchedulerRegistry,
              private readonly loggerService: LoggerService){

  }

  @Cron(`*/10 * * * * *`, {
    name: 'cron1'
    
  })
  cron1(){
    this.loggerService.log("cron1: Acción cada 10 segundos")
  }

  @Cron(`*/30 * * * * *`, {
    name: 'cron2'
    
  })
  cron2(){
    this.loggerService.error("cron1: Acción cada 30 segundos")
  }

  @Cron(`* * * * *`, {
    name: 'cron3'
    
  })
  cron3(){
    this.loggerService.warn("cron1: Acción cada minuto")
  }

  desactivateCron(name:string){
    const job: CronJob = this.scheduleRegistry.getCronJob(name)

    if(!job){
      throw new NotFoundException("No se ha encontrado el cron")
    }else{
      job.stop()
      console.log(`El cron con el nombre: ${name} está desactivado`)
      return true
    }
  }
  activateCron(name:string){
    const job: CronJob = this.scheduleRegistry.getCronJob(name)

    if(!job){
      throw new NotFoundException("No se ha encontrado el cron")
    }else{
      job.start()
      console.log(`El cron con el nombre: ${name} está activado`)
      return true
    }
  }

  getNameCrons(){
    const names = []

    for(const name of this.scheduleRegistry.getCronJobs().keys()){
       names.push(name)
    }
    return names
  }

  desactivateAllCrons(){
    const names = this.getNameCrons()

    for(const name of names){
      this.desactivateCron(name)
    }
    return true
  }

  activateAllCrons(){
    const names = this.getNameCrons()

    for(const name of names){
      this.activateCron(name)
    }
    return true
  }
}
