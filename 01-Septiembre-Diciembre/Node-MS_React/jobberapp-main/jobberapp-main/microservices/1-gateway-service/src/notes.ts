import 'express-async-errors';
import http from 'http'
import { Application, Request, Response, json, urlencoded, NextFunction } from 'express';
import { Logger } from 'winston';
import compression from 'compression';
import cookieSession from 'cookie-session';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import { CustomError, IErrorResponse, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Server } from 'socket.io';
import { StatusCodes } from 'http-status-codes';


const SERVER_PORT = 4000;
const DEFAULT_ERROR_CODE = 500;
const log: Logger = winstonLogger(``, 'apiGatewayServer', 'debug');
export let socketIO: Server;

export class GatewayServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }



  public start(): void{
    this.securityMiddleware(this.app)
    this.standardMiddleware(this.app)
    this.routesMiddleware(this.app)
    this.startElasticSearch()
    this.errorHandler(this.app)
  }

  //para que el gateway funcione el deploy
  private securityMiddleware(app: Application): void {
    app.set('trust proxy, 1')
    app.use(
        cookieSession({
            name: 'session',
            keys:[],
            maxAge: 24 * 7 * 3600000, //token valido por 7 dias
            secure: false //update con true del config (para el https)
            //sameSite: none //firefoxz tiene otra implementación
        })
    )

    app.use(hpp())
    app.use(helmet())
    app.use(cors({
        origin: '', //el cliente
        credentials: true, //podemos asignar el token en cualquier request
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']

    }))
  }
  

  private standardMiddleware(app: Application): void{
    app.use(compression())
    app.use(json({limit: '200mb'}))
    app.use(urlencoded({extended: true, limit: '200mb'})) //pq pasaremos data mediante la req.body

  }

  private routesMiddleware(app: Application): void{

  }

  private startElasticSearch(): void{

  }

  private errorHandler(app: Application){
    //si el usuario trata de acceder a un endpoint que no existe
    //para reconstruir una url desde la request

    app.use('*',(req: Request, res: Response, next: NextFunction)=>{
        const fullUrl= `${req.protocol}://${req.get('host')}${req.originalUrl}`

        log.log('error', `${fullUrl} endpoint does not exists`)
        res.status(StatusCodes.NOT_FOUND).json({message:"The endpoint callled does not exists"})
        next()
    })

    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction)=>{

      log.log('error', `GatewayService ${error.comingFrom}:`, error)
      if(error instanceof CustomError){
        res.status(error.statusCode).json(error.serializeErrors())
    }
    
  })
  
  }

  private async startServer(app: Application): Promise<void>{
    try {
      const httpServer: http.Server = new http.Server(app)
      this.startHttpServer(httpServer)

    } catch (error) {
      log.log('error', 'GatewayService startServer method', error)
    }
  }

  //creo el método al que le pasaré el http.Server para inciarlo
  private async startHttpServer(httpServer: http.Server): Promise<void>{

    try {
      log.info(`Gateway Server has started with process id ${process.pid}`)
      httpServer.listen(SERVER_PORT, ()=>{
        log.info(`GatewayService running on port ${SERVER_PORT} `)
      })
    } catch (error) {
      log.log('error', 'GatewayService startHttpServer method', error)

    }
  }



}