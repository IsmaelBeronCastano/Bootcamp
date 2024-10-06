# 10 FULL STACK MICROSERVICES - ORDER MICROSERVICE

- OrderService se encargará de administrar los gigs encargados por el comprador
- La orden se comunicará con notification-ms. 
- Enviará un mail cuando se cree una orden
- El modelo
- order-ms/src/models/order.schema

~~~js
import { IOrderDocument } from '@uzochukwueddie/jobber-shared';
import { model, Model, Schema } from 'mongoose';

const orderSchema: Schema = new Schema(
  {
    offer: {
      gigTitle: { type: String, required: true },
      price: { type: Number, required: true },
      description: { type: String, required: true },
      deliveryInDays: { type: Number, required: true },
      oldDeliveryDate: { type: Date },
      newDeliveryDate: { type: Date },
      accepted: { type: Boolean, required: true },
      cancelled: { type: Boolean, required: true },
      reason: { type: String, default: '' }
    },
    gigId: { type: String, required: true },
    sellerId: { type: String, required: true, index: true },
    sellerUsername: { type: String, required: true },
    sellerImage: { type: String, required: true },
    sellerEmail: { type: String, required: true },
    gigCoverImage: { type: String, required: true },
    gigMainTitle: { type: String, required: true },
    gigBasicTitle: { type: String, required: true },
    gigBasicDescription: { type: String, required: true },
    buyerId: { type: String, required: true, index: true },
    buyerUsername: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    buyerImage: { type: String, required: true },
    status: { type: String, required: true },
    orderId: { type: String, required: true, index: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    serviceFee: { type: Number, default: 0 },
    requirements: { type: String, default: '' },
    approved: { type: Boolean, default: false },
    delivered: { type: Boolean, default: false },
    cancelled: { type: Boolean, default: false },
    approvedAt: { type: Date },
    paymentIntent: { type: String },
    deliveredWork: [
      {
        message: { type: String },
        file: { type: String },
        fileType: { type: String },
        fileSize: { type: String },
        fileName: { type: String }
      }
    ],
    requestExtension: {
      originalDate: { type: String, default: '' },
      newDate: { type: String, default: '' },
      days: { type: Number, default: 0 },
      reason: { type: String, default: '' }
    },
    dateOrdered: { type: Date, default: Date.now },
    events: {
      placeOrder: { type: Date },
      requirements: { type: Date },
      orderStarted: { type: Date },
      deliveryDateUpdate: { type: Date },
      orderDelivered: { type: Date },
      buyerReview: { type: Date },
      sellerReview: { type: Date }
    },
    buyerReview: {
      rating: { type: Number, default: 0 },
      review: { type: String, default: '' },
      created: { type: Date }
    },
    sellerReview: {
      rating: { type: Number, default: 0 },
      review: { type: String, default: '' },
      created: { type: Date }
    }
  },
  {
    versionKey: false
  }
);

const OrderModel: Model<IOrderDocument> = model<IOrderDocument>('Order', orderSchema, 'Order');
export { OrderModel };
~~~

- El notification-schema

~~~js
import { IOrderNotifcation } from '@uzochukwueddie/jobber-shared';
import { model, Model, Schema } from 'mongoose';

const notificationSchema: Schema = new Schema({
  userTo: { type: String, default: '', index: true },
  senderUsername: { type: String, default: '' },
  senderPicture: { type: String, default: '' },
  receiverUsername: { type: String, default: '' },
  receiverPicture: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  message: { type: String, default: '' },
  orderId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const OrderNotificationModel: Model<IOrderNotifcation> = model<IOrderNotifcation>(
  'OrderNotification',
  notificationSchema,
  'OrderNotification'
);
export { OrderNotificationModel };
~~~


- La validación en src/schemes

~~~js
import Joi, { ObjectSchema } from 'joi';

const orderSchema: ObjectSchema = Joi.object().keys({
  offer: Joi.object({
    gigTitle: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    deliveryInDays: Joi.number().required(),
    oldDeliveryDate: Joi.string().required(),
    newDeliveryDate: Joi.string().optional(),
    accepted: Joi.boolean().required(),
    cancelled: Joi.boolean().required()
  }).required(),
  gigId: Joi.string().required(),
  sellerId: Joi.string().required(),
  sellerUsername: Joi.string().required(),
  sellerEmail: Joi.string().required(),
  sellerImage: Joi.string().required(),
  gigCoverImage: Joi.string().required(),
  gigMainTitle: Joi.string().required(),
  gigBasicTitle: Joi.string().required(),
  gigBasicDescription: Joi.string().required(),
  buyerId: Joi.string().required(),
  buyerUsername: Joi.string().required(),
  buyerEmail: Joi.string().required(),
  buyerImage: Joi.string().required(),
  status: Joi.string().required(),
  orderId: Joi.string().required(),
  invoiceId: Joi.string().required(),
  quantity: Joi.number().required(),
  price: Joi.number().required(),
  serviceFee: Joi.number().optional(),
  requirements: Joi.string().optional().allow(null, ''),
  paymentIntent: Joi.string().required(),
  requestExtension: Joi.object({
    originalDate: Joi.string().required(),
    newDate: Joi.string().required(),
    days: Joi.number().required(),
    reason: Joi.string().required()
  }).optional(),
  delivered: Joi.boolean().optional(),
  approvedAt: Joi.string().optional(),
  deliveredWork: Joi.array()
    .items(
      Joi.object({
        message: Joi.string(),
        file: Joi.string()
      })
    )
    .optional(),
  dateOrdered: Joi.string().optional(),
  events: Joi.object({
    placeOrder: Joi.string(),
    requirements: Joi.string(),
    orderStarted: Joi.string(),
    deliverydateUpdate: Joi.string().optional(),
    orderDelivered: Joi.string().optional(),
    buyerReview: Joi.string().optional(),
    sellerReview: Joi.string().optional()
  }).optional(),
  buyerReview: Joi.object({
    rating: Joi.number(),
    review: Joi.string()
  }).optional(),
  sellerReview: Joi.object({
    rating: Joi.number(),
    review: Joi.string()
  }).optional()
});

const orderUpdateSchema: ObjectSchema = Joi.object().keys({
  originalDate: Joi.string().required(),
  newDate: Joi.string().required(),
  days: Joi.number().required(),
  reason: Joi.string().required(),
  deliveryDateUpdate: Joi.string().optional()
});

export { orderSchema, orderUpdateSchema };
~~~

- En  orders-ms/src/services/notification.service

~~~js
import { OrderNotificationModel } from '@order/models/notification.schema';
import { socketIOOrderObject } from '@order/server';
import { IOrderDocument, IOrderNotifcation } from '@uzochukwueddie/jobber-shared';
import { getOrderByOrderId } from '@order/services/order.service';

const createNotification = async (data: IOrderNotifcation): Promise<IOrderNotifcation> => {
  const notification: IOrderNotifcation = await OrderNotificationModel.create(data);
  return notification;
};

const getNotificationsById = async (userToId: string): Promise<IOrderNotifcation[]> => {
  const notifications: IOrderNotifcation[] = await OrderNotificationModel.aggregate([{ $match: { userTo: userToId }}]);
  return notifications;
};

const markNotificationAsRead = async (notificationId: string): Promise<IOrderNotifcation> => {
  const notification: IOrderNotifcation = await OrderNotificationModel.findOneAndUpdate(
    { _id: notificationId },
    {
      $set: {
        isRead: true
      }
    },
    { new: true }
  ) as IOrderNotifcation;
  const order: IOrderDocument = await getOrderByOrderId(notification.orderId);
  socketIOOrderObject.emit('order notification', order, notification);
  return notification;
};

const sendNotification = async (data: IOrderDocument, userToId: string, message: string): Promise<void> => {
  const notification: IOrderNotifcation = {
    userTo: userToId,
    senderUsername: data.sellerUsername,
    senderPicture: data.sellerImage,
    receiverUsername: data.buyerUsername,
    receiverPicture: data.buyerImage,
    message,
    orderId: data.orderId
  } as IOrderNotifcation;
  const orderNotification: IOrderNotifcation = await createNotification(notification);
  socketIOOrderObject.emit('order notification', data, orderNotification);
};

export {
  createNotification,
  getNotificationsById,
  markNotificationAsRead,
  sendNotification
};
~~~

- orders-ms/src/controller/orders/get.ts

~~~ms
import { IOrderDocument } from '@uzochukwueddie/jobber-shared';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { getOrderByOrderId, getOrdersByBuyerId, getOrdersBySellerId } from '@order/services/order.service';

const orderId = async (req: Request, res: Response): Promise<void> => {
  const order: IOrderDocument = await getOrderByOrderId(req.params.orderId);
  res.status(StatusCodes.OK).json({ message: 'Order by order id', order });
};

const sellerOrders = async (req: Request, res: Response): Promise<void> => {
  const orders: IOrderDocument[] = await getOrdersBySellerId(req.params.sellerId);
  res.status(StatusCodes.OK).json({ message: 'Seller orders', orders });
};

const buyerOrders = async (req: Request, res: Response): Promise<void> => {
  const orders: IOrderDocument[] = await getOrdersByBuyerId(req.params.buyerId);
  res.status(StatusCodes.OK).json({ message: 'Buyer orders', orders });
};

export {
  orderId,
  sellerOrders,
  buyerOrders
};
~~~

- create

> npm install stripe

~~~js
import Stripe from 'stripe';
import { Request, Response } from 'express';
import { config } from '@order/config';
import { StatusCodes } from 'http-status-codes';
import { orderSchema } from '@order/schemes/order';
import { BadRequestError, IOrderDocument } from '@uzochukwueddie/jobber-shared';
import { createOrder } from '@order/services/order.service';

const stripe: Stripe = new Stripe(config.STRIPE_API_KEY!, {
  typescript: true
});

const intent = async (req: Request, res: Response): Promise<void> => {
  const customer: Stripe.Response<Stripe.ApiSearchResult<Stripe.Customer>> = await stripe.customers.search({
    query: `email:"${req.currentUser!.email}"`
  });
  let customerId = '';
  if (customer.data.length === 0) {
    const createdCustomer: Stripe.Response<Stripe.Customer> = await stripe.customers.create({
      email: `${req.currentUser!.email}`,
      metadata: {
        buyerId: `${req.body.buyerId}`
      }
    });
    customerId = createdCustomer.id;
  } else {
    customerId = customer.data[0].id;
  }

  let paymentIntent: Stripe.Response<Stripe.PaymentIntent>;
  if (customerId) {
    // the service charge is 5.5% of the purchase amount
    // for purchases under $50, an additional $2 is applied
    const serviceFee: number = req.body.price < 50 ? (5.5 / 100) * req.body.price + 2 : (5.5 / 100) * req.body.price;
    paymentIntent = await stripe.paymentIntents.create({
      amount: Math.floor((req.body.price + serviceFee) * 100),
      currency: 'usd',
      customer: customerId,
      automatic_payment_methods: { enabled: true },
    });
  }
  res.status(StatusCodes.CREATED).json({
    message: 'Order intent created successfully.',
    clientSecret: paymentIntent!.client_secret,
    paymentIntentId: paymentIntent!.id
  });
};

const order = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(orderSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Create order() method');
  }
  const serviceFee: number = req.body.price < 50 ? (5.5 / 100) * req.body.price + 2 : (5.5 / 100) * req.body.price;
  let orderData: IOrderDocument = req.body;
  orderData = { ...orderData, serviceFee };
  const order: IOrderDocument = await createOrder(orderData);
  res.status(StatusCodes.CREATED).json({ message: 'Order created successfully.', order });
};

export { intent, order };
~~~

- update

~~~js
import crypto from 'crypto';

import Stripe from 'stripe';
import { Request, Response } from 'express';
import { config } from '@order/config';
import { StatusCodes } from 'http-status-codes';
import { approveDeliveryDate, approveOrder, cancelOrder, rejectDeliveryDate, requestDeliveryExtension, sellerDeliverOrder } from '@order/services/order.service';
import { orderUpdateSchema } from '@order/schemes/order';
import { BadRequestError, IDeliveredWork, IOrderDocument, uploads } from '@uzochukwueddie/jobber-shared';
import { UploadApiResponse } from 'cloudinary';

const stripe: Stripe = new Stripe(config.STRIPE_API_KEY!, {
  typescript: true
});

const cancel = async (req: Request, res: Response): Promise<void> => {
  await stripe.refunds.create({
    payment_intent: `${req.body.paymentIntent}`
  });
  const { orderId } = req.params;
  await cancelOrder(orderId, req.body.orderData);
  res.status(StatusCodes.OK).json({ message: 'Order cancelled successfully.'});
};

const requestExtension = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(orderUpdateSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Update requestExtension() method');
  }
  const { orderId } = req.params;
  const order: IOrderDocument = await requestDeliveryExtension(orderId, req.body);
  res.status(StatusCodes.OK).json({ message: 'Order delivery request', order });
};

const deliveryDate = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(orderUpdateSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Update deliveryDate() method');
  }
  const { orderId, type } = req.params;
  const order: IOrderDocument = type === 'approve' ? await approveDeliveryDate(orderId, req.body) : await rejectDeliveryDate(orderId);
  res.status(StatusCodes.OK).json({ message: 'Order delivery date extension', order });
};

const buyerApproveOrder = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params;
  const order: IOrderDocument = await approveOrder(orderId, req.body);
  res.status(StatusCodes.OK).json({ message: 'Order approved successfully.', order });
};

const deliverOrder = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params;
  let file: string = req.body.file;
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  let result: UploadApiResponse;
  if (file) {
    result = (req.body.fileType === 'zip' ? await uploads(file, `${randomCharacters}.zip`) : await uploads(file)) as UploadApiResponse;
    if (!result.public_id) {
      throw new BadRequestError('File upload error. Try again', 'Update deliverOrder() method');
    }
    file = result?.secure_url;
  }
  const deliveredWork: IDeliveredWork = {
    message: req.body.message,
    file,
    fileType: req.body.fileType,
    fileName: req.body.fileName,
    fileSize: req.body.fileSize,
  };
  const order: IOrderDocument = await sellerDeliverOrder(orderId, true, deliveredWork);
  res.status(StatusCodes.OK).json({ message: 'Order delivered successfully.', order });
};

export {
  cancel,
  requestExtension,
  deliveryDate,
  buyerApproveOrder,
  deliverOrder
};
~~~

- En controllers/notification/get

~~~js
import { getNotificationsById } from '@order/services/notification.service';
import { IOrderNotifcation } from '@uzochukwueddie/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const notifications = async (req: Request, res: Response): Promise<void> => {
  const notifications: IOrderNotifcation[] = await getNotificationsById(req.params.userTo);
  res.status(StatusCodes.OK).json({ message: 'Notifications', notifications });
};

export { notifications };
~~~

- update

~~~js
import { markNotificationAsRead } from '@order/services/notification.service';
import { IOrderNotifcation } from '@uzochukwueddie/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const markSingleNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
  const { notificationId } = req.body;
  const notification: IOrderNotifcation = await markNotificationAsRead(notificationId);
  res.status(StatusCodes.OK).json({ message: 'Notification updated successfully.', notification });
};

export { markSingleNotificationAsRead };
~~~

## RabbitMq

- order.producer

~~~js
import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@order/queues/connection';
import { config } from '@order/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'orderServiceProducer', 'debug');

export const publishDirectMessage = async (
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', 'OrderService OrderServiceProducer publishDirectMessage() method:', error);
  }
};
~~~

- order.consumer

~~~js
import { Channel, ConsumeMessage, Replies } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@order/queues/connection';
import { config } from '@order/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { updateOrderReview } from '@order/services/order.service';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'orderServiceConsumer', 'debug');

export const consumerReviewFanoutMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'jobber-review';
    const queueName = 'order-review-queue';
    await channel.assertExchange(exchangeName, 'fanout');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, '');
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      await updateOrderReview(JSON.parse(msg!.content.toString()));
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'OrderService comsumer consumerReviewFanoutMessages() method:', error);
  }
};
~~~

- En src/routes/order.ts

~~~js
import { notifications } from '@order/controllers/notification/get';
import { intent, order } from '@order/controllers/order/create';
import { buyerOrders, orderId, sellerOrders } from '@order/controllers/order/get';
import { buyerApproveOrder, cancel, deliverOrder, deliveryDate, requestExtension } from '@order/controllers/order/update';
import { markNotificationAsRead } from '@order/services/notification.service';
import express, { Router } from 'express';

const router: Router = express.Router();

const orderRoutes = (): Router => {
  router.get('/notification/:userTo', notifications);
  router.get('/:orderId', orderId);
  router.get('/seller/:sellerId', sellerOrders);
  router.get('/buyer/:buyerId', buyerOrders);
  router.post('/', order);
  router.post('/create-payment-intent', intent);
  router.put('/cancel/:orderId', cancel);
  router.put('/extension/:orderId', requestExtension);
  router.put('/deliver-order/:orderId', deliverOrder);
  router.put('/approve-order/:orderId', buyerApproveOrder);
  router.put('/gig/:type/:orderId', deliveryDate);
  router.put('/notification/mark-as-read', markNotificationAsRead);

  return router;
};

export { orderRoutes };
~~~

-src/routes

~~~js
import { verifyGatewayRequest } from '@uzochukwueddie/jobber-shared';
import { Application } from 'express';
import { healthRoutes } from '@order/routes/health';
import { orderRoutes } from '@order/routes/order';

const BASE_PATH = '/api/v1/order';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, orderRoutes());
};

export { appRoutes };
~~~

- src/database

~~~js
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@order/config';
import mongoose from 'mongoose';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'orderDatabaseServer', 'debug');

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${config.DATABASE_URL}`);
    log.info('Order service successfully connected to database.');
  } catch (error) {
    log.log('error', 'OrderService databaseConnection() method error:', error);
  }
};

export { databaseConnection };
~~~

- src/elasticSearch

~~~js
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@order/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'orderElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

const checkConnection = async (): Promise<void> => {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`OrderService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.log('error', 'OrderService checkConnection() method:', error);
    }
  }
};

export {
  checkConnection
};
~~~

- src/server

~~~js
import http from 'http';

import 'express-async-errors';
import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@order/config';
import { Application, Request, Response, NextFunction, json, urlencoded } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';
import { checkConnection } from '@order/elasticsearch';
import { appRoutes } from '@order/routes';
import { createConnection } from '@order/queues/connection';
import { Channel } from 'amqplib';
import { Server } from 'socket.io';
import { consumerReviewFanoutMessages } from '@order/queues/order.consumer';

const SERVER_PORT = 4006;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'orderServer', 'debug');
let orderChannel: Channel;
let socketIOOrderObject: Server;

const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  orderErrorHandler(app);
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
  orderChannel = await createConnection() as Channel;
  await consumerReviewFanoutMessages(orderChannel);
};

const startElasticSearch = (): void => {
  checkConnection();
};

const orderErrorHandler = (app: Application): void => {
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    log.log('error', `OrderService ${error.comingFrom}:`, error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
};

const startServer = async (app: Application): Promise<void> => {
  try {
    const httpServer: http.Server = new http.Server(app);
    const socketIO: Server = await createSocketIO(httpServer);
    startHttpServer(httpServer);
    socketIOOrderObject = socketIO;
  } catch (error) {
    log.log('error', 'OrderService startServer() method error:', error);
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

const startHttpServer = (httpServer: http.Server): void => {
  try {
    log.info(`Order server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Order server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'OrderService startHttpServer() method error:', error);
  }
};

export { start, orderChannel, socketIOOrderObject };
~~~

- src/app.ts

~~~js
import http from 'http';

import 'express-async-errors';
import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@order/config';
import { Application, Request, Response, NextFunction, json, urlencoded } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';
import { checkConnection } from '@order/elasticsearch';
import { appRoutes } from '@order/routes';
import { createConnection } from '@order/queues/connection';
import { Channel } from 'amqplib';
import { Server } from 'socket.io';
import { consumerReviewFanoutMessages } from '@order/queues/order.consumer';

const SERVER_PORT = 4006;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'orderServer', 'debug');
let orderChannel: Channel;
let socketIOOrderObject: Server;

const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  orderErrorHandler(app);
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
  orderChannel = await createConnection() as Channel;
  await consumerReviewFanoutMessages(orderChannel);
};

const startElasticSearch = (): void => {
  checkConnection();
};

const orderErrorHandler = (app: Application): void => {
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    log.log('error', `OrderService ${error.comingFrom}:`, error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
};

const startServer = async (app: Application): Promise<void> => {
  try {
    const httpServer: http.Server = new http.Server(app);
    const socketIO: Server = await createSocketIO(httpServer);
    startHttpServer(httpServer);
    socketIOOrderObject = socketIO;
  } catch (error) {
    log.log('error', 'OrderService startServer() method error:', error);
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

const startHttpServer = (httpServer: http.Server): void => {
  try {
    log.info(`Order server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Order server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'OrderService startHttpServer() method error:', error);
  }
};

export { start, orderChannel, socketIOOrderObject };
~~~
- src/config

~~~js
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config({});

if (process.env.ENABLE_APM === '1') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('elastic-apm-node').start({
    serviceName: 'jobber-order',
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
  public CLIENT_URL: string | undefined;
  public STRIPE_API_KEY: string | undefined;
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
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.STRIPE_API_KEY = process.env.STRIPE_API_KEY || '';
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

- .env

~~~
ENABLE_APM=0
DATABASE_URL=mongodb://127.0.0.1:27017/jobber-order
GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
NODE_ENV=development
AP_GATEWAY_URL=http://localhost:4000
CLIENT_URL=http://localhost:3000
RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@localhost:5672
STRIPE_API_KEY=
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
ELASTIC_SEARCH_URL=http://elastic:admin1234@localhost:9200
ELASTIC_APM_SERVER_URL=http://localhost:8200
ELASTIC_APM_SECRET_TOKEN=
~~~

## Gateway order controller and routes




- api-gateway/src/controller/order/create

~~~js
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { orderService } from '@gateway/services/api/order.service';

export class Create {
  public async intent(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.createOrderIntent(req.body.price, req.body.buyerId);
    res
      .status(StatusCodes.CREATED)
      .json({ message: response.data.message, clientSecret: response.data.clientSecret, paymentIntentId: response.data.paymentIntentId });
  }

  public async order(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.createOrder(req.body);
    res.status(StatusCodes.CREATED).json({ message: response.data.message, order: response.data.order });
  }
}
~~~

- get

~~~js
import { orderService } from '@gateway/services/api/order.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class Get {
  public async orderId(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.getOrderById(req.params.orderId);
    res.status(StatusCodes.OK).json({ message: response.data.message, order: response.data.order });
  }

  public async sellerOrders(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.sellerOrders(req.params.sellerId);
    res.status(StatusCodes.OK).json({ message: response.data.message, orders: response.data.orders });
  }

  public async buyerOrders(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.buyerOrders(req.params.buyerId);
    res.status(StatusCodes.OK).json({ message: response.data.message, orders: response.data.orders });
  }

  public async notifications(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.getNotifications(req.params.userTo);
    res.status(StatusCodes.OK).json({ message: response.data.message, notifications: response.data.notifications });
  }
}
~~~

- update

~~~js
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { orderService } from '@gateway/services/api/order.service';

export class Update {
  public async cancel(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const { orderData, paymentIntentId } = req.body;
    const response: AxiosResponse = await orderService.cancelOrder(paymentIntentId, orderId, orderData);
    res.status(StatusCodes.CREATED).json({ message: response.data.message });
  }

  public async requestExtension(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const response: AxiosResponse = await orderService.requestDeliveryDateExtension(orderId, req.body);
    res.status(StatusCodes.OK).json({ message: response.data.message, order: response.data.order });
  }

  public async deliveryDate(req: Request, res: Response): Promise<void> {
    const { orderId, type } = req.params;
    const response: AxiosResponse = await orderService.updateDeliveryDate(orderId, type, req.body);
    res.status(StatusCodes.OK).json({ message: response.data.message, order: response.data.order });
  }

  public async deliverOrder(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const response: AxiosResponse = await orderService.deliverOrder(orderId, req.body);
    res.status(StatusCodes.OK).json({ message: response.data.message, order: response.data.order });
  }

  public async approveOrder(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const response: AxiosResponse = await orderService.approveOrder(orderId, req.body);
    res.status(StatusCodes.OK).json({ message: response.data.message, order: response.data.order });
  }

  public async markNotificationAsRead(req: Request, res: Response): Promise<void> {
    const { notificationId } = req.body;
    const response: AxiosResponse = await orderService.markNotificationAsRead(notificationId);
    res.status(StatusCodes.OK).json({ message: response.data.message, notification: response.data.notification });
  }
}
~~~

- api-gateway/src/routes/order.routes.ts

~~~js
import { Create } from '@gateway/controllers/order/create';
import { Get } from '@gateway/controllers/order/get';
import { Update } from '@gateway/controllers/order/update';
import express, { Router } from 'express';

class OrderRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/order/notification/:userTo', Get.prototype.notifications);
    this.router.get('/order/:orderId', Get.prototype.orderId);
    this.router.get('/order/seller/:sellerId', Get.prototype.sellerOrders);
    this.router.get('/order/buyer/:buyerId', Get.prototype.buyerOrders);
    this.router.post('/order', Create.prototype.order);
    this.router.post('/order/create-payment-intent', Create.prototype.intent);
    this.router.put('/order/cancel/:orderId', Update.prototype.cancel);
    this.router.put('/order/extension/:orderId', Update.prototype.requestExtension);
    this.router.put('/order/deliver-order/:orderId', Update.prototype.deliverOrder);
    this.router.put('/order/approve-order/:orderId', Update.prototype.approveOrder);
    this.router.put('/order/gig/:type/:orderId', Update.prototype.deliveryDate);
    this.router.put('/order/notification/mark-as-read', Update.prototype.markNotificationAsRead);

    return this.router;
  }
}

export const orderRoutes: OrderRoutes = new OrderRoutes();
~~~

- src/routes

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
  app.use(BASE_PATH, authRoutes.routes());
  app.use(BASE_PATH, searchRoutes.routes());

  app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, buyerRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, sellerRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, gigRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, messageRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, orderRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, reviewRoutes.routes());
};
~~~

