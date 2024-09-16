# 05 NODE-REACT MICROSERVICES FULL STACK
## Auth-ms

- Este servicio generará el jsonwebtoken
  - Lo enviará al api-gateway
  - En el gateway guardaremos el token en la cookie
- Tendremos 2 features en este servicio
  - Autenticación
    - Signup
    - Signin
    - Password reset
    - Verify/Resend Email
    - Token Refresh
    - Current User
  - Búsqueda
    - Buscar por Gigs aunque no se este autenticado
    - Habrá un search en el frontend
    - Para la búsqueda solo se trabajará **con elasticsearch**, no con mongo
-----

## Project setup

- Paso el json

~~~json
{
  "name": "jobber-auth",
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
    "@faker-js/faker": "^8.2.0",
    "amqplib": "^0.10.3",
    "bcryptjs": "^2.4.3",
    "cloudinary": "^1.41.0",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "elastic-apm-node": "^4.1.0",
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "helmet": "^7.0.0",
    "hpp": "^0.2.3",
    "http-status-codes": "^2.3.0",
    "joi": "^17.11.0",
    "jsonwebtoken": "^9.0.2",
    "mysql2": "^3.6.3",
    "pino-pretty": "^10.2.3",
    "sequelize": "^6.34.0",
    "typescript": "^5.2.2",
    "typescript-transform-paths": "^3.4.6",
    "unique-username-generator": "^1.2.0",
    "uuid": "^9.0.1",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@jest/types": "^29.6.3",
    "@types/amqplib": "^0.10.3",
    "@types/bcryptjs": "^2.4.5",
    "@types/compression": "^1.7.4",
    "@types/cors": "^2.8.15",
    "@types/express": "^4.17.20",
    "@types/hpp": "^0.2.4",
    "@types/jest": "^29.5.7",
    "@types/jsonwebtoken": "^9.0.4",
    "@types/lodash": "^4.14.200",
    "@types/uuid": "^9.0.6",
    "@typescript-eslint/eslint-plugin": "^6.9.1",
    "@typescript-eslint/parser": "^6.9.1",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-import": "^2.29.0",
    "jest": "^29.7.0",
    "prettier": "^3.0.3",
    "ts-alias": "^0.0.7",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.1",
    "tsc-alias": "^1.8.8",
    "tsconfig-paths": "^4.2.0"
  }
}
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

EXPOSE 4002

CMD [ "npm", "run", "dev" ]
~~~

- El Dockerfile (production)

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

EXPOSE 4002

CMD [ "npm", "run", "start" ]
~~~

- El .dockerignore, .npmrc, etc son los mismos
- Paso el .env

~~~
ENABLE_APM=0
GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
NODE_ENV=development
AP_GATEWAY_URL=http://localhost:4000
CLIENT_URL=http://localhost:3000
RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@localhost:5672
MYSQL_DB=mysql://jobber:api@localhost:3306/jobber_auth
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
ELASTIC_SEARCH_URL=http://elastic:admin1234@localhost:9200
ELASTIC_APM_SERVER_URL=http://localhost:8200
ELASTIC_APM_SECRET_TOKEN=
~~~

- El auth-ms/src/config.ts

~~~js
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config({});

if (process.env.ENABLE_APM === '1') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('elastic-apm-node').start({
    serviceName: 'jobber-auth',
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
  public NODE_ENV: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;
  public MYSQL_DB: string | undefined;
  public JWT_TOKEN: string | undefined;
  public CLOUD_NAME: string | undefined;
  public CLOUD_API_KEY: string | undefined;
  public CLOUD_API_SECRET: string | undefined;
  public GATEWAY_JWT_TOKEN: string | undefined;
  public API_GATEWAY_URL: string | undefined;
  public CLIENT_URL: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.JWT_TOKEN = process.env.JWT_TOKEN || '';
    this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
    this.MYSQL_DB = process.env.MYSQL_DB || '';
    this.CLOUD_NAME = process.env.CLOUD_NAME || '';
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || '';
    this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || '';
    this.API_GATEWAY_URL = process.env.API_GATEWAY_URL || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
  }

  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.CLOUD_API_KEY,
      api_secret: this.CLOUD_API_SECRET
    });
  }
}

export const config: Config = new Config();

~~~
- En el docker-compose.yaml que está en un modulo llamado volumes separado del resto

~~~yaml
  auth:
    container_name: auth_container
    build:
      context: ../server/3-auth-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4002:4002
    env_file: ../server/3-auth-service/.env
    environment:
      - ENABLE_APM=1
      - GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
      - JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
      - NODE_ENV=development
      - AP_GATEWAY_URL=http://gateway_container:4000
      - CLIENT_URL=http://localhost:3000
      - RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@rabbitmq_container:5672
      - MYSQL_DB=mysql://jobber:api@mysql_container:3306/jobber_auth
      - CLOUD_NAME=dyamr9ym3
      - CLOUD_API_KEY=385269193982147
      - CLOUD_API_SECRET=-h9hU43QMy68AcIaMyP0ULKbibI
      - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
      - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
      - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
      - mysql
~~~
---------

## Setup Database connection

- Usaremos sequelize

> npm i sequelize mysql2 

- Creo auth-ms/src/database.ts

~~~js
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@auth/config';
import { Sequelize } from 'sequelize';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authDatabaseServer', 'debug');
                                                
                                                //mysql://jobber:api@localhost:3306/jobber_auth
export const sequelize: Sequelize = new Sequelize(process.env.MYSQL_DB!,  {
  dialect: 'mysql', //especifico que tipo de db
  logging: false, //sin password
  dialectOptions: {
    multipleStatements: true //para usar multiples querys al mismo tiempo
  }
});

export async function databaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();//uso el método authenticate para conectarme
    log.info('AuthService Mysql database connection has been established successfully.');
  } catch (error) {
    log.error('Auth Service - Unable to connect to database.');
    log.log('error', 'AuthService databaseConnection() method error:', error);
  }
}
~~~
-----

## Check elasticSearch connection

- auth-ms/src/elasticsearch.ts
- Creo la instancia del cliente de ElastiSearch
- Para crear la conexión uso while
- Uso la instancia.cluster.health para crear el cluster de health
- Lo guardo en health del tipo de ClusterHealthresponse de elasticSearch

~~~js
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse, GetResponse } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@auth/config';
import { ISellerGig, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    log.info('AuthService connecting to ElasticSearch...');
    try {
                //uso el tipo de elasticSearch
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`AuthService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.log('error', 'AuthService checkConnection() method:', error);
    }
  }
}



export {checkConnection };
~~~

- Para que el health funcione debo crear el router, el controlador y llamarlo desde el server
- auth-ms/src/routes/health.ts

~~~js
import { health } from '@auth/controllers/health';
import express, { Router } from 'express';

const router: Router = express.Router();

export function healthRoutes(): Router {
  router.get('/auth-health', health);

  return router;
}
~~~

- En auth-ms/src/controllers/health.ts

~~~js
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function health(_req: Request, res: Response): void {
  res.status(StatusCodes.OK).send('Auth service is healthy and OK.');
}
~~~

- Hago una copia del server anterior y modifico el puerto, el origen de config a auth
- Para auth-ms el api-gateway ser´asu cliente y para el frontend también
- El JWT_TOKEN será el token que vendrá desde el frontend
- auth-ms/src/server.ts

~~~js
import http from 'http';

import 'express-async-errors';
import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@auth/config'; //uso el config de auth
import { Application, Request, Response, NextFunction, json, urlencoded } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';
import { checkConnection, createIndex } from '@auth/elasticsearch';
import { appRoutes } from '@auth/routes';
import { Channel } from 'amqplib';
import { createConnection } from '@auth/queues/connection';

const SERVER_PORT = 4002;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authenticationServer', 'debug');

export let authChannel: Channel;

export function start(app: Application): void {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  authErrorHandler(app);
  startServer(app);
}

//middleware para comprobar el token en los headers de la request
function securityMiddleware(app: Application): void {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  //configuración cors
  app.use(
    cors({
      origin: config.API_GATEWAY_URL,
      credentials: true,//true para poder guardar y usar el token
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );


  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.headers.authorization) { //compruebo que viene el token0
      
      //hago el split para quedarme con lo que sigue a Bearer
      const token = req.headers.authorization.split(' ')[1];

      //guardo la info del token en un payload  
      const payload: IAuthPayload = verify(token, config.JWT_TOKEN!) as IAuthPayload;
      req.currentUser = payload;//coloco la info en la request
    }
    next();
  });
}

function standardMiddleware(app: Application): void {
  app.use(compression());
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));
}

//AQUI!!
function routesMiddleware(app: Application): void {
  appRoutes(app);
}

async function startQueues(): Promise<void> {
  //authChannel = await createConnection() as Channel;
}

function startElasticSearch(): void {
  checkConnection();
  //createIndex('gigs');
}

//middleware 
function authErrorHandler(app: Application): void {
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    log.log('error', `AuthService ${error.comingFrom}:`, error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
}

function startServer(app: Application): void {
  try {
    //usamos http.Server
    const httpServer: http.Server = new http.Server(app);
    log.info(`Authentication server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Authentication server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'AuthService startServer() method error:', error);
  }
}
~~~

- La IErrorResponse y el CustomError se encuentra en jobber-shared/src
- El error que le quiero enviar a la API para que lo pueda enviar al user, será de tipo CustomError

~~~js
import { StatusCodes } from 'http-status-codes';

//AQUI!!!
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

//AQUÏ!!
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

- En app.ts

~~~js
import express, { Express } from 'express';
import { start } from '@auth/server';
import { databaseConnection } from '@auth/database';
import { config } from '@auth/config';

const initialize = (): void => {
  //config.cloudinaryConfig();
  
  const app: Express = express();
  databaseConnection();
  start(app);
};

initialize();
~~~
------

## Signup Schema


