# 03 NODE-REACT MICROSERVICES FULL STACK
## Api Gateway

- Se rechazarán todas las peticiones que no vengan del api-gateway
- Todos los request del cliente pasarán por el gateway
- Será por conexiones con websockets
- La API Gateway se comunicará por API REst PERO LOS MS SERÁ CON EL PATRÓN EVENT DRIVEN

![diagrama_api](API_GATEWAY.png)

- COmo se puede apreciar, el cliente no se comunicará directamente con los ms
- Lo hará con socket.io a través del gateway
- Tanto el cliente como la API gateay se comunicarán con elasticsearch/kibana
- En esta lección no se hará la implementación completa del API GATEWAY
- Será solo el setup inicial
- notification-ms no tiene comunicación (no necesita ninguna request)
- Creo el folder de api-gateway

> npm init
> tsc --init

- Copio todo lo que hay en en la raíz del notification-ms
- .dockerignore
~~~
node_modules
.git/
Dockerfile
.dockerignore
coverage/
~~~

.npmrc

~~~
@uzochukwueddie:registry=https://npm.pkg.github.com/uzochukwueddie
//npm.pkg.github.com/:_authToken=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
~~~

- Dockerfile.dev

~~~Dockerfile
FROM node:21-alpine3.18

WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY .npmrc ./
COPY src ./src
RUN ls -a
RUN npm install && npm install -g nodemon

EXPOSE 4000

CMD [ "npm", "run", "dev" ]
~~~

- Dockerfile, usaremnos el puerto 4000

~~~Dockerfile
FROM node:21-alpine3.18 as builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc ./
COPY src ./src
RUN npm install -g npm@latest
RUN npm ci && npm run build

FROM node:21-alpine3.18

WORKDIR /app
RUN apk add --no-cache curl
COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc ./
RUN npm install -g pm2 npm@latest
RUN npm ci --production
COPY --from=builder /app/build ./build

EXPOSE 4000 

CMD [ "npm", "run", "start" ]
~~~

- jest.config.ts
- En moduleNameMapper cambio notification por gateway

~~~js
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: 'coverage',
  collectCoverage: true,
  testPathIgnorePatterns: ['/node_modules'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testMatch: ['<rootDir>/src/**/test/*.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/test/*.ts?(x)', '!**/node_modules/**'],
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1
    }
  },
  coverageReporters: ['text-summary', 'lcov'],
  moduleNameMapper: {
    //AQUI!!
    '@gateway/(.*)': ['<rootDir>/src/$1']
  }
};

export default config;
~~~

- package.json (solo copio los scripts y hago las instalaciones que aqui aparecen)
- Cambio el name, el main será app.js
- Las instalaciones serán
  - @elastic/elasticsearch
  - @uzoeddie/jobber-helpers
  - axios
  - bcrypt
  - compression
  - cookie-session
  - cors
  - dotenv
  - express
  - helmet
  - hpp
  - http-status-codes
  - jsonwebtoken
  - pino-pretty
  - typescript
  - typescript-transform-paths
  - winston
- Más las dependencias con npm i -D
  - @jest/types
  - @types/compression
  - @types/cookie-session
  - @types/cors
  - @types/express
  - @types/hpp
  - @types/jest
  - @types/jsonwebtoken
  - @typescript-eslint/eslint-plugin
  - @typescript-eslint/parser
  - eslint
  - eslint-config-prettier
  - eslint-plugin-import
  - jest
  - prettier
  - ts-jest
  - ts-node
  - tsc-alias
  - tsconfig-paths

~~~json
{
  "name": "jobber-gateway",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "start": "pm2 start ./build/src/app.js -i 5 --attach --watch | pino-pretty -c",
    "stop": "pm2 stop all",
    "delete": "pm2 delete all",
    "dev": "nodemon -r tsconfig-paths/register src/app.ts | pino-pretty -c",
    "lint:check": "eslint 'src/**/*.ts'",
    "lint:fix": "eslint 'src/**/*.ts' --fix",
    "prettier:check": "prettier --check 'src/**/*.{ts,json}'",
    "prettier:fix": "prettier --write 'src/**/*.{ts,json}'",
    "build": "tsc --project tsconfig.json && tsc-alias -p tsconfig.json",
    "test": "jest --coverage=true -w=1 --forceExit --detectOpenHandles --watchAll=false"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@elastic/elasticsearch": "^8.10.0",
    "@socket.io/redis-adapter": "^8.2.1",
    "axios": "^1.6.0",
    "bcrypt": "^5.1.1",
    "compression": "^1.7.4",
    "cookie-session": "^2.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "elastic-apm-node": "^4.1.0",
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "helmet": "^7.0.0",
    "hpp": "^0.2.3",
    "http-status-codes": "^2.3.0",
    "jsonwebtoken": "^9.0.2",
    "pino-pretty": "^10.2.3",
    "redis": "^4.6.10",
    "socket.io": "^4.7.2",
    "socket.io-client": "^4.7.2",
    "typescript": "^5.2.2",
    "typescript-transform-paths": "^3.4.6",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@jest/types": "^29.6.3",
    "@types/compression": "^1.7.4",
    "@types/cookie-session": "^2.0.46",
    "@types/cors": "^2.8.15",
    "@types/express": "^4.17.20",
    "@types/hpp": "^0.2.4",
    "@types/jest": "^29.5.7",
    "@types/jsonwebtoken": "^9.0.4",
    "@typescript-eslint/eslint-plugin": "^6.9.1",
    "@typescript-eslint/parser": "^6.9.1",
    "eslint": "^8.52.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-import": "^2.29.0",
    "jest": "^29.7.0",
    "prettier": "^3.0.3",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.1",
    "tsc-alias": "^1.8.8",
    "tsconfig-paths": "^4.2.0"
  }
}
~~~

- ts.config.ts

~~~js
{
  "compilerOptions": {
    "target": "ES2015",
    "lib": ["dom", "ES2015"],
    "module": "commonjs",
    "baseUrl": ".",
    "outDir": "./build",
    "rootDir": ".",
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "sourceMap": true,
    "alwaysStrict": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "pretty": true,
    "resolveJsonModule": true,
    "plugins": [
      { "transform": "typescript-transform-paths" },
      { "transform": "typescript-transform-paths", "afterDeclarations": true },
    ],
    "paths": {
      "@gateway/*": ["src/*"]
    }
  }
}
~~~

- **NOTA:** Falta el archivo de jenkins, el .editorconfig y los archivos de eslint y prettier
- En notification-ms codificamos bajo el paradigma de la programación funcional
- En la api-Gateway usaremos POO
- Como todavía no he hecho el setup de elasticsearch ni el dotenv lo voy haciendo así
- Voy a tener que pasarle una app de tipo Application de express a la clase GatewayServer
- Para el deploy de producción tengo que setear con .set como trust proxy
- Guardaremos el jwtoken en las cookies (nunca en el localstorage!)
- En api-gateway/src/server.ts

~~~js
import 'express-async-errors';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Application } from 'express';
import { Logger } from 'winston';
import cookieSession from 'cookie-session';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';

import { Server } from 'socket.io';


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
}
~~~
------

## Server part 2


~~~js
import 'express-async-errors';
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

}
~~~

- La clase abstracta CustomError extiende de Error
- jobber-shared/src/ewrror-handler

~~~js
import { StatusCodes } from 'http-status-codes';

export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;
  comingFrom: string;
  serializeErrors(): IError;
}

export interface IError {
  message: string;
  statusCode: number;
  status: string;
  comingFrom: string;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;
  comingFrom: string;

  constructor(message: string, comingFrom: string) {
    super(message);
    this.comingFrom = comingFrom;
  }

  serializeErrors(): IError {
    return {
      message: this.message,
      statusCode: this.statusCode,
      status: this.status,
      comingFrom: this.comingFrom,
    }
  }
}

export class BadRequestError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;
  status = 'error';

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}

export class NotFoundError extends CustomError {
  statusCode = StatusCodes.NOT_FOUND;
  status = 'error';

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED;
  status = 'error';

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}

export class FileTooLargeError extends CustomError {
  statusCode = StatusCodes.REQUEST_TOO_LONG;
  status = 'error';

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}

export class ServerError extends CustomError {
  statusCode = StatusCodes.SERVICE_UNAVAILABLE;
  status = 'error';

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}

export interface ErrnoException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
  stack?: string;
}
~~~
-----

## Server PART 3

- Si no coloco http.Server como tipo daría conflictyo con socket.io

~~~js
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
      this.startHttpServer(httpServer) //inicio el http.Server

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
~~~

- En app.ts es donde creo app y se la paso al GatewayServer y llamo a server.start
- api-gateway/src/app.js

~~~js
import express, { Express } from 'express';
import { GatewayServer } from '@gateway/server';
import { redisConnection } from '@gateway/redis/redis.connection';

class Application {
  public initialize(): void {
    const app: Express = express();
    const server: GatewayServer = new GatewayServer(app);
    server.start();
    //redisConnection.redisConnect();
  }
}

const application: Application = new Application();
application.initialize();
~~~

- El api-gateway/src/config.ts

~~~js
import dotenv from 'dotenv';

dotenv.config({});

if (process.env.ENABLE_APM === '1') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('elastic-apm-node').start({
    serviceName: 'jobber-gateway',
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
    environment: process.env.NODE_ENV,
    active: true,
    captureBody: 'all',
    errorOnAbortedRequests: true,
    captureErrorLogStackTraces: 'always'
  });
}

class Config {
  public JWT_TOKEN: string | undefined;
  public GATEWAY_JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public AUTH_BASE_URL: string | undefined;
  public USERS_BASE_URL: string | undefined;
  public GIG_BASE_URL: string | undefined;
  public MESSAGE_BASE_URL: string | undefined;
  public ORDER_BASE_URL: string | undefined;
  public REVIEW_BASE_URL: string | undefined;
  public REDIS_HOST: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;

  constructor() {
    this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
    this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '1234';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.AUTH_BASE_URL = process.env.AUTH_BASE_URL || '';
    this.USERS_BASE_URL = process.env.USERS_BASE_URL || '';
    this.GIG_BASE_URL = process.env.GIG_BASE_URL || '';
    this.MESSAGE_BASE_URL = process.env.MESSAGE_BASE_URL || '';
    this.ORDER_BASE_URL = process.env.ORDER_BASE_URL || '';
    this.REVIEW_BASE_URL = process.env.REVIEW_BASE_URL || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
  }
}

export const config: Config = new Config();
~~~

- Por lo tanto, el .env será algo así

~~~js
ENABLE_APM=0
GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
NODE_ENV=development
SECRET_KEY_ONE=032c5c3cfc37938ae6dd43d3a3ec7834
SECRET_KEY_TWO=d66e377018c0bc0b5772bbc9b131e6d9
CLIENT_URL=http://localhost:3000
AUTH_BASE_URL=http://localhost:4002
USERS_BASE_URL=http://localhost:4003
GIG_BASE_URL=http://localhost:4004
MESSAGE_BASE_URL=http://localhost:4005
ORDER_BASE_URL=http://localhost:4006
REVIEW_BASE_URL=http://localhost:4007
REDIS_HOST=redis://localhost:6379
ELASTIC_SEARCH_URL=http://elastic:admin1234@localhost:9200
ELASTIC_APM_SERVER_URL=http://localhost:8200
ELASTIC_APM_SECRET_TOKEN=
~~~
----

## Setup elasticSearch connection

- Como estamos usando POO crearemos una clase
- Creo el logger de tipo Logger de winston
- Creo el health del tipo ClusterHealthResponse de @elastic
  - Creo un cluster de tipo health
  - Paso el status en un log
- Si hay un error lo capturo con el catch

~~~js
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@gateway/config';
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'apiGatewayElasticConnection', 'debug');

class ElasticSearch {
  private elasticSearchClient: Client;

  constructor() {
    this.elasticSearchClient = new Client({
      node: `${config.ELASTIC_SEARCH_URL}`
    });
  }

  public async checkConnection(): Promise<void> {
    let isConnected = false;
    while(!isConnected) {
      log.info('GatewayService Connecting to ElasticSearch');
      try {
        const health: ClusterHealthResponse = await this.elasticSearchClient.cluster.health({});
        log.info(`GatewayService ElasticSearch health status - ${health.status}`);
        isConnected = true;
      } catch (error) {
        log.error('Connection to ElasticSearch failed, Retrying...');
        log.log('error', 'GatewayService checkConnection() method error:', error);
      }
    }
  }
}

export const elasticSearch: ElasticSearch = new ElasticSearch(); //exporto la clase inicializada
~~~

- Para usarlo voy al server, en startElasticSearch e importo la clase elasticSearch

~~~js
private startElasticSearch(): void{
    elasticSearch.checkConnection()
  }
~~~
-----

## Gateway health route

- En api-gateway/src/routes/health.ts creo un router para health

~~~js
import { Health } from '@gateway/controllers/health';
import express, { Router } from 'express';

class HealthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/gateway-health', Health.prototype.health);
    return this.router;
  }
}

export const healthRoutes: HealthRoutes = new HealthRoutes();
~~~

- En api-gateway/src/controllers

~~~js

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class Health {
  public health(_req: Request, res: Response): void {
    res.status(StatusCodes.OK).send('API Gateway service is healthy and OK.');
  }
}
~~~

- En api-gateway/src/routes

~~~js
import { Application } from 'express';
import { healthRoutes } from '@gateway/routes/health';
import { authRoutes } from '@gateway/routes/auth';
import { currentUserRoutes } from '@gateway/routes/current-user';
import { authMiddleware } from '@gateway/services/auth-middleware';
import { searchRoutes } from '@gateway/routes/search';
import { buyerRoutes } from '@gateway/routes/buyer';
import { sellerRoutes } from '@gateway/routes/seller';
import { gigRoutes } from '@gateway/routes/gig';
import { messageRoutes } from '@gateway/routes/message';
import { orderRoutes } from '@gateway/routes/order';
import { reviewRoutes } from '@gateway/routes/review';

const BASE_PATH = '/api/gateway/v1';

export const appRoutes = (app: Application) => {
  app.use('', healthRoutes.routes());
  // app.use(BASE_PATH, authRoutes.routes());
  // app.use(BASE_PATH, searchRoutes.routes());

  // app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
  // app.use(BASE_PATH, authMiddleware.verifyUser, buyerRoutes.routes());
  // app.use(BASE_PATH, authMiddleware.verifyUser, sellerRoutes.routes());
  // app.use(BASE_PATH, authMiddleware.verifyUser, gigRoutes.routes());
  // app.use(BASE_PATH, authMiddleware.verifyUser, messageRoutes.routes());
  // app.use(BASE_PATH, authMiddleware.verifyUser, orderRoutes.routes());
  // app.use(BASE_PATH, authMiddleware.verifyUser, reviewRoutes.routes());
};
~~~

- En el server de api-gateway hago uso de appRoutes, despues de cors, urlencode, json, compression, antes de elasticSearch y startServer

~~~js
private routesMiddleware(app: Application): void {
  appRoutes(app);
}
~~~

- Hago un copy paste del server acabado

~~~js
import http from 'http';
import 'express-async-errors';
import { CustomError, IErrorResponse, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Application, Request, Response, json, urlencoded, NextFunction } from 'express';
import { Logger } from 'winston';
import cookieSession from 'cookie-session';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';
import { StatusCodes } from 'http-status-codes';
import { config } from '@gateway/config';
import { elasticSearch } from '@gateway/elasticsearch';
import { appRoutes } from '@gateway/routes';
import { axiosAuthInstance } from '@gateway/services/api/auth.service';
import { axiosBuyerInstance } from '@gateway/services/api/buyer.service';
import { axiosSellerInstance } from '@gateway/services/api/seller.service';
import { axiosGigInstance } from '@gateway/services/api/gig.service';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { SocketIOAppHandler } from '@gateway/sockets/socket';
import { axiosMessageInstance } from '@gateway/services/api/message.service';
import { axiosOrderInstance } from '@gateway/services/api/order.service';
import { axiosReviewInstance } from '@gateway/services/api/review.service';
import { isAxiosError } from 'axios';

const SERVER_PORT = 4000;
const DEFAULT_ERROR_CODE = 500;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'apiGatewayServer', 'debug');
export let socketIO: Server;

export class GatewayServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.startElasticSearch();
    this.errorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.set('trust proxy', 1);
    app.use(
      cookieSession({
        name: 'session',
        keys: [`${config.SECRET_KEY_ONE}`, `${config.SECRET_KEY_TWO}`],
        maxAge: 24 * 7 * 3600000,
        secure: config.NODE_ENV !== 'development',
        ...(config.NODE_ENV !== 'development' && {
          sameSite: 'none'
        })
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(cors({
      origin: config.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }));

    app.use((req: Request, _res: Response, next: NextFunction) => {
      if (req.session?.jwt) {
        axiosAuthInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
        axiosBuyerInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
        axiosSellerInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
        axiosGigInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
        axiosMessageInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
        axiosOrderInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
        axiosReviewInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
      }
      next();
    });
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '200mb' }));
    app.use(urlencoded({ extended: true, limit: '200mb' }));
  }

  private routesMiddleware(app: Application): void {
    appRoutes(app);
  }

  private startElasticSearch(): void {
    elasticSearch.checkConnection();
  }

  private errorHandler(app: Application): void {
    app.use('*', (req: Request, res: Response, next: NextFunction) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      log.log('error', `${fullUrl} endpoint does not exist.`, '');
      res.status(StatusCodes.NOT_FOUND).json({ message: 'The endpoint called does not exist.'});
      next();
    });

    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      if (error instanceof CustomError) {
        log.log('error', `GatewayService ${error.comingFrom}:`, error);
        res.status(error.statusCode).json(error.serializeErrors());
      }

      if (isAxiosError(error)) {
        log.log('error', `GatewayService Axios Error - ${error?.response?.data?.comingFrom}:`, error);
        res.status(error?.response?.data?.statusCode ?? DEFAULT_ERROR_CODE).json({ message: error?.response?.data?.message ?? 'Error occurred.' });
      }

      next();
    });
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.socketIOConnections(socketIO);
    } catch (error) {
      log.log('error', 'GatewayService startServer() error method:', error);
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: `${config.CLIENT_URL}`,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });
    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    socketIO = io;
    return io;
  }

  private async startHttpServer(httpServer: http.Server): Promise<void> {
    try {
      log.info(`Gateway server has started with process id ${process.pid}`);
      httpServer.listen(SERVER_PORT, () => {
        log.info(`Gateway server running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      log.log('error', 'GatewayService startServer() error method:', error);
    }
  }

  private socketIOConnections(io: Server): void {
    const socketIoApp = new SocketIOAppHandler(io);
    socketIoApp.listen();
  }
}
~~~
-----

## Authentication middleware

- Necesitamos verificar el token que viene del cliente en la cookie.session
- Uso verify de jsonwebtoken, le paso el token y el token con el que debe coincidir
- Guardo la info en payload
- Paso el payload a req-.currentUser
- Debo verificar que la request viene con el currentUser en otro método
- gateway/src/services/auth-middleware.ts

~~~js
import { config } from '@gateway/config';
import { BadRequestError, IAuthPayload, NotAuthorizedError } from '@uzochukwueddie/jobber-shared';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

class AuthMiddleware {
  public verifyUser(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session?.jwt) {
      throw new NotAuthorizedError('Token is not available. Please login again.', 'GatewayService verifyUser() method error');
    }

    try {
      const payload: IAuthPayload = verify(req.session?.jwt, `${config.JWT_TOKEN}`) as IAuthPayload;
      req.currentUser = payload;//le paso el payload a req.current.user
    } catch (error) {
      throw new NotAuthorizedError('Token is not available. Please login again.', 'GatewayService verifyUser() method invalid session error');
    }
    next();
  }
  
  //debo verificar que la request viene con currentUser
  public checkAuthentication(req: Request, _res: Response, next: NextFunction): void {
    if (!req.currentUser) {
      throw new BadRequestError('Authentication is required to access this route.', 'GatewayService checkAuthentication() method error');
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
~~~

- En jobber-shared/src/auth.ts encontramos varias interfaces, una es IAuthPayload

~~~js
export interface IAuthPayload {
  id: number;
  username: string;
  email: string;
  iat?: number;
}
~~~

- NotAuthorizedError está en la misma carpeta de jobber-shared en error-handler.ts

~~~js
export class NotAuthorizedError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED;
  status = 'error';

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}
~~~

- Cuando hagamos rutas tipo user service o gig service usaremos estos métodos
-----

## Axios Service

- En gateway/src/services/axios.ts
- Desde aquí crearemos y añadiremos el token
- Para hacerlo reutilizable por que usaremos varias instancias le añadimos this.axios en el constructor con el método pasándole la url y el servicio


~~~js
import axios from 'axios';
import { sign } from 'jsonwebtoken';
import { config } from '@gateway/config';

export class AxiosService {
  
  public axios: ReturnType<typeof axios.create>; //asi es cuando quiero añadir una propiedad de un tipo a otro tipo

  constructor(baseUrl: string, serviceName: string) {
    this.axios = this.axiosCreateInstance(baseUrl, serviceName); //la instancia de axios a la que le paso la url y el serviceName
  }

  public axiosCreateInstance(baseUrl: string, serviceName?: string): ReturnType<typeof axios.create> {
    let requestGatewayToken = ''; //creo el token vacío

    if (serviceName) {      //genero el token con el token del Gateway
      requestGatewayToken = sign({ id: serviceName }, `${config.GATEWAY_JWT_TOKEN}`);
    }
    //creo la instancia, le paso la url y en los headers como un json el token
    const instance: ReturnType<typeof axios.create> = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        gatewayToken: requestGatewayToken //este gatewayToken es el que chequeamos en el gateway-middleware 
      },
      withCredentials: true //importante!! para añadir el token en la cokkie session
    });
    return instance;
  }
}
~~~

- ServiceName son los que se encuentran en el gateway-middleware de jobber-shared
- Aqui chequearemos que haya un jwtoken y que contenga un id
- jobber-shared/src/gateway-middleware

~~~js
import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from './error-handler';

                          //alguno de estos debe de ser el serviceName del gatewaytoken
const tokens: string[] = ['auth', 'seller', 'gig', 'search', 'buyer', 'message', 'order', 'review'];

export function verifyGatewayRequest(req: Request, _res: Response, next: NextFunction): void {
  if (!req.headers?.gatewaytoken) {
    throw new NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
  }
  const token: string = req.headers?.gatewaytoken as string;
  if (!token) {
    throw new NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
  }

  try {
    const payload: { id: string; iat: number } = JWT.verify(token, '1282722b942e08c8a6cb033aa6ce850e') as { id: string; iat: number };
    if (!tokens.includes(payload.id)) {
      throw new NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request payload is invalid');
    }
  } catch (error) {
    throw new NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
  }
  next();
}
~~~

- Si el serviceName no se encuentra en el listado del gateway-middleware la petición será rechazada
------

## Add GatewayService to Docker compose

- docker-compose.yaml

~~~yaml
  gateway:
    container_name: gateway_container
    build:
      context: ../server/1-gateway-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4000:4000
    env_file: ../server/1-gateway-service/.env
    environment:
        - ENABLE_APM=1
        - GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
        - JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
        - NODE_ENV=development
        - SECRET_KEY_ONE=032c5c3cfc37938ae6dd43d3a3ec7834
        - SECRET_KEY_TWO=d66e377018c0bc0b5772bbc9b131e6d9
        - CLIENT_URL=http://localhost:3000
        - AUTH_BASE_URL=http://auth_container:4002
        - USERS_BASE_URL=http://localhost:4003
        - GIG_BASE_URL=http://localhost:4004
        - MESSAGE_BASE_URL=http://localhost:4005
        - ORDER_BASE_URL=http://localhost:4006
        - REVIEW_BASE_URL=http://localhost:4007
        - REDIS_HOST=redis://redis_container:6379
        - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
        - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
        - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
~~~

- .env

~~~
ENABLE_APM=0
GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
NODE_ENV=development
SECRET_KEY_ONE=032c5c3cfc37938ae6dd43d3a3ec7834
SECRET_KEY_TWO=d66e377018c0bc0b5772bbc9b131e6d9
CLIENT_URL=http://localhost:3000
AUTH_BASE_URL=http://localhost:4002
USERS_BASE_URL=http://localhost:4003
GIG_BASE_URL=http://localhost:4004
MESSAGE_BASE_URL=http://localhost:4005
ORDER_BASE_URL=http://localhost:4006
REVIEW_BASE_URL=http://localhost:4007
REDIS_HOST=redis://localhost:6379
ELASTIC_SEARCH_URL=http://elastic:admin1234@localhost:9200
ELASTIC_APM_SERVER_URL=http://localhost:8200
ELASTIC_APM_SECRET_TOKEN=
~~~
