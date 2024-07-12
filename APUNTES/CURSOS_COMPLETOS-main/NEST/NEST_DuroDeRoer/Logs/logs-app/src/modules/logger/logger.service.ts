import { Injectable } from '@nestjs/common';
import { Logger, createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
    
    private loggerInfo: Logger
    private loggerError: Logger
    private loggerWarn: Logger
    private loggerAll: Logger
    
    
    constructor(){
        this.createLogger()
    }

    createLogger(){
        const textFormat = format.printf((log)=>{
           return `${log.timestamp}- ${log.level.toUpperCase().charAt(0)}- ${log.message}`            
        })

        const dateFormat = format.timestamp({
            format: 'YYYY-MM-DD HH:MM:SS'
        })

        this.loggerInfo = createLogger({
            level: 'info',
            format:format.combine(
                dateFormat,
                textFormat
            ),
            transports:[
                new transports.DailyRotateFile({
                    filename: 'log/info/info-%DATE%.log',
                    datePattern: 'YYY-MM-DD',
                    maxFiles:'7d',
                    zippedArchive: true
                })
            ]       
        })
        this.loggerError = createLogger({
            level: 'error',
            format:format.combine(
                dateFormat,
                textFormat
            ),
            transports:[
                new transports.DailyRotateFile({
                    filename: 'log/error/error-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '7d',
                    zippedArchive: true
                })
            ]       
        })
        this.loggerWarn = createLogger({
            level: 'warn',
            format:format.combine(
                dateFormat,
                textFormat
            ),
            transports:[
                new transports.DailyRotateFile({
                    filename: 'log/warn/warn-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '7d',
                    zippedArchive: true
                })
            ]       
        })
        this.loggerAll = createLogger({
            format:format.combine(
                dateFormat,
                textFormat
            ),
            transports:[
                new transports.DailyRotateFile({
                    filename: 'log/all/all-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '7d',
                    zippedArchive: true
                }),
                new transports.Console()
            ]       
        })
        
    }

    log(message: string){
        this.loggerInfo.info(message)
        this.loggerAll.info(message)
    }
    error(message: string){
        this.loggerError.error(message)
        this.loggerAll.error(message)
    }
    warn(message: string){
        this.loggerWarn.warn(message)
        this.loggerAll.warn(message)
    }
    debug(message: string){

    }
    verbose(message: string){

    }
}
