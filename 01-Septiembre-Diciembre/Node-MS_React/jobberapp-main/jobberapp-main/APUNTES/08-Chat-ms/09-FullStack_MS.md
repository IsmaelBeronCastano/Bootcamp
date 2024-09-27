# 09 NODE REACT MICROSERVICES - CHAT MICROSERVICE


- Se dará la posibilidad de que el vendedor envíe una oferta customizada  al comprador y que este la acepte o rechace
- Los endpoints con los métodos

!["foto_endpoints"](foto_endpoints.png)

- La conexión con Socket.io será mediante la api-gateway y el microservicio de messages (chat)
----

## Setup

- json

~~~json
{
  "name": "jobber-chat",
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
    "amqplib": "^0.10.3",
    "cloudinary": "^1.41.0",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "elastic-apm-node": "^4.1.0",
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "helmet": "^7.1.0",
    "hpp": "^0.2.3",
    "http-status-codes": "^2.3.0",
    "joi": "^17.11.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.0",
    "pino-pretty": "^10.2.3",
    "socket.io": "^4.7.2",
    "typescript": "^5.2.2",
    "typescript-transform-paths": "^3.4.6",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@jest/types": "^29.6.3",
    "@types/amqplib": "^0.10.4",
    "@types/compression": "^1.7.5",
    "@types/cors": "^2.8.16",
    "@types/express": "^4.17.21",
    "@types/hpp": "^0.2.5",
    "@types/jest": "^29.5.8",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/lodash": "^4.14.201",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
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

- Las variables de entorno

~~~
ENABLE_APM=0
DATABASE_URL=mongodb://127.0.0.1:27017/jobber-chat
GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
NODE_ENV=development
AP_GATEWAY_URL=http://localhost:4000
RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@localhost:5672
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
ELASTIC_SEARCH_URL=http://elastic:admin1234@localhost:9200
ELASTIC_APM_SERVER_URL=http://localhost:8200
ELASTIC_APM_SECRET_TOKEN=
~~~


- El chat-ms/src/config.ts

~~~js
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config({});

if (process.env.ENABLE_APM === '1') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('elastic-apm-node').start({
    serviceName: 'jobber-chat',
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

- La conexión con mongoose chat-ms/src/database.ts

~~~js
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@chat/config';
import mongoose from 'mongoose';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'chatDatabaseServer', 'debug');

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${config.DATABASE_URL}`);
    log.info('Chat service successfully connected to database.');
  } catch (error) {
    log.log('error', 'ChatService databaseConnection() method error:', error);
  }
};

export { databaseConnection };
~~~

- Lo primero será la comunicación entre el frontend y el api-gateway
- Socket.io rquiere un cliente y un server
- La conexión desde el cliente no va dfirectamente al chat-service, siempre a través del api.gateway
- El front actuará de cliente y la api-gateway de server
- LA otra conexión será entre la api-gateway y el chat-service
- La api-gateway actuará como cliente y el chat-service como server
- Una vez la conexión se establece es enviado desde el chat-ms, será escuchado por la api-gateway
  - Si hay un evento que necesita ser enviado desde el frontend se enviará desde la api-gateway
  - No será del chat-service al frontend
- El chat-ms/src/server
- Creo una instancia del Server de socket.io en startServer, le paso el app
- Guardo en socketIO el resultado de mi método createSocketIO donde configuro el cors al instanciar el Server que retorna io, le paso el server
- Hago uso de mi método startHttpServer
- Guardo socketIO en socketIOChatObject que está en el scope global

~~~js
import http from 'http';

import 'express-async-errors';
import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@chat/config';
import { Application, Request, Response, NextFunction, json, urlencoded } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';
import { checkConnection } from '@chat/elasticsearch';
import { appRoutes } from '@chat/routes';
import { createConnection } from '@chat/queues/connection';
import { Channel } from 'amqplib';
import { Server } from 'socket.io';

const SERVER_PORT = 4005;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'chatServer', 'debug');
let chatChannel: Channel; //creo el channel
let socketIOChatObject: Server; //de tipo Server de socket.io

const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  chatErrorHandler(app);
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
  chatChannel = await createConnection() as Channel;
};

const startElasticSearch = (): void => {
  checkConnection();
};

const chatErrorHandler = (app: Application): void => {

  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    log.log('error', `ChatService ${error.comingFrom}:`, error);
    if (error instanceof CustomError) { //paso la interfaz de CustomError
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
};

const startServer = async (app: Application): Promise<void> => {
  try {
    //Instancio el http.server
    const httpServer: http.Server = new http.Server(app);
    //le paso la instancia al método createSocketIO de aqui abajo (un Server con cors configurado)
    const socketIO: Server = await createSocketIO(httpServer);
    startHttpServer(httpServer); //inicio el httpServer poniéndolo a escuchar

    socketIOChatObject = socketIO;//lo paso a una variable del scope global
  } catch (error) {
    log.log('error', 'ChatService startServer() method error:', error);
  }
};

const createSocketIO = async (httpServer: http.Server): Promise<Server> => {
  const io: Server = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }
  });
  return io;
};

//función que inicia el http.server
const startHttpServer = (httpServer: http.Server): void => {
  try {
    log.info(`Chat server has started with process id ${process.pid}`);
    //simplemente lo pongo a escuchar
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Chat server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'ChatService startHttpServer() method error:', error);
  }
};

export { start, chatChannel, socketIOChatObject };
~~~

- chat-ms/src/app.ts

~~~js
import { databaseConnection } from '@chat/database';
import { config } from '@chat/config';
import express, { Express } from 'express';
import { start } from '@chat/server';

const initilize = (): void => {
  config.cloudinaryConfig();
  databaseConnection();
  const app: Express = express();
  start(app);
};

initilize();
~~~

- La conexión a chat-ms/src/elasticSearch

~~~js
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@chat/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'chatElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

const checkConnection = async (): Promise<void> => {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`ChatService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.log('error', 'ChatService checkConnection() method:', error);
    }
  }
};

export {
  checkConnection
};
~~~

- El src/routes/messages.routes.ts

~~~js
import { message } from '@chat/controllers/create';
import { conversation, conversationList, messages, userMessages } from '@chat/controllers/get';
import { markMultipleMessages, markSingleMessage, offer } from '@chat/controllers/update';
import express, { Router } from 'express';

const router: Router = express.Router();

const messageRoutes = (): Router => {
  router.get('/conversation/:senderUsername/:receiverUsername', conversation);
  router.get('/conversations/:username', conversationList);
  router.get('/:senderUsername/:receiverUsername', messages);
  router.get('/:conversationId', userMessages);
  router.post('/', message);
  router.put('/offer', offer);
  router.put('/mark-as-read', markSingleMessage);
  router.put('/mark-multiple-as-read', markMultipleMessages);

  return router;
};

export { messageRoutes };
~~~

- El chat-ms/src/routes/health.routes

~~~js
import { health } from '@chat/controllers/health';
import express, { Router } from 'express';

const router: Router = express.Router();

const healthRoutes = (): Router => {
  router.get('/chat-health', health);

  return router;
};

export { healthRoutes };
~~~

- El src/routes.ts

~~~js
import { verifyGatewayRequest } from '@uzochukwueddie/jobber-shared';
import { Application } from 'express';
import { healthRoutes } from '@chat/routes/health';
import { messageRoutes } from '@chat/routes/message';

const BASE_PATH = '/api/v1/message';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, messageRoutes());
};

export { appRoutes };
~~~

- El verifyGatewayRequest middleware (helper)

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

- Enchat-ms/src/models tengo conversation.schema y message.schema
- chat-ms/src/models/conversation.schema
~~~js
import { IConversationDocument } from '@uzochukwueddie/jobber-shared';
import { Model, Schema, model } from 'mongoose';

const conversationSchema: Schema = new Schema({
  conversationId: { type: String, required: true, unique: true, index: true },
  senderUsername: { type: String, required: true, index: true },
  receiverUsername: { type: String, required: true, index: true },
});

const ConversationModel: Model<IConversationDocument> = model<IConversationDocument>('Conversation', conversationSchema, 'Conversation');
export { ConversationModel };
~~~

- chat-ms/src/models/message.schema

~~~js
import { IMessageDocument } from '@uzochukwueddie/jobber-shared';
import { Model, Schema, model } from 'mongoose';

const messageSchema: Schema = new Schema(
  {
    conversationId: { type: String, required: true, index: true },
    senderUsername: { type: String, required: true, index: true },
    receiverUsername: { type: String, required: true, index: true },
    senderPicture: { type: String, required: true },
    receiverPicture: { type: String, required: true },
    body: { type: String, default: '' },
    file: { type: String, default: '' },
    fileType: { type: String, default: '' },
    fileSize: { type: String, default: '' },
    fileName: { type: String, default: '' },
    gigId: { type: String, default: '' },
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    hasOffer: { type: Boolean, default: false },
    offer: {
      gigTitle: { type: String, default: '' },
      price: { type: Number, default: 0 },
      description: { type: String, default: '' },
      deliveryInDays: { type: Number, default: 0 },
      oldDeliveryDate: { type: String, default: '' },
      newDeliveryDate: { type: String, default: '' },
      accepted: { type: Boolean, default: false },
      cancelled: { type: Boolean, default: false }
    },
    createdAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

const MessageModel: Model<IMessageDocument> = model<IMessageDocument>('Message', messageSchema, 'Message');
export { MessageModel };
~~~

- La validación del schema en chat-ms/src/chema/messages.schema.ts

~~~js
import Joi, { ObjectSchema } from 'joi';

const messageSchema: ObjectSchema = Joi.object().keys({
  conversationId: Joi.string().optional().allow(null, ''),
  _id: Joi.string().optional(),
  body: Joi.string().optional().allow(null, ''),
  hasConversationId: Joi.boolean().optional(), // this is only for checking if conversation id exist
  file: Joi.string().optional().allow(null, ''),
  fileType: Joi.string().optional().allow(null, ''),
  fileName: Joi.string().optional().allow(null, ''),
  fileSize: Joi.string().optional().allow(null, ''),
  gigId: Joi.string().optional().allow(null, ''),
  sellerId: Joi.string().required().messages({
    'string.base': 'Seller id is required',
    'string.empty': 'Seller id is required',
    'any.required': 'Seller id is required'
  }),
  buyerId: Joi.string().required().messages({
    'string.base': 'Buyer id is required',
    'string.empty': 'Buyer id is required',
    'any.required': 'Buyer id is required'
  }),
  senderUsername: Joi.string().required().messages({
    'string.base': 'Sender username is required',
    'string.empty': 'Sender username is required',
    'any.required': 'Sender username is required'
  }),
  senderPicture: Joi.string().required().messages({
    'string.base': 'Sender picture is required',
    'string.empty': 'Sender picture is required',
    'any.required': 'Sender picture is required'
  }),
  receiverUsername: Joi.string().required().messages({
    'string.base': 'Receiver username is required',
    'string.empty': 'Receiver username is required',
    'any.required': 'Receiver username is required'
  }),
  receiverPicture: Joi.string().required().messages({
    'string.base': 'Receiver picture is required',
    'string.empty': 'Receiver picture is required',
    'any.required': 'Receiver picture is required'
  }),
  isRead: Joi.boolean().optional(),
  hasOffer: Joi.boolean().optional(),
  offer: Joi.object({
    gigTitle: Joi.string().optional(),
    price: Joi.number().optional(),
    description: Joi.string().optional(),
    deliveryInDays: Joi.number().optional(),
    oldDeliveryDate: Joi.string().optional(),
    newDeliveryDate: Joi.string().optional(),
    accepted: Joi.boolean().optional(),
    cancelled: Joi.boolean().optional()
  }).optional(),
  createdAt: Joi.string().optional()
});

export { messageSchema };
~~~

- En controllers tengo create, get, update y health
- chat-ms/src/controllers/create.ts

~~~js
import crypto from 'crypto';

import { messageSchema } from '@chat/schemes/message';
import { BadRequestError, IMessageDocument, uploads } from '@uzochukwueddie/jobber-shared';
import { Request, Response } from 'express';
import { UploadApiResponse } from 'cloudinary';
import { addMessage, createConversation } from '@chat/services/message.service';
import { StatusCodes } from 'http-status-codes';

const message = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(messageSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Create message() method');
  }
  let file: string = req.body.file;
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  let result: UploadApiResponse;
  if (file) {
    result = (req.body.fileType === 'zip' ? await uploads(file, `${randomCharacters}.zip`) : await uploads(file)) as UploadApiResponse;
    if (!result.public_id) {
      throw new BadRequestError('File upload error. Try again', 'Create message() method');
    }
    file = result?.secure_url;
  }
  const messageData: IMessageDocument = {
    conversationId: req.body.conversationId,
    body: req.body.body,
    file,
    fileType: req.body.fileType,
    fileSize: req.body.fileSize,
    fileName: req.body.fileName,
    gigId: req.body.gigId,
    buyerId: req.body.buyerId,
    sellerId: req.body.sellerId,
    senderUsername: req.body.senderUsername,
    senderPicture: req.body.senderPicture,
    receiverUsername: req.body.receiverUsername,
    receiverPicture: req.body.receiverPicture,
    isRead: req.body.isRead,
    hasOffer: req.body.hasOffer,
    offer: req.body.offer
  };
  if (!req.body.hasConversationId) {
    await createConversation(`${messageData.conversationId}`, `${messageData.senderUsername}`, `${messageData.receiverUsername}`);
  }
  await addMessage(messageData);
  res.status(StatusCodes.OK).json({ message: 'Message added', conversationId: req.body.conversationId, messageData });
};

export { message };
~~~

- chat-ms/src/controllers/get

~~~js
import { getConversation, getMessages, getUserConversationList, getUserMessages } from '@chat/services/message.service';
import { IConversationDocument, IMessageDocument } from '@uzochukwueddie/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const conversation = async (req: Request, res: Response): Promise<void> => {
  const { senderUsername, receiverUsername } = req.params;
  const conversations: IConversationDocument[] = await getConversation(senderUsername, receiverUsername);
  res.status(StatusCodes.OK).json({ message: 'Chat conversation', conversations });
};

const messages = async (req: Request, res: Response): Promise<void> => {
  const { senderUsername, receiverUsername } = req.params;
  const messages: IMessageDocument[] = await getMessages(senderUsername, receiverUsername);
  res.status(StatusCodes.OK).json({ message: 'Chat messages', messages });
};

const conversationList = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  const messages: IMessageDocument[] = await getUserConversationList(username);
  res.status(StatusCodes.OK).json({ message: 'Conversation list', conversations: messages });
};

const userMessages = async (req: Request, res: Response): Promise<void> => {
  const { conversationId } = req.params;
  const messages: IMessageDocument[] = await getUserMessages(conversationId);
  res.status(StatusCodes.OK).json({ message: 'Chat messages', messages });
};

export {
  conversation,
  messages,
  conversationList,
  userMessages
};
~~~

- chat-ms/src/controllers/update

~~~js
import { markManyMessagesAsRead, markMessageAsRead, updateOffer } from '@chat/services/message.service';
import { IMessageDocument } from '@uzochukwueddie/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const offer = async (req: Request, res: Response): Promise<void> => {
  const { messageId, type } = req.body;
  const message: IMessageDocument = await updateOffer(messageId, type);
  res.status(StatusCodes.OK).json({ message: 'Message updated', singleMessage: message });
};

const markMultipleMessages = async (req: Request, res: Response): Promise<void> => {
  const { messageId, senderUsername, receiverUsername } = req.body;
  await markManyMessagesAsRead(receiverUsername, senderUsername, messageId);
  res.status(StatusCodes.OK).json({ message: 'Messages marked as read' });
};

const markSingleMessage = async (req: Request, res: Response): Promise<void> => {
  const { messageId } = req.body;
  const message: IMessageDocument = await markMessageAsRead(messageId);
  res.status(StatusCodes.OK).json({ message: 'Message marked as read', singleMessage: message });
};

export { offer, markMultipleMessages, markSingleMessage };
~~~

- El chat-ms/src/services/message.service

~~~js
import { ConversationModel } from '@chat/models/conversation.schema';
import { MessageModel } from '@chat/models/message.schema';
import { publishDirectMessage } from '@chat/queues/message.producer';
import { chatChannel, socketIOChatObject } from '@chat/server';
import { IConversationDocument, IMessageDetails, IMessageDocument, lowerCase } from '@uzochukwueddie/jobber-shared';

const createConversation = async (conversationId: string, sender: string, receiver: string): Promise<void> => {
  await ConversationModel.create({
    conversationId,
    senderUsername: sender,
    receiverUsername: receiver
  });
};

const addMessage = async (data: IMessageDocument): Promise<IMessageDocument> => {
  const message: IMessageDocument = await MessageModel.create(data) as IMessageDocument;
  if (data.hasOffer) {
    const emailMessageDetails: IMessageDetails = {
      sender: data.senderUsername,
      amount: `${data.offer?.price}`,
      buyerUsername: lowerCase(`${data.receiverUsername}`),
      sellerUsername: lowerCase(`${data.senderUsername}`),
      title: data.offer?.gigTitle,
      description: data.offer?.description,
      deliveryDays: `${data.offer?.deliveryInDays}`,
      template: 'offer'
    };
    // send email
    await publishDirectMessage(
      chatChannel,
      'jobber-order-notification',
      'order-email',
      JSON.stringify(emailMessageDetails),
      'Order email sent to notification service.'
    );
  }
  socketIOChatObject.emit('message received', message);
  return message;
};

const getConversation = async (sender: string, receiver: string): Promise<IConversationDocument[]> => {
  const query = {
    $or: [
      { senderUsername: sender, receiverUsername: receiver },
      { senderUsername: receiver, receiverUsername: sender },
    ]
  };
  const conversation: IConversationDocument[] = await ConversationModel.aggregate([{ $match: query }]);
  return conversation;
};

const getUserConversationList = async (username: string): Promise<IMessageDocument[]> => {
  const query = {
    $or: [
      { senderUsername: username },
      { receiverUsername: username },
    ]
  };
  const messages: IMessageDocument[] = await MessageModel.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$conversationId',
        result: { $top: { output: '$$ROOT', sortBy: { createdAt: -1 }}}
      }
    },
    {
      $project: {
        _id: '$result._id',
        conversationId: '$result.conversationId',
        sellerId: '$result.sellerId',
        buyerId: '$result.buyerId',
        receiverUsername: '$result.receiverUsername',
        receiverPicture: '$result.receiverPicture',
        senderUsername: '$result.senderUsername',
        senderPicture: '$result.senderPicture',
        body: '$result.body',
        file: '$result.file',
        gigId: '$result.gigId',
        isRead: '$result.isRead',
        hasOffer: '$result.hasOffer',
        createdAt: '$result.createdAt'
      }
    }
  ]);
  return messages;
};

const getMessages = async (sender: string, receiver: string): Promise<IMessageDocument[]> => {
  const query = {
    $or: [
      { senderUsername: sender, receiverUsername: receiver },
      { senderUsername: receiver, receiverUsername: sender },
    ]
  };
  const messages: IMessageDocument[] = await MessageModel.aggregate([
    { $match: query },
    { $sort: { createdAt: 1 }}
  ]);
  return messages;
};

const getUserMessages = async (messageConversationId: string): Promise<IMessageDocument[]> => {
  const messages: IMessageDocument[] = await MessageModel.aggregate([
    { $match: { conversationId: messageConversationId } },
    { $sort: { createdAt: 1 }}
  ]);
  return messages;
};

const updateOffer = async (messageId: string, type: string): Promise<IMessageDocument> => {
  const message: IMessageDocument = await MessageModel.findOneAndUpdate(
    { _id: messageId },
    {
      $set: {
        [`offer.${type}`]: true
      }
    },
    { new: true }
  ) as IMessageDocument;
  return message;
};

const markMessageAsRead = async (messageId: string): Promise<IMessageDocument> => {
  const message: IMessageDocument = await MessageModel.findOneAndUpdate(
    { _id: messageId },
    {
      $set: {
        isRead: true
      }
    },
    { new: true }
  ) as IMessageDocument;
  socketIOChatObject.emit('message updated', message);
  return message;
};

const markManyMessagesAsRead = async (receiver: string, sender: string, messageId: string): Promise<IMessageDocument> => {
  await MessageModel.updateMany(
    { senderUsername: sender, receiverUsername: receiver, isRead: false },
    {
      $set: {
        isRead: true
      }
    },
  ) as IMessageDocument;
  const message: IMessageDocument = await MessageModel.findOne({ _id: messageId }).exec() as IMessageDocument;
  socketIOChatObject.emit('message updated', message);
  return message;
};

export {
  createConversation,
  addMessage,
  getConversation,
  getUserConversationList,
  getMessages,
  getUserMessages,
  updateOffer,
  markMessageAsRead,
  markManyMessagesAsRead
};
~~~

- Vuelvo a pasar el router

~~~js
import { message } from '@chat/controllers/create';
import { conversation, conversationList, messages, userMessages } from '@chat/controllers/get';
import { markMultipleMessages, markSingleMessage, offer } from '@chat/controllers/update';
import express, { Router } from 'express';

const router: Router = express.Router();

const messageRoutes = (): Router => {
  router.get('/conversation/:senderUsername/:receiverUsername', conversation);
  router.get('/conversations/:username', conversationList);
  router.get('/:senderUsername/:receiverUsername', messages);
  router.get('/:conversationId', userMessages);
  router.post('/', message);
  router.put('/offer', offer);
  router.put('/mark-as-read', markSingleMessage);
  router.put('/mark-multiple-as-read', markMultipleMessages);

  return router;
};

export { messageRoutes };
~~~

- En chat-ms/src/queues/connection (RabbitMQ)

~~~js
import { config } from '@chat/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'chatQueueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Chat server connected to queue successfully...');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'ChatService createConnection() method error:', error);
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

- En chat-ms/src/queues/message.producer.ts

~~~js
import { config } from '@chat/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@chat/queues/connection';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'chatServiceProducer', 'debug');

const publishDirectMessage = async (
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> => {
  try {
    if (!channel) {
      channel = await createConnection() as Channel;
    }
    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', 'ChatService publishDirectMessage() method error:', error);
  }
};

export { publishDirectMessage };
~~~

- Error-handler (helper)

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

- En la api-gateway/src/routes/messages

~~~js
import { Create } from '@gateway/controllers/message/create';
import { Get } from '@gateway/controllers/message/get';
import { Update } from '@gateway/controllers/message/update';
import express, { Router } from 'express';

class MessageRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/message/conversation/:senderUsername/:receiverUsername', Get.prototype.conversation);
    this.router.get('/message/conversations/:username', Get.prototype.conversationList);
    this.router.get('/message/:senderUsername/:receiverUsername', Get.prototype.messages);
    this.router.get('/message/:conversationId', Get.prototype.userMessages);
    this.router.post('/message', Create.prototype.message);
    this.router.put('/message/offer', Update.prototype.offer);
    this.router.put('/message/mark-as-read', Update.prototype.markSingleMessage);
    this.router.put('/message/mark-multiple-as-read', Update.prototype.markMultipleMessages);
    return this.router;
  }
}

export const messageRoutes: MessageRoutes = new MessageRoutes();
~~~~

- En api-gateway/src/controllers/messages/create get y update
- create

~~~js
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { messageService } from '@gateway/services/api/message.service';

export class Create {
  public async message(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await messageService.addMessage(req.body);
    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, conversationId: response.data.conversationId, messageData: response.data.messageData });
  }
}
~~~

- get

~~~js
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { messageService } from '@gateway/services/api/message.service';

export class Get {
  public async conversation(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await messageService.getConversation(req.params.senderUsername, req.params.receiverUsername);
    res.status(StatusCodes.OK).json({ message: response.data.message, conversations: response.data.conversations });
  }

  public async messages(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await messageService.getMessages(req.params.senderUsername, req.params.receiverUsername);
    res.status(StatusCodes.OK).json({ message: response.data.message, messages: response.data.messages });
  }

  public async conversationList(req: Request, res: Response): Promise<void> {
    const { username } = req.params;
    const response: AxiosResponse = await messageService.getConversationList(username);
    res.status(StatusCodes.OK).json({ message: response.data.message, conversations: response.data.conversations });
  }

  public async userMessages(req: Request, res: Response): Promise<void> {
    const { conversationId } = req.params;
    const response: AxiosResponse = await messageService.getUserMessages(conversationId);
    res.status(StatusCodes.OK).json({ message: response.data.message, messages: response.data.messages });
  }
}
~~~

- update

~~~js
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { messageService } from '@gateway/services/api/message.service';

export class Update {
  public async offer(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await messageService.updateOffer(req.body.messageId, req.body.type);
    res.status(StatusCodes.OK).json({ message: response.data.message, singleMessage: response.data.singleMessage });
  }

  public async markMultipleMessages(req: Request, res: Response): Promise<void> {
    const { messageId, senderUsername, receiverUsername } = req.body;
    const response: AxiosResponse = await messageService.markMultipleMessagesAsRead(receiverUsername, senderUsername, messageId);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }

  public async markSingleMessage(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await messageService.markMessageAsRead(req.body.messageId);
    res.status(StatusCodes.OK).json({ message: response.data.message, singleMessage: response.data.singleMessage });
  }
}
~~~

- Y en api-gateway/src/services/messages.ts

~~~js
import axios, { AxiosResponse } from 'axios';
import { AxiosService } from '@gateway/services/axios';
import { config } from '@gateway/config';
import { IMessageDocument } from '@uzochukwueddie/jobber-shared';

export let axiosMessageInstance: ReturnType<typeof axios.create>;

class MessageService {
  constructor() {
    const axiosService: AxiosService = new AxiosService(`${config.MESSAGE_BASE_URL}/api/v1/message`, 'message');
    axiosMessageInstance = axiosService.axios;
  }

  async getConversation(senderUsername: string, receiverUsername: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosMessageInstance.get(`/conversation/${senderUsername}/${receiverUsername}`);
    return response;
  }

  async getMessages(senderUsername: string, receiverUsername: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosMessageInstance.get(`/${senderUsername}/${receiverUsername}`);
    return response;
  }

  async getConversationList(username: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosMessageInstance.get(`/conversations/${username}`);
    return response;
  }

  async getUserMessages(conversationId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosMessageInstance.get(`/${conversationId}`);
    return response;
  }

  async addMessage(body: IMessageDocument): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosMessageInstance.post('/', body);
    return response;
  }

  async updateOffer(messageId: string, type: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosMessageInstance.put('/offer', { messageId, type });
    return response;
  }

  async markMessageAsRead(messageId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosMessageInstance.put('/mark-as-read', { messageId });
    return response;
  }

  async markMultipleMessagesAsRead(receiverUsername: string, senderUsername: string, messageId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosMessageInstance.put('/mark-multiple-as-read', {
      receiverUsername,
      senderUsername,
      messageId
    });
    return response;
  }
}

export const messageService: MessageService = new MessageService();
~~~

- En api-gateway/src/services/axios

~~~js
import axios from 'axios';
import { sign } from 'jsonwebtoken';
import { config } from '@gateway/config';

export class AxiosService {
  public axios: ReturnType<typeof axios.create>;

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
    
    return instance;
  }
}
~~~

- En api-gateway/src/sockets/sockets.ts

~~~js
import { config } from '@gateway/config';
import { GatewayCache } from '@gateway/redis/gateway.cache';
import { IMessageDocument, IOrderDocument, IOrderNotifcation, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Server, Socket } from 'socket.io';
import { io, Socket as SocketClient } from 'socket.io-client';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gatewaySocket', 'debug');
let chatSocketClient: SocketClient;
let orderSocketClient: SocketClient;

export class SocketIOAppHandler {
  private io: Server;
  private gatewayCache: GatewayCache;

  constructor(io: Server) {
    this.io = io;
    this.gatewayCache = new GatewayCache();
    this.chatSocketServiceIOConnections();
    this.orderSocketServiceIOConnections();
  }

  public listen(): void {
    this.chatSocketServiceIOConnections();
    this.orderSocketServiceIOConnections();
    this.io.on('connection', async (socket: Socket) => {
      socket.on('getLoggedInUsers', async () => {
        const response: string[] = await this.gatewayCache.getLoggedInUsersFromCache('loggedInUsers');
        this.io.emit('online', response);
      });

      socket.on('loggedInUsers', async (username: string) => {
        const response: string[] = await this.gatewayCache.saveLoggedInUserToCache('loggedInUsers', username);
        this.io.emit('online', response);
      });

      socket.on('removeLoggedInUser', async (username: string) => {
        const response: string[] = await this.gatewayCache.removeLoggedInUserFromCache('loggedInUsers', username);
        this.io.emit('online', response);
      });

      socket.on('category', async (category: string, username: string) => {
        await this.gatewayCache.saveUserSelectedCategory(`selectedCategories:${username}`, category);
      });
    });
  }

  private chatSocketServiceIOConnections(): void {
    chatSocketClient = io(`${config.MESSAGE_BASE_URL}`, {
      transports: ['websocket', 'polling'],
      secure: true
    });

    chatSocketClient.on('connect', () => {
      log.info('ChatService socket connected');
    });

    chatSocketClient.on('disconnect', (reason: SocketClient.DisconnectReason) => {
      log.log('error', 'ChatSocket disconnect reason:', reason);
      chatSocketClient.connect();
    });

    chatSocketClient.on('connect_error', (error: Error) => {
      log.log('error', 'ChatService socket connection error:', error);
      chatSocketClient.connect();
    });

    // custom events
    chatSocketClient.on('message received', (data: IMessageDocument) => {
      this.io.emit('message received', data);
    });

    chatSocketClient.on('message updated', (data: IMessageDocument) => {
      this.io.emit('message updated', data);
    });
  }

  private orderSocketServiceIOConnections(): void {
    orderSocketClient = io(`${config.ORDER_BASE_URL}`, {
      transports: ['websocket', 'polling'],
      secure: true
    });

    orderSocketClient.on('connect', () => {
      log.info('OrderService socket connected');
    });

    orderSocketClient.on('disconnect', (reason: SocketClient.DisconnectReason) => {
      log.log('error', 'OrderSocket disconnect reason:', reason);
      orderSocketClient.connect();
    });

    orderSocketClient.on('connect_error', (error: Error) => {
      log.log('error', 'OrderService socket connection error:', error);
      orderSocketClient.connect();
    });

    // custom event
    orderSocketClient.on('order notification', (order: IOrderDocument, notification: IOrderNotifcation) => {
      this.io.emit('order notification', order, notification);
    });
  }
};
~~~

- En api-gateway/src/redis/gateway.cache.ts tengo los métodos

~~~js
import { config } from '@gateway/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { createClient } from 'redis';

type RedisClient = ReturnType<typeof createClient>;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gatewayCache', 'debug');

export class GatewayCache {
  client: RedisClient;

  constructor() {
    this.client = createClient({ url: `${config.REDIS_HOST}`});
  }

  public async saveUserSelectedCategory(key: string, value: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.SET(key, value);
    } catch (error) {
      log.log('error', 'GatewayService Cache saveUserSelectedCategory() method error:', error);
    }
  }

  public async saveLoggedInUserToCache(key: string, value: string): Promise<string[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const index: number | null = await this.client.LPOS(key, value);
      if (index === null) {
        await this.client.LPUSH(key, value);
        log.info(`User ${value} added`);
      }
      const response: string[] = await this.client.LRANGE(key, 0, -1);
      return response;
    } catch (error) {
      log.log('error', 'GatewayService Cache saveLoggedInUserToCache() method error:', error);
      return [];
    }
  }

  public async getLoggedInUsersFromCache(key: string): Promise<string[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const response: string[] = await this.client.LRANGE(key, 0, -1);
      return response;
    } catch (error) {
      log.log('error', 'GatewayService Cache getLoggedInUsersFromCache() method error:', error);
      return [];
    }
  }

  public async removeLoggedInUserFromCache(key: string, value: string): Promise<string[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.LREM(key, 1, value);
      log.info(`User ${value} removed`);
      const response: string[] = await this.client.LRANGE(key, 0, -1);
      return response;
    } catch (error) {
      log.log('error', 'GatewayService Cache removeLoggedInUserFromCache() method error:', error);
      return [];
    }
  }
}
~~~

- La conexión con redis en api-gateway/src/redis/redis.connection.ts

~~~js
import { config } from '@gateway/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { createClient } from 'redis';
import { Logger } from 'winston';

type RedisClient = ReturnType<typeof createClient>;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gatewayRedisConnection', 'debug');

class RedisConnection {
  client: RedisClient;

  constructor() {
    this.client = createClient({ url: `${config.REDIS_HOST}`});
  }

  async redisConnect(): Promise<void> {
    try {
      await this.client.connect();
      log.info(`GatewayService Redis Connection: ${await this.client.ping()}`);
      this.cacheError();
    } catch (error) {
      log.log('error', 'GatewayService redisConnect() method error:', error);
    }
  };

  private cacheError(): void {
    this.client.on('error', (error: unknown) => {
      log.error(error);
    });
  };
}

export const redisConnection: RedisConnection = new RedisConnection();
~~~
