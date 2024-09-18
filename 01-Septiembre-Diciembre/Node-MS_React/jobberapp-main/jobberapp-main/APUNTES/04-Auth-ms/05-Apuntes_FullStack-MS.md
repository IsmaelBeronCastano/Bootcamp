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

## Schemes


- Para validar usaremos joi

> npm i joi

- auth-ms/src/schemes/signup

~~~js
import Joi, { ObjectSchema } from 'joi';

const signupSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().min(4).max(12).required().messages({
    'string.base': 'Username must be of type string',
    'string.min': 'Invalid username',
    'string.max': 'Invalid username',
    'string.empty': 'Username is a required field'
  }),
  password: Joi.string().min(4).max(12).required().messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Invalid password',
    'string.max': 'Invalid password',
    'string.empty': 'Password is a required field'
  }),
  country: Joi.string().required().messages({
    'string.base': 'Country must be of type string',
    'string.empty': 'Country is a required field'
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be of type string',
    'string.email': 'Invalid email',
    'string.empty': 'Email is a required field'
  }),
  profilePicture: Joi.string().required().messages({
    'string.base': 'Please add a profile picture',
    'string.email': 'Profile picture is required',
    'string.empty': 'Profile picture is required'
  }),
  browserName: Joi.string().optional(),
  deviceType: Joi.string().optional()
});

export { signupSchema };
~~~

- El Signin
- Usaremos otherwise para si en lugar del mail usa el username
auth-ms/src/schemes/signin.ts

~~~js
import Joi, { ObjectSchema } from 'joi';

const loginSchema: ObjectSchema = Joi.object().keys({
  username: Joi.alternatives().conditional(Joi.string().email(), {
    then: Joi.string().email().required().messages({
      'string.base': 'Email must be of type string',
      'string.email': 'Invalid email',
      'string.empty': 'Email is a required field'
    }),
    otherwise: Joi.string().min(4).max(12).required().messages({
      'string.base': 'Username must be of type string',
      'string.min': 'Invalid username',
      'string.max': 'Invalid username',
      'string.empty': 'Username is a required field'
    })
  }),
  password: Joi.string().min(4).max(12).required().messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Invalid password',
    'string.max': 'Invalid password',
    'string.empty': 'Password is a required field'
  }),
  browserName: Joi.string().optional(),
  deviceType: Joi.string().optional()
});

export { loginSchema };
~~~

- En schemes tendremos también un schema para el password, email...
- Los usaremos para validar cada campo en específico
- auth-ms/src/schemes/password.ts

~~~js
import Joi, { ObjectSchema } from 'joi';

const emailSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    'string.base': 'Field must be valid',
    'string.required': 'Field must be valid',
    'string.email': 'Field must be valid'
  })
});

const passwordSchema: ObjectSchema = Joi.object().keys({
  password: Joi.string().required().min(4).max(12).messages({
    'string.base': 'Password should be of type string',
    'string.min': 'Invalid password',
    'string.max': 'Invalid password',
    'string.empty': 'Password is a required field'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords should match',
    'any.required': 'Confirm password is a required field'
  })
});

const changePasswordSchema: ObjectSchema = Joi.object().keys({
  currentPassword: Joi.string().required().min(4).max(8).messages({
    'string.base': 'Password should be of type string',
    'string.min': 'Invalid password',
    'string.max': 'Invalid password',
    'string.empty': 'Password is a required field'
  }),
  newPassword: Joi.string().required().min(4).max(12).messages({
    'string.base': 'Password should be of type string',
    'string.min': 'Invalid password',
    'string.max': 'Invalid password',
    'string.empty': 'Password is a required field'
  }),
});

export { emailSchema, passwordSchema, changePasswordSchema };
~~~
----

## Sequelize model

- Para crear el modelo necesitamos
  - id
  - username
  - profilePublicId
  - email
  - password
  - country
  - profilePicture
  - emailVerificationToken
  - emailVerified
  - createdAt
  - passwordResetToken
  - passwordResetExpires
- profilePubliId lo generaremos porque la imagen la subiremos a CLoudinary
- Cuando el user crea una cuenta, generamos este emailVerificationToken
  - Será el añadido al email template, lo usaremos para verificar el user

- auth-ms/src/models/auth.ts
- Creo una interfaz que extiende de Model
- En su prototype añado dos métodos, comparePassword y hashPassword
- Usaremos la instancia de sequelize de auth/src/database.ts
- Tengo instalado bcrypt y bcryptjs
- Uso Optional para que incluya lo primero y lo segundo (separado por |) que no lo envíe en la creación de user
- Uso Modeldefined para decir que será de tipo IAuthDocument, le paso el tipo que lleva el Optional, y añado el tipo con los métodos en el prototype
- Uso la instancia de sequelize.define
- Indexo aquellos que voy a usar para las búsquedas
- auth-ms/src/models/auth.ts

~~~js
import { sequelize } from '@auth/database';
import { IAuthDocument } from '@uzochukwueddie/jobber-shared';
import { compare, hash } from 'bcryptjs';
import { DataTypes, Model, ModelDefined, Optional } from 'sequelize';

const SALT_ROUND = 10; //es 10 por defecto, 
                       //numero de veces que el algoritmo de encriptación se ejecutarà

interface AuthModelInstanceMethods extends Model {
  //AuthModel deberá tener estos dos métodos 
  prototype: {
    comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
    hashPassword: (password: string) => Promise<string>;
  }
}
                            //Optional para que incluya IAuthDocument pero no lo siguiente al crear el usuario
type AuthUserCreationAttributes = Optional<IAuthDocument, 'id' | 'createdAt' | 'passwordResetToken' | 'passwordResetExpires'>;
                                                                         
                  //Modeldefined para decir que podemos crear users tipo IAuth y que no lleven el id, createdAt en la creación
                                                //Debe contener los métodos comparePassword y hashPassword 
const AuthModel: ModelDefined<IAuthDocument, AuthUserCreationAttributes> & AuthModelInstanceMethods = sequelize.define('auths', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profilePublicId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: false
  },
  emailVerificationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0
  },
  browserName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deviceType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  otp: {
    type: DataTypes.STRING
  },
  otpExpiration: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date()
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Date.now //crea una fecha al momento de la creación
  },
  passwordResetToken: { 
    type: DataTypes.STRING, 
    allowNull: true },

  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date() //puedo usar Date.now o new Date()
  }
}, {
  indexes: [  //uso los indices para marcar que deben ser únicos e indexarlos
    {
      unique: true,
      fields: ['email']
    },
    {
      unique: true,
      fields: ['username']
    },
    {
      unique: true,
      fields: ['emailVerificationToken']
    },
  ]
}) as ModelDefined<IAuthDocument, AuthUserCreationAttributes> & AuthModelInstanceMethods;

//añado el hook beforeCreate para hashear el password, le paso el modelo
AuthModel.addHook('beforeCreate', async (auth: Model) => {
  //guardo el password hasheado             el password esta aqui
  const hashedPassword: string = await hash(auth.dataValues.password as string, SALT_ROUND);
  auth.dataValues.password = hashedPassword;
});

AuthModel.prototype.comparePassword = async function (password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
};

AuthModel.prototype.hashPassword = async function (password: string): Promise<string> {
  return hash(password, SALT_ROUND);
};
//si uso force: true borrará la db con cada reset del server
AuthModel.sync({}); //ejecuto, si la tabla no existe la creará, si existe no hará nada
export { AuthModel };

~~~

- IAuthDocument está en jobber-shared

~~~js
export interface IAuthDocument {
  id?: number;
  profilePublicId?: string;
  username?: string;
  email?: string;
  password?: string;
  country?: string;
  profilePicture?: string;
  emailVerified?: number;
  emailVerificationToken?: string;
  browserName?: string;
  deviceType?: string;
  otp?: string;
  otpExpiration?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}
~~~

- Puedo usar TablePlus para visualizar la data

-----

## RabbitMQ connection

- auth-ms/src/queues/connection
- createConnection devuelve una promesa de tipo Channel o undefined
- En un try cacth creo la conexión con el cliente
- Con la conexión creo el canal
- Cierro el canal y la conexión si recibo SIGINT con el metodo closeConnection, devuelvo el channel
- Si todo sale bien devuelvo el Channel
- En el catch recojo el error si lo hay y devuelvo undefined

~~~js
import { config } from '@auth/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authQueueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try {                                                    //amqp://jobber:jobberpass@localhost:5672
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);

    const channel: Channel = await connection.createChannel();

    log.info('Auth server connected to queue successfully...');
    closeConnection(channel, connection);
    return channel;

  } catch (error) {
    log.log('error', 'AuthService createConnection() method error:', error);
    return undefined; //si hay error devuelvo undefined
  }
}

function closeConnection(channel: Channel, connection: Connection): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}

export { createConnection } ;
~~~

- Lo ejecuto en el server de auth-ms
- Creo el authChannel fuera del método y lo exporto

~~~js
export let authChannel: Channel; //lo usaré en el auth.service.ts

async function startQueues(): Promise<void> {
  authChannel = await createConnection() as Channel;
}
~~~

- Auth-ms solo enviará (producirá) mensajes, no consumirá ningún mensaje. Solo produce
- Aquí va un gráfico

![notification](notification.png)

- Creo en auth-ms/src/queues/auth.producer.ts
- Creo la función publishDirectMessage
- Debo pasarle el channel, el exchangeName, la routingKey, el message (con stringify), y el logMessage
- Uso try catch
- Si no viene el channel lo creo
- Necesitamos usar assertExchange para usar el canal que hemos creado y pasarle el noombre del exchange y el tipo de conexión
- Uso el método publish de channel, le paso el exchangeName, el routingKey y tabajo el message como un Buffer


~~~js
import { config } from '@auth/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@auth/queues/connection';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authServiceProducer', 'debug');

export async function publishDirectMessage(
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> {
  
  try {
    if (!channel) {           //creayeConnection from auth-ms/src/queues/connection
      channel = await createConnection() as Channel;
    }
    await channel.assertExchange(exchangeName, 'direct');

    channel.publish(exchangeName, routingKey, Buffer.from(message));

    log.info(logMessage);
  } catch (error) {
    log.log('error', 'AuthService Provider publishDirectMessage() method error:', error);
  }
}
~~~

- En RabbitMQ publish no envía directamente a la queue, si no que al exchange
-----

## Create user service method

- Creo la carpeta auth-ms/src/services/auth.service.ts
- Lo copio con algunos métodos de más (no todos, por ahora)
- Cuando un usuario crea una cuenta, automáticamente se convierte en un comprador
- Tendremos diferentes servicios para manejar compradores y vendedores
- createAuthUser recibirá la data de tipo IAuthDocument, devolverá una Promesa con algo de tipo IAuthDocument o undefined
- Importo AuthModel para interactuar con la DB. Buscar en la documentacion de Sequelize Model Querying
- Lo guardo en result que es de tipo Model (de Sequelize)
- Uso async await
- El result.dataValues, este dataValues viene de Model de Sequelize, que devuelve el modelo con esta propiedad
- Le coloco ! al final de cada dataValues.propiedad. Si hubiera un error va al catch
- El método publishDirectMessage viene de queues/auth.producer
- Le paso lo que me pide, el channel, exchangeName, routingKey, etc
  - El authChannel lo estoy exportando desde el server, desde done llamo a startQueues con el método createConnection
  - En el message que le paso uso stringify
  - Para omitir el password en el retorno usaré omit de lodash (hay otras maneras)

~~~js
import { config } from '@auth/config';
import { AuthModel } from '@auth/models/auth.schema';
import { publishDirectMessage } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import { IAuthBuyerMessageDetails, IAuthDocument, firstLetterUppercase, lowerCase, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { sign } from 'jsonwebtoken';
import { omit } from 'lodash';
import { Model, Op } from 'sequelize';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authService', 'debug');

export async function createAuthUser(data: IAuthDocument): Promise<IAuthDocument | undefined> {
  try {

    const result: Model = await AuthModel.create(data);

    const messageDetails: IAuthBuyerMessageDetails = {
      username: result.dataValues.username!, //le coloco ! al final
      email: result.dataValues.email!,
      profilePicture: result.dataValues.profilePicture!,
      country: result.dataValues.country!,
      createdAt: result.dataValues.createdAt!,
      type: 'auth'
    };

    await publishDirectMessage(
      authChannel,
      'jobber-buyer-update', //exchange
      'user-buyer',//routingKey
      JSON.stringify(messageDetails),//message
      'Buyer details sent to buyer service.'
    );
    const userData: IAuthDocument = omit(result.dataValues, ['password']) as IAuthDocument; //omito el password
    return userData;
  } catch (error) {
    log.error(error);
  }
}

export async function getAuthUserById(authId: number): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = await AuthModel.findOne({
      where: { id: authId },
      attributes: {
        exclude: ['password'] //no quiero que retorne el password
      }
    }) as Model; //as Model!!

    return user?.dataValues;//si tengo el user retorno la dataValues
  } catch (error) {
    log.error(error);
  }
}

export async function getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = await AuthModel.findOne({
      where: {
        //Uso Op de sequelize con or para decir que usará uno u otro
        [Op.or]: [{ username: firstLetterUppercase(username)}, { email: lowerCase(email)}]
      },
    }) as Model;
    return user?.dataValues; //lo retorno si lo tengo
  } catch (error) {
    log.error(error);
  }
}

export async function getUserByUsername(username: string): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = await AuthModel.findOne({
      where: { username: firstLetterUppercase(username) },
    }) as Model; //as Model!
    return user?.dataValues;
  } catch (error) {
    log.error(error);
  }
}

export async function getUserByEmail(email: string): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = await AuthModel.findOne({
      where: { email: lowerCase(email) },
    }) as Model;
    return user?.dataValues;
  } catch (error) {
    log.error(error);
  }
}
~~~

- Falta esta interfaz, IAuthDocument se puede consultar en páginas anteriores (esta también)

~~~js
export interface IAuthBuyerMessageDetails {
  username?: string;
  profilePicture?: string;
  email?: string;
  country?: string;
  createdAt?: Date;
  type?: string;
}
~~~

- Los métodos update
- updateVerifyEmailField
- La propiedad emailVerified de AuthSchema se setea en 0 por defecto (false)
- Le paso el authId, emailVeriffied y emailverificationToken
- Uso un ternario. Si no tengo el emailVerificationToken le paso a emailVerified el emailVerified que tengo como argumento
- Si tengo el token le paso el emailVerified, y el emailVerificationToken
- Uso where para filtrar por id

~~~js
export async function updateVerifyEmailField(authId: number, emailVerified: number, emailVerificationToken?: string): Promise<void> {
  try {
    await AuthModel.update(
    !emailVerificationToken ?  {
        emailVerified
      } : {
        emailVerified,
        emailVerificationToken
      },
      { where: { id: authId }},
    );
  } catch (error) {
    log.error(error);
  }
}

//Cuando el user quiere cambiar el password una vez ya está loggeado 
export async function updatePasswordToken(authId: number, token: string, tokenExpiration: Date): Promise<void> {
  try {
    await AuthModel.update(
      {
        passwordResetToken: token,
        passwordResetExpires: tokenExpiration
      },
      { where: { id: authId }},
    );
  } catch (error) {
    log.error(error);
  }
}

//Para actualizar el password
export async function updatePassword(authId: number, password: string): Promise<void> {
  try {
    await AuthModel.update(
      {
        password,
        passwordResetToken: '',
        passwordResetExpires: new Date()
      },
      { where: { id: authId }},
    );
  } catch (error) {
    log.error(error);
  }
}

export function signToken(id: number, email: string, username: string): string {
  // uso el metodo sign de jwtoken para crear el token 
  // le paso los campos y la clave secreta
  return sign(
    {
      id,
      email,
      username
    },
    config.JWT_TOKEN! 
  );
}
~~~
----

## Auth service endpoints

- El endpoint de Frontend a la API Gateway será http(s)://host:port/api/v1/gateway/auth
- Aqui están todos los endpoints de auth

![method_auth](methods.png)


## Signup Controller

- Seremos capaces de subir una imagen, cerar un ususario y publicar un mensaje
- Lo que queremos hacer es validar el schema del req.body, usaremos joi
- Si es exitoso necesitamos chequear si ya existe el user o el email
- Si esto sale bien, subiremos la imagen. 
- Si todo sale bien enviaremos una notificación
- **Explicación**
  - Si quiero resolver la respuesta de la promesa directamente uso Promise.resolve y lo guardo en una variable
  - Uso el método validate (o validateAsync) del Schema
  - Si hubiera un error?.details envío en un BadRequest la primera linea del error.details.message
  - Creo el uuid (del profilePublicId) (npm i uuid)
  - La interfaz UploadApiResponse es de Cloudinary(npm i cloudinary), uso uploads de jobber-shared
  - Desde el frontend usaré base64 como encode para el profilePicture
    - El overwrite ne true para que en caso de que exista la sobreescriba
    - invalidate en true para que en caso de que la imagen esté en caché, invalidarla
  - Si no hay publicId lanzo error
  - Uso crypto para codificar a Buffer con Promise.resolve (npm i crypto)
  - 
- El signupController en auth-ms/src/controllers/signup.ts

~~~js
import crypto from 'crypto';

import { signupSchema } from '@auth/schemes/signup';
import { createAuthUser, getUserByUsernameOrEmail, signToken } from '@auth/services/auth.service';
import { BadRequestError, IAuthDocument, IEmailMessageDetails, firstLetterUppercase, lowerCase, uploads } from '@uzochukwueddie/jobber-shared';
import { Request, Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { UploadApiResponse } from 'cloudinary';
import { config } from '@auth/config';
import { publishDirectMessage } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import { StatusCodes } from 'http-status-codes';

export async function create(req: Request, res: Response): Promise<void> {

  //compruebo si hay un error en el schema con el método validate
  const { error } = await Promise.resolve(signupSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'SignUp create() method error');
  }
  //Si llego aqui es que la validación del schema ha pasado, desestructuro
  const { username, email, password, country, profilePicture, browserName, deviceType } = req.body;

  //compruebo que el usuario existe                         //método del auth.service
  const checkIfUserExist: IAuthDocument | undefined = await getUserByUsernameOrEmail(username, email);
  if (checkIfUserExist) {
    throw new BadRequestError('Invalid credentials. Email or Username', 'SignUp create() method error');
  }

  //creo el uuid
  const profilePublicId = uuidV4();

                      //interfaz de Cloudinary                                            //overwrite en true,invalidate en true
  const uploadResult: UploadApiResponse = await uploads(profilePicture, `${profilePublicId}`, true, true) as UploadApiResponse;
  
  //Si no hay public_id lanzo error
  if (!uploadResult.public_id) {
    throw new BadRequestError('File upload error. Try again', 'SignUp create() method error');
  }
          //genero el buffer, import crypto, 20 es el tamaño
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));

  //lo convierto a hexadecimal
  const randomCharacters: string = randomBytes.toString('hex');
  
  //Creo el objeto para pasarle a createAuthUser
  const authData: IAuthDocument = {
    username: firstLetterUppercase(username),
    email: lowerCase(email),
    profilePublicId,
    password,
    country,
    profilePicture: uploadResult?.secure_url,
    emailVerificationToken: randomCharacters,
    browserName,
    deviceType
  } as IAuthDocument;
                                      //método del  auth.service
  const result: IAuthDocument = await createAuthUser(authData) as IAuthDocument;

  //creo el link de verificación
  const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${authData.emailVerificationToken}`;

  const messageDetails: IEmailMessageDetails = {
    receiverEmail: result.email,
    verifyLink: verificationLink, //le paso el link de verificacion al objeto
    template: 'verifyEmail'
  };
  //lo mando a la queue de auth-email
  await publishDirectMessage(
    authChannel,
    'jobber-email-notification',//nombre del exchange en email.consumer
    'auth-email',
    JSON.stringify(messageDetails), //paso a string el messageDetails
    'Verify email message has been sent to notification service.'
  );
                          //signToken método de auth.service
  const userJWT: string = signToken(result.id!, result.email!, result.username!);

  res.status(StatusCodes.CREATED).json({ message: 'User created successfully', user: result, token: userJWT });
}
~~~
- El token se guarda en el API Gateway, en las cookies
- Lo paso en la response
- El método uploads de jobber-shared/cloudinary-uploads

~~~js
import cloudinary, { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export function uploads(
  file: string,
  public_id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        public_id,
        overwrite,
        invalidate,
        resource_type: 'auto' // zip, images
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) resolve(error);
        resolve(result);
      }
    );
  });
}
~~~

- El createAuthUser de auth-ms/src/services/auth.service.ts

~~~js
export async function createAuthUser(data: IAuthDocument): Promise<IAuthDocument | undefined> {
  try {
    const result: Model = await AuthModel.create(data);
    const messageDetails: IAuthBuyerMessageDetails = {
      username: result.dataValues.username!,
      email: result.dataValues.email!,
      profilePicture: result.dataValues.profilePicture!,
      country: result.dataValues.country!,
      createdAt: result.dataValues.createdAt!,
      type: 'auth'
    };
    await publishDirectMessage(
      authChannel,
      'jobber-buyer-update',
      'user-buyer',
      JSON.stringify(messageDetails),
      'Buyer details sent to buyer service.'
    );
    const userData: IAuthDocument = omit(result.dataValues, ['password']) as IAuthDocument;
    return userData;
  } catch (error) {
    log.error(error);
  }
}
~~~

- El publishDirectMessage de auth/src/queues/auth.producer

~~~js
import { config } from '@auth/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@auth/queues/connection';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authServiceProducer', 'debug');

export async function publishDirectMessage(
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> {
  try {
    //si no hay channel lo creo
    if (!channel) {
      //creo la conexión
      channel = await createConnection() as Channel;
    }
    //asigno el exchange
    await channel.assertExchange(exchangeName, 'direct');
    //publico el message
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', 'AuthService Provider publishDirectMessage() method error:', error);
  }
}
~~~

- El signToken de auth.service

~~~js
export function signToken(id: number, email: string, username: string): string {
  return sign(
    {
      id,
      email,
      username
    },
    config.JWT_TOKEN!
  );
}
~~~
-----

## AuthService Signup Routes

- auth-ms/src/routes/auth.ts

~~~js
import { changePassword, forgotPassword, resetPassword } from '@auth/controllers/password';
import { read } from '@auth/controllers/signin';
import { create } from '@auth/controllers/signup';
import { update } from '@auth/controllers/verify-email';
import { updateOTP } from '@auth/controllers/verify-otp';
import express, { Router } from 'express';

const router: Router = express.Router();

export function authRoutes(): Router {
  router.post('/signup', create);
  router.post('/signin', read);
  router.put('/verify-email', update);
  router.put('/verify-otp/:otp', updateOTP);
  router.put('/forgot-password', forgotPassword);
  router.put('/reset-password/:token', resetPassword);
  router.put('/change-password', changePassword);

  return router;
}
~~~

En auth-ms/src/routes.ts


~~~js
import { Application } from 'express';
import { verifyGatewayRequest } from '@uzochukwueddie/jobber-shared';
import { authRoutes } from '@auth/routes/auth';
import { currentUserRoutes } from '@auth/routes/current-user';
import { healthRoutes } from '@auth/routes/health';
import { searchRoutes } from '@auth/routes/search';
import { seedRoutes } from '@auth/routes/seed';

const BASE_PATH = '/api/v1/auth';

export function appRoutes(app: Application): void {
  app.use('', healthRoutes());
  //app.use(BASE_PATH, searchRoutes());
  //app.use(BASE_PATH, seedRoutes());

  app.use(BASE_PATH, verifyGatewayRequest, authRoutes());
  //app.use(BASE_PATH, verifyGatewayRequest, currentUserRoutes());
};
~~~

- El middleware VerifyGatewayRequest de jobber-shared

~~~js
import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from './error-handler';

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

- En el server llamo a appRoutes con una función que meto en start()

~~~js

export function start(app: Application): void {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  authErrorHandler(app);
  startServer(app);
}

function routesMiddleware(app: Application): void {
  appRoutes(app);
}
~~~

- En app.ts llamo al start

~~~js
import express, { Express } from 'express';
import { start } from '@auth/server';
import { databaseConnection } from '@auth/database';
import { config } from '@auth/config';

const initialize = (): void => {
  config.cloudinaryConfig();
  const app: Express = express();
  databaseConnection();
  start(app);
};

initialize();
~~~

- Tengo que darlo de alta en el api- gateway
- Necesito crear una instancia de axios y pasarle una baseUrl
- api-gateway/src/services//api/auth-service.ts

~~~js
import axios, { AxiosResponse } from 'axios';
import { AxiosService } from '@gateway/services/axios';
import { config } from '@gateway/config';
import { IAuth } from '@uzochukwueddie/jobber-shared';

//la instancia de axiosAuth la tengo aqui, la puedo exportar
export let axiosAuthInstance: ReturnType<typeof axios.create>;

class AuthService {
  axiosService: AxiosService;

  //Creo la instancia de axiosAuthService en el constructor
  constructor() {                         //le paso la baseUrl y el service
    this.axiosService = new AxiosService(`${config.AUTH_BASE_URL}/api/v1/auth`, 'auth');

    axiosAuthInstance = this.axiosService.axios;//creo la axiosAuthInstance
  }

  async getCurrentUser(): Promise<AxiosResponse> {
                        //Como es axiosService.axios y viene de axios.create tengo los métodos get, post, etc
    const response: AxiosResponse = await axiosAuthInstance.get('/currentuser');
    return response;
  }

  async getRefreshToken(username: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosAuthInstance.get(`/refresh-token/${username}`);
    return response;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosAuthInstance.put('/change-password', { currentPassword, newPassword });
    return response;
  }

  async verifyEmail(token: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosAuthInstance.put('/verify-email', { token });
    return response;
  }

  async verifyOTP(otp: string, body: { browserName: string, deviceType: string }): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosAuthInstance.put(`/verify-otp/${otp}`, body);
    return response;
  }

  async resendEmail(data: { userId: number, email: string }): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosAuthInstance.post('/resend-email', data);
    return response;
  }

  async signUp(body: IAuth): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosService.axios.post('/signup', body);
    return response;
  }

  async signIn(body: IAuth): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosService.axios.post('/signin', body);
    return response;
  }

  async forgotPassword(email: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosService.axios.put('/forgot-password', { email });
    return response;
  }

  async resetPassword(token: string, password: string, confirmPassword: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosService.axios.put(`/reset-password/${token}`, { password, confirmPassword });
    return response;
  }

  async getGigs(query: string, from: string, size: string, type: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosService.axios.get(`/search/gig/${from}/${size}/${type}?${query}`);
    return response;
  }

  async getGig(gigId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosService.axios.get(`/search/gig/${gigId}`);
    return response;
  }

  async seed(count: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await this.axiosService.axios.put(`/seed/${count}`);
    return response;
  }
}

export const authService: AuthService = new AuthService();
~~~

- El axiosService en api-gateway/src/services/axios
- Cada servicio tendrá su instancia de axios

~~~js
import axios from 'axios';
import { sign } from 'jsonwebtoken';
import { config } from '@gateway/config';

export class AxiosService {
  public axios: ReturnType<typeof axios.create>;

              //le paso la baseUrl y el service en le constructor
  constructor(baseUrl: string, serviceName: string) {
    this.axios = this.axiosCreateInstance(baseUrl, serviceName);
  }

  public axiosCreateInstance(baseUrl: string, serviceName?: string): ReturnType<typeof axios.create> {

    let requestGatewayToken = '';
    
    //creo el token
    if (serviceName) {
      requestGatewayToken = sign({ id: serviceName }, `${config.GATEWAY_JWT_TOKEN}`);
    }

    //paso el token en los headers
    const instance: ReturnType<typeof axios.create> = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        gatewayToken: requestGatewayToken
      },
      withCredentials: true //importante!!
    });
    
    return instance;//devuelvo la instancia
  }
}
~~~

- En el server de api-gateway
- Así es como se usa axios para añadir propiedades dinámicamente
- Antes de que axios haga la request al authService, chequeará que en la request el JWT exista

~~~js
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
        //añado el Bearer Token de las cookies a Authorization de los headers
        axiosAuthInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;

        // axiosBuyerInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
        // axiosSellerInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
        // axiosGigInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
        // axiosMessageInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
        // axiosOrderInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
        // axiosReviewInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
      }
      next();
    });
  }
~~~
---

## Gateway Signup Route

  