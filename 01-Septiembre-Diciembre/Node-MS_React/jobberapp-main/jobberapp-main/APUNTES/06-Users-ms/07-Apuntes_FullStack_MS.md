# 07 APUNTES FULLSTACK MICROSERVICES - Users Service


- El users-ms consiste en compradores y vendedores
- No será tan complicado
- Los compradores no tendrán muchas features
- Tendremos varios GET para buyers 
- Del frontend al API-GATEWAY -->http(s)://api-gateway-host:port/api/v1/gateway/buyer
- Del API-Gateway al Users-ms--> http(s)://users-service-host:/port/api/v1/buyer
  - Buyer by Email --> /email GET
  - Buyer by Current Username --> /username GET
  - Buyer by User Name ---> /:username GET
- Los vendedores tendrán algunos endpoints más
- Del frontend al API-GATEWAY -->http(s)://api-gateway-host:port/api/v1/gateway/seller
- Del API-Gateway al Users-ms--> http(s)://users-service-host:/port/api/v1/seller
    - Seller by Id--> /id:sellerId  GET
    - Seller by Username--> /username/:username GET
    - Random Sellers--> /random GET
    - Create Sellers--> /create POST
    - Update Seller-->/:sellerId PUT
    - Seeding Seller--> /seed/:count PUT
- Cuando alguien se registra automáticamente se convierte en un comprador
- Se publica un evento con la data del comprador desde el auth-ms a users-ms
- Entonces, desde el users-ms envioamos la data a la DB
- Tiene más sentido hacer compradores y vendedores por separado en una aplicación real
- Buyers tendrá un servicio, sellers otro
- Una vez verificado el email pueden crear una cuenta como vendedores
- Los vendedores también pueden comprar gigs a otros vendedores 
-----

## Users service setup

- Copio el json de auth-ms
- Copio todos los archivos de raiz (Dockerfile, .env) de auth-ms y lo pego
- Cambio el puerto del Dockerfile y le pongo el 4003
- En el Jest.config.ts cambio el moduleNameWrapper

~~~ts
{    
coverageReporters: ['text-summary', 'lcov'],
moduleNameMapper: {
    '@users/(.*)': ['<rootDir>/src/$1']
}
  
~~~

- Cambio el nombre del package.json

~~~json
{
  "name": "jobber-users",
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
    "mongoose": "^8.0.0",
    "pino-pretty": "^10.2.3",
    "typescript": "^5.2.2",
    "typescript-transform-paths": "^3.4.6",
    "uuid": "^9.0.1",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@jest/types": "^29.6.3",
    "@types/amqplib": "^0.10.3",
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
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.1",
    "tsc-alias": "^1.8.8",
    "tsconfig-paths": "^4.2.0"
  }
}
~~~
-----

## Database Connection

- Será una conexión de mongoDB
- Creo la DATABASE_URL en .env

~~~
ENABLE_APM=0
DATABASE_URL=mongodb://127.0.0.1:27017/jobber-users
GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
NODE_ENV=development
AP_GATEWAY_URL=http://localhost:4000
RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@localhost:5672
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
REDIS_HOST=redis://localhost:6379
ELASTIC_SEARCH_URL=http://elastic:admin1234@localhost:9200
ELASTIC_APM_SERVER_URL=http://localhost:8200
ELASTIC_APM_SECRET_TOKEN=
~~~

- Correremos la imagen de mongoDB con Docker desde el docker-compose.yaml en volumes/
- COloco solo users y mongoDB

~~~yaml
  users:
    container_name: users_container
    build:
      context: ../server/4-users-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4003:4003
    env_file: ../server/4-users-service/.env
    environment:
      - ENABLE_APM=1
      - DATABASE_URL=mongodb://mongodb_container:27017/jobber-users
      - GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
      - JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
      - NODE_ENV=development
      - AP_GATEWAY_URL=http://gateway_container:4000
      - RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@rabbitmq_container:5672
      - CLOUD_NAME=dyamr9ym3
      - CLOUD_API_KEY=385269193982147
      - CLOUD_API_SECRET=-h9hU43QMy68AcIaMyP0ULKbibI
      - REDIS_HOST=redis://redis_container:6379
      - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
      - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
      - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
      - mongodb
  mongodb:
    container_name: mongodb_container
    image: mongo:latest
    restart: always
    ports:
      - 27017:27017
    volumes:
      - ./docker-volumes/data:/data/db
~~~

- El archivo users-ms/src/config

~~~js
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config({});

if (process.env.ENABLE_APM === '1') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('elastic-apm-node').start({
    serviceName: 'jobber-users',
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
  public DATABASE_URL: string | undefined;
  public NODE_ENV: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;
  public JWT_TOKEN: string | undefined;
  public CLOUD_NAME: string | undefined;
  public CLOUD_API_KEY: string | undefined;
  public CLOUD_API_SECRET: string | undefined;
  public GATEWAY_JWT_TOKEN: string | undefined;
  public API_GATEWAY_URL: string | undefined;
  public REDIS_HOST: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
    this.JWT_TOKEN = process.env.JWT_TOKEN || '';
    this.CLOUD_NAME = process.env.CLOUD_NAME || '';
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || '';
    this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || '';
    this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '';
    this.API_GATEWAY_URL = process.env.API_GATEWAY_URL || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
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

- En src/database.ts creo la conexión

~~~js
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@users/config';
import mongoose from 'mongoose';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'usersDatabaseServer', 'debug');

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${config.DATABASE_URL}`);
    log.info('Users service successfully connected to database.');
  } catch (error) {
    log.log('error', 'UsersService databaseConnection() method error:', error);
  }
};

export { databaseConnection };
~~~

- COpio anteriores conexiones de elasticSearch y las pego en src/elasticsearch.ts

~~~js
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@users/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'usersElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

const checkConnection = async (): Promise<void> => {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`UsersService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.log('error', 'UsersService checkConnection() method:', error);
    }
  }
};

export { checkConnection };
~~~

- Copio tambien el server anterior en src/server.ts

~~~js
import http from 'http';

import 'express-async-errors';
import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@users/config';
import { Application, Request, Response, NextFunction, json, urlencoded } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';
import { checkConnection } from '@users/elasticsearch';
import { appRoutes } from '@users/routes';
import { createConnection } from '@users/queues/connection';
import { Channel } from 'amqplib';
import { consumeBuyerDirectMessage, consumeReviewFanoutMessages, consumeSeedGigDirectMessages, consumeSellerDirectMessage } from '@users/queues/user.consumer';

const SERVER_PORT = 4003;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'usersServer', 'debug');

const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  usersErrorHandler(app);
  startServer(app);
};

const securityMiddleware = (app: Application): void => {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: config.API_GATEWAY_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const payload: IAuthPayload = verify(token, config.JWT_TOKEN!) as IAuthPayload;
      req.currentUser = payload;
    }
    next();
  });
};

const standardMiddleware = (app: Application): void => {
  app.use(compression());
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));
};

const routesMiddleware = (app: Application): void => {
  appRoutes(app);
};

const startQueues = async (): Promise<void> => {
  const userChannel: Channel = await createConnection() as Channel;
  // await consumeBuyerDirectMessage(userChannel);
  // await consumeSellerDirectMessage(userChannel);
  // await consumeReviewFanoutMessages(userChannel);
  // await consumeSeedGigDirectMessages(userChannel);
};

const startElasticSearch = (): void => {
  checkConnection();
};

const usersErrorHandler = (app: Application): void => {
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    log.log('error', `UsersService ${error.comingFrom}:`, error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
};

const startServer = (app: Application): void => {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Users server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Users server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'UsersService startServer() method error:', error);
  }
};

export { start };

~~~

- Exporto la función start para usarla en app.ts
- Importo config para establecer la conexión con cloudinary
- La conexión con mongo, le paso 

~~~js
import { databaseConnection } from '@users/database';
import { config } from '@users/config';
import express, { Express } from 'express';
import { start } from '@users/server';

const initialize = (): void => {
  config.cloudinaryConfig();
  databaseConnection();
  const app: Express = express();
  start(app);
};

initialize();
~~~

- El src/routes.ts es este

~~~js
import { verifyGatewayRequest } from '@uzochukwueddie/jobber-shared';
import { Application } from 'express';
import { buyerRoutes } from '@users/routes/buyer';
import { healthRoutes } from '@users/routes/health';
import { sellerRoutes } from '@users/routes/seller';

const BUYER_BASE_PATH = '/api/v1/buyer';
const SELLER_BASE_PATH = '/api/v1/seller';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BUYER_BASE_PATH, verifyGatewayRequest, buyerRoutes());
  app.use(SELLER_BASE_PATH, verifyGatewayRequest, sellerRoutes());
};

export { appRoutes };
~~~

En src/routes tengo buyers.ts

~~~js
import { email, currentUsername, username } from '@users/controllers/buyer/get';
import express, { Router } from 'express';

const router: Router = express.Router();

const buyerRoutes = (): Router => {
  router.get('/email', email);
  router.get('/username', currentUsername);
  router.get('/:username', username);

  return router;
};

export { buyerRoutes };
~~~

- Con su controlador buyer con los métodos get

~~~js
import { getBuyerByEmail, getBuyerByUsername } from '@users/services/buyer.service';
import { IBuyerDocument } from '@uzochukwueddie/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const email = async (req: Request, res: Response): Promise<void> => {
  const buyer: IBuyerDocument | null = await getBuyerByEmail(req.currentUser!.email);
  res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
};

const currentUsername = async (req: Request, res: Response): Promise<void> => {
  const buyer: IBuyerDocument | null = await getBuyerByUsername(req.currentUser!.username);
  res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
};

const username = async (req: Request, res: Response): Promise<void> => {
  const buyer: IBuyerDocument | null = await getBuyerByUsername(req.params.username);
  res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
};

export { email, username, currentUsername };
~~~

- Que llama al src/services/buyer.ts
- Uso exec para ejecutar la query
- 
~~~js
import { BuyerModel } from '@users/models/buyer.schema';
import { IBuyerDocument } from '@uzochukwueddie/jobber-shared';

const getBuyerByEmail = async (email: string): Promise<IBuyerDocument | null> => {
  const buyer: IBuyerDocument | null = await BuyerModel.findOne({ email }).exec() as IBuyerDocument;
  return buyer;
};

const getBuyerByUsername = async (username: string): Promise<IBuyerDocument | null> => {
  const buyer: IBuyerDocument | null = await BuyerModel.findOne({ username }).exec() as IBuyerDocument;
  return buyer;
};

                                                            //devuelvo un array
const getRandomBuyers = async (count: number): Promise<IBuyerDocument[]> => {
                                                                //uso aggregate, dentro de los corchetes uso $sample operator
                                                                //retornará el numero que le pase como count
  const buyers: IBuyerDocument[] = await BuyerModel.aggregate([{ $sample: { size: count }}]);
  return buyers;
};

const createBuyer = async (buyerData: IBuyerDocument): Promise<void> => {
  //me aseguro de que el user no exista 
  const checkIfBuyerExist: IBuyerDocument | null = await getBuyerByEmail(`${buyerData.email}`);
  if (!checkIfBuyerExist) {
    await BuyerModel.create(buyerData);
  }
};

const updateBuyerIsSellerProp = async (email: string): Promise<void> => {
  await BuyerModel.updateOne(
    { email }, //el email que coincida
    {
      $set: { //uso set para cambiar el valor
        isSeller: true //por defecto en false en el modelo
      }
    }
  ).exec();
};

const updateBuyerPurchasedGigsProp = async (buyerId: string, purchasedGigId: string, type: string): Promise<void> => {
  await BuyerModel.updateOne(
    { _id: buyerId },

    //uso un ternario con el type del parámetro
    type === 'purchased-gigs' ?
    {
      $push: {
        purchasedGigs: purchasedGigId //si el tipo coincide subo el gig
      }
    } : {
      $pull: {
        purchasedGigs: purchasedGigId //si no coincide lo borro
      }
    }
  ).exec();
};

export {
  getBuyerByEmail,
  getBuyerByUsername,
  getRandomBuyers,
  createBuyer,
  updateBuyerIsSellerProp,
  updateBuyerPurchasedGigsProp
};
~~~

- El modelo de buyer en src/models/buyer.ts

~~~js
import { IBuyerDocument } from '@uzochukwueddie/jobber-shared';
import mongoose, { Model, Schema, model } from 'mongoose';

const buyerSchema: Schema = new Schema(
  {
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    profilePicture: { type: String, required: true },
    country: { type: String, required: true },
    isSeller: { type: Boolean, default: false }, //por defecto en false
    purchasedGigs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }], //relación
    createdAt: { type: Date }
  },
  {
    versionKey: false
  }
);
                                                            //nombre del modelo, el schema, colección
const BuyerModel: Model<IBuyerDocument> = model<IBuyerDocument>('Buyer', buyerSchema, 'Buyer');
export { BuyerModel };
~~~

- La interfaz de IBuyerDocument esta en job-shared

~~~js
import { ObjectId } from "mongoose";

export interface IBuyerDocument {
  _id?: string | ObjectId;
  username?: string;
  email?: string;
  profilePicture?: string;
  country: string;
  isSeller?: boolean;
  purchasedGigs: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IReduxBuyer {
  type?: string;
  payload: IBuyerDocument;
}
~~~
-------
## Seller

- src/routes/seller.ts

~~~js
import { seller as createSeller } from '@users/controllers/seller/create';
import { id, random, username } from '@users/controllers/seller/get';
import { seed } from '@users/controllers/seller/seed';
import { seller as updateSeller } from '@users/controllers/seller/update';
import express, { Router } from 'express';

const router: Router = express.Router();

const sellerRoutes = (): Router => {
  router.get('/id/:sellerId', id);
  router.get('/username/:username', username);
  router.get('/random/:size', random);
  router.post('/create', createSeller);
  router.put('/:sellerId', updateSeller);
  router.put('/seed/:count', seed);

  return router;
};

export { sellerRoutes };
~~~

- Con sus controladores para cada caso de uso, create, get, update, seed
- src/controller/create

~~~js
import { sellerSchema } from '@users/schemes/seller';
import { createSeller, getSellerByEmail } from '@users/services/seller.service';
import { BadRequestError, ISellerDocument } from '@uzochukwueddie/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const seller = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(sellerSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Create seller() method error');
  }
  const checkIfSellerExist: ISellerDocument | null = await getSellerByEmail(req.body.email);
  if (checkIfSellerExist) {
    throw new BadRequestError('Seller already exist. Go to your account page to update.', 'Create seller() method error');
  }
  const seller: ISellerDocument = {
    profilePublicId: req.body.profilePublicId,
    fullName: req.body.fullName,
    username: req.currentUser!.username,
    email: req.body.email,
    profilePicture: req.body.profilePicture,
    description: req.body.description,
    oneliner: req.body.oneliner,
    country: req.body.country,
    skills: req.body.skills,
    languages: req.body.languages,
    responseTime: req.body.responseTime,
    experience: req.body.experience,
    education: req.body.education,
    socialLinks: req.body.socialLinks,
    certificates: req.body.certificates
  };
  const createdSeller: ISellerDocument = await createSeller(seller);
  res.status(StatusCodes.CREATED).json({ message: 'Seller created successfully.', seller: createdSeller });
};

export { seller };
~~~

- get

~~~js
import { getRandomSellers, getSellerById, getSellerByUsername } from '@users/services/seller.service';
import { ISellerDocument } from '@uzochukwueddie/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const id = async (req: Request, res: Response): Promise<void> => {
  const seller: ISellerDocument | null = await getSellerById(req.params.sellerId);
  res.status(StatusCodes.OK).json({ message: 'Seller profile', seller });
};

const username = async (req: Request, res: Response): Promise<void> => {
  const seller: ISellerDocument | null = await getSellerByUsername(req.params.username);
  res.status(StatusCodes.OK).json({ message: 'Seller profile', seller });
};

const random = async (req: Request, res: Response): Promise<void> => {
  const sellers: ISellerDocument[] = await getRandomSellers(parseInt(req.params.size, 10));
  res.status(StatusCodes.OK).json({ message: 'Random sellers profile', sellers });
};

export { id, username, random };
~~~

- update

~~~js
import { sellerSchema } from '@users/schemes/seller';
import { updateSeller } from '@users/services/seller.service';
import { BadRequestError, ISellerDocument } from '@uzochukwueddie/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const seller = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(sellerSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Update seller() method error');
  }
  const seller: ISellerDocument = {
    profilePublicId: req.body.profilePublicId,
    fullName: req.body.fullName,
    profilePicture: req.body.profilePicture,
    description: req.body.description,
    oneliner: req.body.oneliner,
    country: req.body.country,
    skills: req.body.skills,
    languages: req.body.languages,
    responseTime: req.body.responseTime,
    experience: req.body.experience,
    education: req.body.education,
    socialLinks: req.body.socialLinks,
    certificates: req.body.certificates
  };
  const updatedSeller: ISellerDocument = await updateSeller(req.params.sellerId, seller);
  res.status(StatusCodes.OK).json({ message: 'Seller created successfully.', seller: updatedSeller });
};

export { seller };
~~~

- En el servicio de Seller hacemos uso del model
- src/services/seller.ts

~~~js
import { SellerModel } from '@users/models/seller.schema';
import { IOrderMessage, IRatingTypes, IReviewMessageDetails, ISellerDocument } from '@uzochukwueddie/jobber-shared';
import mongoose from 'mongoose';
import { updateBuyerIsSellerProp } from '@users/services/buyer.service';

const getSellerById = async (sellerId: string): Promise<ISellerDocument | null> => {
  const seller: ISellerDocument | null = await SellerModel.findOne({ _id: new mongoose.Types.ObjectId(sellerId) }).exec() as ISellerDocument;
  return seller;
};

const getSellerByUsername = async (username: string): Promise<ISellerDocument | null> => {
  const seller: ISellerDocument | null = await SellerModel.findOne({ username }).exec() as ISellerDocument;
  return seller;
};

const getSellerByEmail = async (email: string): Promise<ISellerDocument | null> => {
  const seller: ISellerDocument | null = await SellerModel.findOne({ email }).exec() as ISellerDocument;
  return seller;
};

const getRandomSellers = async (size: number): Promise<ISellerDocument[]> => {
  const sellers: ISellerDocument[] = await SellerModel.aggregate([{ $sample: { size }}]);
  return sellers;
};

const createSeller = async (sellerData: ISellerDocument): Promise<ISellerDocument> => {
  const createdSeller: ISellerDocument = await SellerModel.create(sellerData) as ISellerDocument;
  await updateBuyerIsSellerProp(`${createdSeller.email}`);
  return createdSeller;
};

const updateSeller = async (sellerId: string, sellerData: ISellerDocument): Promise<ISellerDocument> => {
  const updatedSeller: ISellerDocument = await SellerModel.findOneAndUpdate(
    { _id: sellerId },
    {
      $set: {
        profilePublicId: sellerData.profilePublicId,
        fullName: sellerData.fullName,
        profilePicture: sellerData.profilePicture,
        description: sellerData.description,
        country: sellerData.country,
        skills: sellerData.skills,
        oneliner: sellerData.oneliner,
        languages: sellerData.languages,
        responseTime: sellerData.responseTime,
        experience: sellerData.experience,
        education: sellerData.education,
        socialLinks: sellerData.socialLinks,
        certificates: sellerData.certificates
      }
    },
    { new: true } //le pongo new en true para que devuelva el objeto actualizado
  ).exec() as ISellerDocument;
  return updatedSeller;
};

const updateTotalGigsCount = async (sellerId: string, count: number): Promise<void> => {
  await SellerModel.updateOne({ _id: sellerId }, { $inc: { totalGigs: count } }).exec();
};

const updateSellerOngoingJobsProp = async (sellerId: string, ongoingJobs: number): Promise<void> => {
  await SellerModel.updateOne({ _id: sellerId }, { $inc: { ongoingJobs } }).exec();
};

const updateSellerCancelledJobsProp = async (sellerId: string): Promise<void> => {
  await SellerModel.updateOne({ _id: sellerId }, { $inc: { ongoingJobs: -1, cancelledJobs: 1 } }).exec();
};

const updateSellerCompletedJobsProp = async (data: IOrderMessage): Promise<void> => {
  const { sellerId, ongoingJobs, completedJobs, totalEarnings, recentDelivery } = data;
  await SellerModel.updateOne(
    { _id: sellerId },
    {
      $inc: {
        ongoingJobs,
        completedJobs,
        totalEarnings
      },
      $set: { recentDelivery: new Date(recentDelivery!) }
    }
    ).exec();
};

const updateSellerReview = async (data: IReviewMessageDetails): Promise<void> => {
  const ratingTypes: IRatingTypes = {
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
  };
  const ratingKey: string = ratingTypes[`${data.rating}`];
  await SellerModel.updateOne(
    { _id: data.sellerId },
    {
      $inc: {
        ratingsCount: 1,
        ratingSum: data.rating,
        [`ratingCategories.${ratingKey}.value`]: data.rating,
        [`ratingCategories.${ratingKey}.count`]: 1,
      }
    }
  ).exec();
};

export {
  getSellerById,
  getSellerByUsername,
  getSellerByEmail,
  getRandomSellers,
  createSeller,
  updateSeller,
  updateTotalGigsCount,
  updateSellerOngoingJobsProp,
  updateSellerCompletedJobsProp,
  updateSellerReview,
  updateSellerCancelledJobsProp
};
~~~

- La interfaz de seller

~~~js
import { ObjectId } from "mongoose";
import { IRatingCategories } from "./review.interface";

// By extending ISellerDocument with the Record<string, any> you allow an object to contain other
// string keys with any values along with those defined in the interface.
// The nice part is that you still have the autocompletion for the defined properties
export type SellerType =
  | string
  | string[]
  | number
  | IRatingCategories
  | Date
  | IExperience
  | IExperience[]
  | IEducation
  | IEducation[]
  | ICertificate
  | ICertificate[]
  | ILanguage
  | ILanguage[]
  | unknown
  | undefined;

export interface ILanguage {
  [key: string]: string | number | undefined;
  _id?: string;
  language: string;
  level: string;
}

export interface IExperience {
  [key: string]: string | number | boolean | undefined;
  _id?: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  currentlyWorkingHere: boolean | undefined;
}

export interface IEducation {
  [key: string]: string | number | undefined;
  _id?: string;
  country: string;
  university: string;
  title: string;
  major: string;
  year: string;
}

export interface ICertificate {
  [key: string]: string | number | undefined;
  _id?: string;
  name: string;
  from: string;
  year: number | string;
}

export interface ISellerDocument extends Record<string, SellerType> {
  _id?: string | ObjectId;
  profilePublicId?: string;
  fullName: string;
  username?: string;
  email?: string;
  profilePicture?: string;
  description: string;
  country: string;
  oneliner: string;
  skills: string[];
  ratingsCount?: number;
  ratingSum?: number;
  ratingCategories?: IRatingCategories;
  languages: ILanguage[];
  responseTime: number;
  recentDelivery?: Date | string;
  experience: IExperience[];
  education: IEducation[];
  socialLinks: string[];
  certificates: ICertificate[];
  ongoingJobs?: number;
  completedJobs?: number;
  cancelledJobs?: number;
  totalEarnings?: number;
  totalGigs?: number;
  paypal?: string; // not needed
  createdAt?: Date | string;
}
~~~

- El schema de Seller en src/models/seller

~~~js
import { ISellerDocument } from '@uzochukwueddie/jobber-shared';
import { Model, Schema, model } from 'mongoose';

const sellerSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    profilePicture: { type: String, required: true },
    description: { type: String, required: true },
    profilePublicId: { type: String, required: true },
    oneliner: { type: String, default: '' },
    country: { type: String, required: true },
    languages: [
      {
        language: { type: String, required: true },
        level: { type: String, required: true },
      }
    ],
    skills: [{ type: String, required: true }],
    ratingsCount: { type: Number, default: 0 },
    ratingSum: { type: Number, default: 0 },
    ratingCategories: {
      five: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 }},
      four: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 }},
      three: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 }},
      two: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 }},
      one: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 }},
    },
    responseTime: { type: Number, default: 0 },
    recentDelivery: { type: Date, default: '' },
    experience: [
      {
        company: { type: String, default: '' },
        title: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        description: { type: String, default: '' },
        currentlyWorkingHere: { type: Boolean, default: false },
      }
    ],
    education: [
      {
        country: { type: String, default: '' },
        university: { type: String, default: '' },
        title: { type: String, default: '' },
        major: { type: String, default: '' },
        year: { type: String, default: '' },
      }
    ],
    socialLinks: [{ type: String, default: '' }],
    certificates: [
      {
        name: { type: String },
        from: { type: String },
        year: { type: Number },
      }
    ],
    ongoingJobs: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    cancelledJobs: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    totalGigs: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

const SellerModel: Model<ISellerDocument> = model<ISellerDocument>('Seller', sellerSchema, 'Seller');
export { SellerModel };
~~~

- La validación del schema en src/schemes/seller.ts

~~~js
import Joi, { ObjectSchema } from 'joi';

const sellerSchema: ObjectSchema = Joi.object().keys({
  fullName: Joi.string().required().messages({
    'string.base': 'Fullname must be of type string',
    'string.empty': 'Fullname is required',
    'any.required': 'Fullname is required'
  }),
  _id: Joi.string().optional(),
  id: Joi.string().optional(),
  username: Joi.string().optional(),
  profilePublicId: Joi.string().optional().allow(null, ''),
  email: Joi.string().optional(),
  profilePicture: Joi.string().required().messages({
    'string.base': 'Please add a profile picture',
    'string.empty': 'Profile picture is required',
    'any.required': 'Profile picture is required'
  }),
  description: Joi.string().required().messages({
    'string.base': 'Please add a seller description',
    'string.empty': 'Seller description is required',
    'any.required': 'Seller description is required'
  }),
  country: Joi.string().required().messages({
    'string.base': 'Please select a country',
    'string.empty': 'Country field is required',
    'any.required': 'Country field is required'
  }),
  oneliner: Joi.string().required().messages({
    'string.base': 'Please add your oneliner',
    'string.empty': 'Oneliner field is required',
    'any.required': 'Oneliner field is required'
  }),
  skills: Joi.array().items(Joi.string()).required().min(1).messages({
    'string.base': 'Please add at least one skill',
    'string.empty': 'Skills are required',
    'any.required': 'Skills are required',
    'array.min': 'Please add at least one skill'
  }),
  languages: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().optional(),
        language: Joi.string(),
        level: Joi.string()
      })
    )
    .required()
    .min(1)
    .messages({
      'string.base': 'Please add at least one language',
      'string.empty': 'Languages are required',
      'any.required': 'Languages are required',
      'array.min': 'Please add at least one language'
    }),
  responseTime: Joi.number().required().greater(0).messages({
    'string.base': 'Please add a response time',
    'string.empty': 'Response time is required',
    'any.required': 'Response time is required',
    'number.greater': 'Response time must be greater than zero'
  }),
  experience: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().optional(),
        company: Joi.string(),
        title: Joi.string(),
        startDate: Joi.string(),
        endDate: Joi.string(),
        description: Joi.string(),
        currentlyWorkingHere: Joi.boolean()
      })
    )
    .required()
    .min(1)
    .messages({
      'string.base': 'Please add at least one work experience',
      'string.empty': 'Experience is required',
      'any.required': 'Experience is required',
      'array.min': 'Please add at least one work experience'
    }),
  education: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().optional(),
        country: Joi.string(),
        university: Joi.string(),
        title: Joi.string(),
        major: Joi.string(),
        year: Joi.string()
      })
    )
    .required()
    .min(1)
    .messages({
      'string.base': 'Please add at least one education',
      'string.empty': 'Education is required',
      'any.required': 'Education is required',
      'array.min': 'Please add at least one education'
    }),
  socialLinks: Joi.array().optional().allow(null, ''),
  certificates: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().optional(),
        name: Joi.string(),
        from: Joi.string(),
        year: Joi.number()
      })
    )
    .optional()
    .allow(null, ''),
  ratingsCount: Joi.number().optional(),
  ratingCategories: Joi.object({
    five: { value: Joi.number(), count: Joi.number() },
    four: { value: Joi.number(), count: Joi.number() },
    three: { value: Joi.number(), count: Joi.number() },
    two: { value: Joi.number(), count: Joi.number() },
    one: { value: Joi.number(), count: Joi.number() }
  }).optional(),
  ratingSum: Joi.number().optional(),
  recentDelivery: Joi.string().optional().allow(null, ''),
  ongoingJobs: Joi.number().optional(),
  completedJobs: Joi.number().optional(),
  cancelledJobs: Joi.number().optional(),
  totalEarnings: Joi.number().optional(),
  totalGigs: Joi.number().optional(),
  createdAt: Joi.string().optional()
});

export { sellerSchema };
~~~

- El seed

~~~js
import { faker } from '@faker-js/faker';
import { BadRequestError, IBuyerDocument, IEducation, IExperience, ISellerDocument } from '@uzochukwueddie/jobber-shared';
import { floor, random, sample, sampleSize } from 'lodash';
import { Request, Response } from 'express';
import { getRandomBuyers } from '@users/services/buyer.service';
import { createSeller, getSellerByEmail } from '@users/services/seller.service';
import { v4 as uuidv4 } from 'uuid';
import { StatusCodes } from 'http-status-codes';

const seed = async (req: Request, res: Response): Promise<void> => {
  const { count } = req.params;
  const buyers: IBuyerDocument[] = await getRandomBuyers(parseInt(count, 10));
  for(let i = 0; i < buyers.length; i++) {
    const buyer: IBuyerDocument = buyers[i];
    const checkIfSellerExist: ISellerDocument | null = await getSellerByEmail(`${buyer.email}`);
    if (checkIfSellerExist) {
      throw new BadRequestError('Seller already exist.', 'SellerSeed seller() method error');
    }
    const basicDescription: string = faker.commerce.productDescription();
    const skills: string[] = ['Programming', 'Web development', 'Mobile development', 'Proof reading', 'UI/UX', 'Data Science', 'Financial modeling', 'Data analysis' ];
    const seller: ISellerDocument = {
      profilePublicId: uuidv4(),
      fullName: faker.person.fullName(),
      username: buyer.username,
      email: buyer.email,
      country: faker.location.country(),
      profilePicture: buyer.profilePicture,
      description: basicDescription.length <= 250 ? basicDescription : basicDescription.slice(0, 250),
      oneliner: faker.word.words({ count: { min: 5, max: 10 }}),
      skills: sampleSize(skills, sample([1, 4])),
      languages: [
        {'language': 'English', 'level': 'Native' },
        {'language': 'Spnish', 'level': 'Basic' },
        {'language': 'German', 'level': 'Basic' },
      ],
      responseTime: parseInt(faker.commerce.price({ min: 1, max: 5, dec: 0 })),
      experience: randomExperiences(parseInt(faker.commerce.price({ min: 2, max: 4, dec: 0 }))),
      education: randomEducation(parseInt(faker.commerce.price({ min: 2, max: 4, dec: 0 }))),
      socialLinks: ['https://kickchatapp.com', 'http://youtube.com', 'https://facebook.com'],
      certificates: [
        {
          'name': 'Flutter App Developer',
          'from': 'Flutter Academy',
          'year': 2021
        },
        {
          'name': 'Android App Developer',
          'from': '2019',
          'year': 2020
        },
        {
          'name': 'IOS App Developer',
          'from': 'Apple Inc.',
          'year': 2019
        }
      ]
    };
    await createSeller(seller);
  }
  res.status(StatusCodes.CREATED).json({ message: 'Sellers created successfully' });
};

const randomExperiences = (count: number): IExperience[] => {
  const result: IExperience[] = [];
  for(let i = 0; i < count; i++) {
    const randomStartYear = [2020, 2021, 2022, 2023, 2024, 2025];
    const randomEndYear = ['Present', '2024', '2025', '2026', '2027'];
    const endYear = randomEndYear[floor(random(0.9) * randomEndYear.length)];
    const experience = {
      company: faker.company.name(),
      title: faker.person.jobTitle(),
      startDate: `${faker.date.month()} ${randomStartYear[floor(random(0.9) * randomStartYear.length)]}`,
      endDate: endYear === 'Present' ? 'Present' : `${faker.date.month()} ${endYear}`,
      description: faker.commerce.productDescription().slice(0, 100),
      currentlyWorkingHere: endYear === 'Present'
    };
    result.push(experience);
  }
  return result;
};

const randomEducation = (count: number): IEducation[] => {
  const result: IEducation[] = [];
  for(let i = 0; i < count; i++) {
    const randomYear = [2020, 2021, 2022, 2023, 2024, 2025];
    const education = {
      country: faker.location.country(),
      university: faker.person.jobTitle(),
      title: faker.person.jobTitle(),
      major: `${faker.person.jobArea()} ${faker.person.jobDescriptor()}`,
      year: `${randomYear[floor(random(0.9) * randomYear.length)]}`,
    };
    result.push(education);
  }
  return result;
};

export { seed };
~~~

- Puedo querer mandar la data del seed a elasticSearch y no mongoDB

- En las src/queues/connection creo la conexión con rabbitMQ

~~~js
import { config } from '@users/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'usersQueueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Users server connected to queue successfully...');
    //si hay error cierro la conexión
    closeConnection(channel, connection);
    //si no retorno el channel
    return channel;
  } catch (error) {
    log.log('error', 'UsersService createConnection() method error:', error);
    return undefined;//si hay error devuelvo undefined
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

- El user-producer tambien en src/queues/user.producer.ts
- recuerda: rabbitMQ trabaja con Buffers!
- Creo el método publishDirectMessage, le paso las variables como parámetro
- Uso try catch
- Compruebo que hay un channel, si no lo hay lo creo
- Aseguro el exchange pasándole el nombre del exchange y el tipo
- Uso channel.publish, le paso el exchange, la routingkey, y el message (siempre como buffer)
- Devuelvo con el log el exito o el error en el catch

~~~js
import { config } from '@users/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@users/queues/connection';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'usersServiceProducer', 'debug');

//creo el método publish 
const publishDirectMessage = async (
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> => {
  try {
    if (!channel) {                      //as channel!
      channel = await createConnection() as Channel;
    }
     //aseguro el exchange, usaré el tipo  de exchange direct
    await channel.assertExchange(exchangeName, 'direct'); 

                                              //el message siempre será un Buffer
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', 'UsersService publishDirectMessage() method error:', error);
  }
};

export { publishDirectMessage };
~~~

- Y el user-consumer
- ConsumBuyerDirectMessage, le paso el channel como parámetro de la función
- Uso un try catch
- Si no existe el channel lo creo
- Guardo las variables exchangeName, routingKey y quewueName
- Aseguro el exchange con assertExchange
- Aseguro la queue con assertQueue, si no existe la crea
  - Será de tipo Replies.AssertQueue de amqplib
- Creo el path entre la queue, el exchange y la routingKey con .bind
- Consumo la queue con channel.consume
- En publishDirectMessage envio el mensaje como un buffer, ahi uso JSON.stringify
  - Para extraer el tipo del message enviado como buffer debo pasarlo a String y luego parsearlo a JSON


~~~js
import { config } from '@users/config';
import { IBuyerDocument, ISellerDocument, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Channel, ConsumeMessage, Replies } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@users/queues/connection';
import { createBuyer, updateBuyerPurchasedGigsProp } from '@users/services/buyer.service';
import {
  getRandomSellers,
  updateSellerCancelledJobsProp,
  updateSellerCompletedJobsProp,
  updateSellerOngoingJobsProp,
  updateSellerReview,
  updateTotalGigsCount
} from '@users/services/seller.service';
import { publishDirectMessage } from '@users/queues/user.producer';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'usersServiceConsumer', 'debug');

const consumeBuyerDirectMessage = async (channel: Channel): Promise<void> => {
  
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'jobber-buyer-update';
    const routingKey = 'user-buyer';
    const queueName = 'user-buyer-queue';

    await channel.assertExchange(exchangeName, 'direct');

    //aseguro la queue. Si no existe la crea
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });

    //creo el path de la queue con el exchange y la routingKey  
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    //consumo la queue
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {

      //para extraer el tipo del buffer debo pasarlo a String y luego parsearlo a JSON
      const { type } = JSON.parse(msg!.content.toString());
      
      //aquí está el tipo que hay en el array
      //si viene de type auth como puse en el auth.service ***
      if (type === 'auth') {                                //tengo que parsear a JSON despues de pasar el message a String
        const { username, email, profilePicture, country, createdAt } = JSON.parse(msg!.content.toString()); 
        

        const buyer: IBuyerDocument = {
          username,
          email,
          profilePicture,
          country,
          purchasedGigs: [],
          createdAt
        };

        //uso el método de buyer.service
        await createBuyer(buyer);
      } else {
        const { buyerId, purchasedGigs } = JSON.parse(msg!.content.toString());
        await updateBuyerPurchasedGigsProp(buyerId, purchasedGigs, type);
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'UsersService UserConsumer consumeBuyerDirectMessage() method error:', error);
  }
};

const consumeSellerDirectMessage = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'jobber-seller-update';
    const routingKey = 'user-seller';
    const queueName = 'user-seller-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const { type, sellerId, ongoingJobs, completedJobs, totalEarnings, recentDelivery, gigSellerId, count } = JSON.parse(
        msg!.content.toString()
      );
      if (type === 'create-order') {
        await updateSellerOngoingJobsProp(sellerId, ongoingJobs);
      } else if (type === 'approve-order') {
        await updateSellerCompletedJobsProp({
          sellerId,
          ongoingJobs,
          completedJobs,
          totalEarnings,
          recentDelivery
        });
      } else if (type === 'update-gig-count') {
        await updateTotalGigsCount(`${gigSellerId}`, count);
      } else if (type === 'cancel-order') {
        await updateSellerCancelledJobsProp(sellerId);
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'UsersService UserConsumer consumeSellerDirectMessage() method error:', error);
  }
};

const consumeReviewFanoutMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'jobber-review';
    const queueName = 'seller-review-queue';
    await channel.assertExchange(exchangeName, 'fanout');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, '');
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const { type } = JSON.parse(msg!.content.toString());
      if (type === 'buyer-review') {
        await updateSellerReview(JSON.parse(msg!.content.toString()));
        await publishDirectMessage(
          channel,
          'jobber-update-gig',
          'update-gig',
          JSON.stringify({ type: 'updateGig', gigReview: msg!.content.toString() }),
          'Message sent to gig service.'
        );
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'UsersService UserConsumer consumeReviewFanoutMessages() method error:', error);
  }
};

const consumeSeedGigDirectMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'jobber-gig';
    const routingKey = 'get-sellers';
    const queueName = 'user-gig-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const { type } = JSON.parse(msg!.content.toString());
      if (type === 'getSellers') {
        const { count } = JSON.parse(msg!.content.toString());
        const sellers: ISellerDocument[] = await getRandomSellers(parseInt(count, 10));
        await publishDirectMessage(
          channel,
          'jobber-seed-gig',
          'receive-sellers',
          JSON.stringify({ type: 'receiveSellers', sellers, count }),
          'Message sent to gig service.'
        );
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'UsersService UserConsumer consumeReviewFanoutMessages() method error:', error);
  }
};

export { consumeBuyerDirectMessage, consumeSellerDirectMessage, consumeReviewFanoutMessages, consumeSeedGigDirectMessages };
~~~

- El tipo auth que desestructuro es el mismo type que puse en el servicio

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
      type: 'auth' //<--- *** este tipo es el que desestructuro desde el consumer

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

- El createBuyer de buyer.service.ts es este
- Uso el modelo para crear el buyer, primero compruebo de que existe con getBuyerByEmail pasándole la data

~~~js
const createBuyer = async (buyerData: IBuyerDocument): Promise<void> => {
  const checkIfBuyerExist: IBuyerDocument | null = await getBuyerByEmail(`${buyerData.email}`);
  if (!checkIfBuyerExist) {
    await BuyerModel.create(buyerData);
  }
};
~~~


- El método createConnection en src/queues/connection.ts

~~~js
import { config } from '@users/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'usersQueueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Users server connected to queue successfully...');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'UsersService createConnection() method error:', error);
    return undefined;
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



- Si vemos la foto, users service produce para enviar los gigs, pero recibe (o consume) de Auth, Order, Gig y Review
![services](notification.png)

- Entonces crearemos más de un consumer
- Primero creamos el user.producer
- Le paso el channel, exchangeName,routingKey, message y logMessage
- He aseguro de que existe el channel con asert, si no lo crea. De tipo direct
-  Hago uso de publish, le paso el exchangeName el routingKey y le message como un Buffer
-  Lanzo el log de success o capturo con el catch el error

~~~js
import { config } from '@users/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@users/queues/connection';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'usersServiceProducer', 'debug');

const publishDirectMessage = async (
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> => {
  try {
    if (!channel) {
      channel = await createConnection() as Channel; //si no hay channel lo creo
    }

    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', 'UsersService publishDirectMessage() method error:', error);
  }
};

export { publishDirectMessage };
~~~
-----

## Buyer Message Consumer

- El users-consumer consumirá los mensajes enviados por auth-ms con createAuthUser
- auth-ms/src/controllers/signup

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
  //uso esto como dto (hay otras formas)
  const { error } = await Promise.resolve(signupSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'SignUp create() method error');
  }
  const { username, email, password, country, profilePicture, browserName, deviceType } = req.body;
  const checkIfUserExist: IAuthDocument | undefined = await getUserByUsernameOrEmail(username, email);
  if (checkIfUserExist) {
    throw new BadRequestError('Invalid credentials. Email or Username', 'SignUp create() method error');
  }

  const profilePublicId = uuidV4();
  const uploadResult: UploadApiResponse = await uploads(profilePicture, `${profilePublicId}`, true, true) as UploadApiResponse;
  if (!uploadResult.public_id) {
    throw new BadRequestError('File upload error. Try again', 'SignUp create() method error');
  }
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
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
  } as IAuthDocument;                  //AQUI LLAMO AL SERVICIO!!
  const result: IAuthDocument = await createAuthUser(authData) as IAuthDocument;
  const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${authData.emailVerificationToken}`;
  const messageDetails: IEmailMessageDetails = {
    receiverEmail: result.email,
    verifyLink: verificationLink,
    template: 'verifyEmail'
  };

  //envio un messgae a email-notification
  await publishDirectMessage(
    authChannel,
    'jobber-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Verify email message has been sent to notification service.'
  );
  const userJWT: string = signToken(result.id!, result.email!, result.username!);
  res.status(StatusCodes.CREATED).json({ message: 'User created successfully', user: result, token: userJWT });
}
~~~

- Si voy al servicio de auth-ms/src/services/auth.service.ts

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
      username: result.dataValues.username!,
      email: result.dataValues.email!,
      profilePicture: result.dataValues.profilePicture!,
      country: result.dataValues.country!,
      createdAt: result.dataValues.createdAt!,
      type: 'auth' //usaré este type para asegurarme que es la queue correcta
    };
    await publishDirectMessage(
      authChannel,    
      'jobber-buyer-update', 0
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

(...code)
~~~

- Este publishDirectMessage está en auth-ms/src/queues/auth.producer

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
    if (!channel) {
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
- Volviendo al consumer en users-ms/src/queues/user.producer.ts
- le paso un Channel a la función
- me aseguro de que hay un canal, uso el createConnection si no lo hay
- Nombro el exchange, routingKey con los strings del message enviado desde auth-ms/auth.service
- Nombro la queue
- Utilizo asssertExchange para asegurar el exchange
- Aseguro la queue con assertQueue pasándole el nombre de la queue y unas opciones
- Utilizo bindQueue para crear el path pasándole la queue, el exchangeName y la routingKey
  - En el callback de esta función obtengo el msg
  - Utilizo la desestructuración para obtener el type ('auth', lo puse en auth-ms)
  - Me servirá para asegurarme de que estoy en la queue correcta
  - En el publishDirectMessage de auth-ms/auth.service pasé el mensaje como Buffer.from
  - Para consumirlo aqui lo paso a string con toString y lo parseo a JSON
  - La data está en msg.content
  - Si el tipo es auth hago lo mismo para desestructurar la data que hay en msg.content
  - Lo hago así para evitar errores
  - LLamo a createBuyer

~~~js
import { config } from '@users/config';
import { IBuyerDocument, ISellerDocument, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Channel, ConsumeMessage, Replies } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@users/queues/connection';
import { createBuyer, updateBuyerPurchasedGigsProp } from '@users/services/buyer.service';
import {
  getRandomSellers,
  updateSellerCancelledJobsProp,
  updateSellerCompletedJobsProp,
  updateSellerOngoingJobsProp,
  updateSellerReview,
  updateTotalGigsCount
} from '@users/services/seller.service';
import { publishDirectMessage } from '@users/queues/user.producer';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'usersServiceConsumer', 'debug');

const consumeBuyerDirectMessage = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'jobber-buyer-update';
    const routingKey = 'user-buyer';
    const queueName = 'user-buyer-queue';

    await channel.assertExchange(exchangeName, 'direct');

    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const { type } = JSON.parse(msg!.content.toString());

      if (type === 'auth') { //este type está en en auth-ms/auth service
        const { username, email, profilePicture, country, createdAt } = JSON.parse(msg!.content.toString());
        const buyer: IBuyerDocument = {
          username,
          email,
          profilePicture,
          country,
          purchasedGigs: [],
          createdAt
        };
        await createBuyer(buyer);
      } else {
        const { buyerId, purchasedGigs } = JSON.parse(msg!.content.toString());
        await updateBuyerPurchasedGigsProp(buyerId, purchasedGigs, type);//lo veremos mas adelante
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'UsersService UserConsumer consumeBuyerDirectMessage() method error:', error);
  }
};

//uso la misma estrategia que en el anterior, verificando con el type
const consumeSellerDirectMessage = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'jobber-seller-update';
    const routingKey = 'user-seller';
    const queueName = 'user-seller-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const { type, sellerId, ongoingJobs, completedJobs, totalEarnings, recentDelivery, gigSellerId, count } = JSON.parse(
        msg!.content.toString()
      );
      if (type === 'create-order') {
        await updateSellerOngoingJobsProp(sellerId, ongoingJobs);
      } else if (type === 'approve-order') {
        await updateSellerCompletedJobsProp({
          sellerId,
          ongoingJobs,
          completedJobs,
          totalEarnings,
          recentDelivery
        });
      } else if (type === 'update-gig-count') {
        await updateTotalGigsCount(`${gigSellerId}`, count);
      } else if (type === 'cancel-order') {
        await updateSellerCancelledJobsProp(sellerId);
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'UsersService UserConsumer consumeSellerDirectMessage() method error:', error);
  }
};


export { consumeBuyerDirectMessage, consumeSellerDirectMessage, consumeReviewFanoutMessages, consumeSeedGigDirectMessages };
~~~

- EL type para asegurar que hago bien la desestructuración de type está en auth-ms/src/services/auth.service.ts

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
      type: 'auth' //AQUI!!!
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

- El createBuyer que llama el ConsumBuyerDirectMessage está en el users-ms/src/services/buyer.service

~~~js
const getBuyerByEmail = async (email: string): Promise<IBuyerDocument | null> => {
  const buyer: IBuyerDocument | null = await BuyerModel.findOne({ email }).exec() as IBuyerDocument;
  return buyer;
};

const createBuyer = async (buyerData: IBuyerDocument): Promise<void> => {
  const checkIfBuyerExist: IBuyerDocument | null = await getBuyerByEmail(`${buyerData.email}`);
  if (!checkIfBuyerExist) {
    await BuyerModel.create(buyerData);
  }
};
~~~

- Debo poner a escuchar el consumer en el users/src/server

~~~js
const startQueues = async (): Promise<void> => {
  const userChannel: Channel = await createConnection() as Channel;
  //consumers
  await consumeBuyerDirectMessage(userChannel);
  await consumeSellerDirectMessage(userChannel);
  
  // await consumeReviewFanoutMessages(userChannel);
  // await consumeSeedGigDirectMessages(userChannel);
};
~~~
-----
