import winston, { Logger } from 'winston';



export const winstonLogger = (name: string, level: string): Logger => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true
    }   
  };
  

  const logger: Logger = winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [new winston.transports.Console(options.console)]
  });
  return logger;
}
