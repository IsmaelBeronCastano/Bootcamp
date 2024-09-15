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