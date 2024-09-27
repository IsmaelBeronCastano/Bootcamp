# 08 NODE REACT MICROSERVICIOS - GIG SERVICE

- Gig service será el responsable de administrar los gigs de los sellers (vendedores)
- Los gigs creados por los vendedores (sellers) serán administrados desde aqui
- Tendremos la feature de buscar, además del CRUD
----

## Routing


- Para el routing

~~~js
import { gigCreate } from '@gig/controllers/create';
import { gigDelete } from '@gig/controllers/delete';
import { gigById, gigsByCategory, moreLikeThis, sellerGigs, sellerInactiveGigs, topRatedGigsByCategory } from '@gig/controllers/get';
import { gigs } from '@gig/controllers/search';
import { gig } from '@gig/controllers/seed';
import { gigUpdate, gigUpdateActive } from '@gig/controllers/update';
import express, { Router } from 'express';

const router: Router = express.Router();

const gigRoutes = (): Router => {
  router.get('/:gigId', gigById);
  router.get('/seller/:sellerId', sellerGigs);
  router.get('/seller/pause/:sellerId', sellerInactiveGigs);
  router.get('/search/:from/:size/:type', gigs);
  router.get('/category/:username', gigsByCategory);
  router.get('/top/:username', topRatedGigsByCategory);
  router.get('/similar/:gigId', moreLikeThis);
  router.post('/create', gigCreate);
  router.put('/:gigId', gigUpdate);
  router.put('/active/:gigId', gigUpdateActive);
  router.put('/seed/:count', gig);
  router.delete('/:gigId/:sellerId', gigDelete);

  return router;
};

export { gigRoutes };
~~~

- En gig-ms/src/routes

~~~js
import { verifyGatewayRequest } from '@uzochukwueddie/jobber-shared';
import { Application } from 'express';
import { gigRoutes } from '@gig/routes/gig';
import { healthRoutes } from '@gig/routes/health';

const BASE_PATH = '/api/v1/gig';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BASE_PATH, verifyGatewayRequest,  gigRoutes());
};

export { appRoutes };
~~~

## Server

- Para el server tenemos lo mismo

~~~js
import http from 'http';

import 'express-async-errors';
import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@gig/config';
import { Application, Request, Response, NextFunction, json, urlencoded } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';
import { checkConnection, createIndex } from '@gig/elasticsearch';
import { appRoutes } from '@gig/routes';
import { createConnection } from '@gig/queues/connection';
import { Channel } from 'amqplib';
import { consumeGigDirectMessage, consumeSeedDirectMessages } from '@gig/queues/gig.consumer';

const SERVER_PORT = 4004;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigServer', 'debug');
let gigChannel: Channel;

const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  gigErrorHandler(app);
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
  gigChannel = await createConnection() as Channel;
  await consumeGigDirectMessage(gigChannel);
  await consumeSeedDirectMessages(gigChannel);
};

const startElasticSearch = (): void => {
  checkConnection();
  createIndex('gigs');
};

const gigErrorHandler = (app: Application): void => {
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    log.log('error', `GigService ${error.comingFrom}:`, error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
};

const startServer = (app: Application): void => {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Gig server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Gig server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'GigService startServer() method error:', error);
  }
};

export { start, gigChannel };
~~~


- Llamo a la función de checkConnection y createIndex en el server

~~~js
const startElasticSearch = (): void => {
  checkConnection();
  createIndex('gigs');
};
~~~

## Controllers

- Tendremos controllers en archivos separados porque tienen mucho código
- create, delete, get, health, search, seed, update
- Las interfaces de gig

~~~js
import { ObjectId } from "mongoose";
import { IRatingCategories, IReviewDocument } from "./review.interface";
import { ISellerDocument } from "./seller.interface";

export type GigType =
  | string
  | string[]
  | number
  | unknown
  | undefined;

export interface ICreateGig extends Record<string, GigType> {
  // [key: string]: string | string[] | number | undefined;
  sellerId?: string;
  profilePicture?: string;
  title: string;
  categories: string;
  description: string;
  subCategories: string[];
  tags: string[];
  price: number;
  coverImage: string;
  expectedDelivery: string;
  basicTitle: string;
  basicDescription: string;
}

export interface ISellerGig {
  _id?: string | ObjectId;
  // this "id" property is used because elastcisearch does not accept a key with an underscore "_id"
  // elasticsearch has _id as a reserved field name
  id?: string | ObjectId;
  sellerId?: string | ObjectId;
  title: string;
  username?: string;
  profilePicture?: string;
  email?: string;
  description: string;
  active?: boolean;
  categories: string;
  subCategories: string[];
  tags: string[];
  ratingsCount?: number; // make sure to add this to elasticsearch as a double
  ratingSum?: number; // make sure to add this to elasticsearch as a double
  ratingCategories?: IRatingCategories;
  expectedDelivery: string;
  basicTitle: string;
  basicDescription: string;
  price: number;
  coverImage: string;
  createdAt?: Date | string;
  sortId?: number;
  // this is added here because we will use the json format of the document
  // at some point instead of the Mongoose document
  // the json object which will contain the virtual field "id" without the field "_id" will be added to elasticsearch
  // because "_id" is a reserved field name in elasticsearch.
  toJSON?: () => unknown;
}

export interface IGigContext {
  gig: ISellerGig;
  seller: ISellerDocument;
  isSuccess?: boolean;
  isLoading?: boolean;
}

export interface IGigsProps {
  type?: string;
  gig?: ISellerGig;
}

export interface IGigCardItems {
  gig: ISellerGig;
  linkTarget: boolean;
  showEditIcon: boolean;
}

export interface ISelectedBudget {
  minPrice: string;
  maxPrice: string;
}

export interface IGigViewReviewsProps {
  showRatings: boolean;
  reviews?: IReviewDocument[];
}

export interface IGigInfo {
  total: number | string;
  title: string;
  bgColor: string;
}

export interface IGigTopProps {
  gigs: ISellerGig[];
  title?: string;
  subTitle?: string;
  category?: string;
  width: string;
  type: string;
}

~~~

- Veamos el modelo de gig con mongoose
- gig-ms/src/models/gig.model.ts

~~~js
import { ISellerGig } from '@uzochukwueddie/jobber-shared';
import mongoose, { Model, Schema, model } from 'mongoose';

const gigSchema: Schema = new Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, index: true },
    username: { type: String, required: true },
    profilePicture: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    basicTitle: { type: String, required: true },
    basicDescription: { type: String, required: true },
    categories: { type: String, required: true },
    subCategories: [{ type: String, required: true }],
    tags: [{ type: String }],
    active: { type: Boolean, default: true },
    expectedDelivery: { type: String, default: '' },
    ratingsCount: { type: Number, default: 0 },
    ratingSum: { type: Number, default: 0 },
    ratingCategories: {
      five: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 }},
      four: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 }},
      three: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 }},
      two: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 }},
      one: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 }},
    },
    price: { type: Number, default: 0 },
    sortId: { type: Number },
    coverImage: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    toJSON: { //para no usar el _id
      transform(_doc, rec) { //doc es un objeto de mongoose, con mi data
        rec.id = rec._id;    //rec es el objeto puro JSON, lo que necesito cambiar
        delete rec._id;
        return rec;
      }
    }
  }
);

gigSchema.virtual('id').get(function() { //ahora tendré mi id
  return this._id;
});

const GigModel: Model<ISellerGig> = model<ISellerGig>('Gig', gigSchema, 'Gig');
export { GigModel };
~~~

- La validación del modelo

~~~js
import Joi, { ObjectSchema } from 'joi';

const gigCreateSchema: ObjectSchema = Joi.object().keys({
  sellerId: Joi.string().required().messages({
    'string.base': 'Seller Id must be of type string',
    'string.empty': 'Seller Id is required',
    'any.required': 'Seller Id is required'
  }),
  profilePicture: Joi.string().required().messages({
    'string.base': 'Please add a profile picture',
    'string.empty': 'Profile picture is required',
    'any.required': 'Profile picture is required'
  }),
  title: Joi.string().required().messages({
    'string.base': 'Please add a gig title',
    'string.empty': 'Gig title is required',
    'any.required': 'Gig title is required'
  }),
  description: Joi.string().required().messages({
    'string.base': 'Please add a gig description',
    'string.empty': 'Gig description is required',
    'any.required': 'Gig description is required'
  }),
  categories: Joi.string().required().messages({
    'string.base': 'Please select a category',
    'string.empty': 'Gig category is required',
    'any.required': 'Gig category is required'
  }),
  subCategories: Joi.array().items(Joi.string()).required().min(1).messages({
    'string.base': 'Please add at least one subcategory',
    'string.empty': 'Gig subcategories are required',
    'any.required': 'Gig subcategories are required',
    'array.min': 'Please add at least one subcategory'
  }),
  tags: Joi.array().items(Joi.string()).required().min(1).messages({
    'string.base': 'Please add at least one tag',
    'string.empty': 'Gig tags are required',
    'any.required': 'Gig tags are required',
    'array.min': 'Please add at least one tag'
  }),
  price: Joi.number().required().greater(4.99).messages({
    'string.base': 'Please add a gig price',
    'string.empty': 'Gig price is required',
    'any.required': 'Gig price is required',
    'number.greater': 'Gig price must be greater than $4.99'
  }),
  coverImage: Joi.string().required().messages({
    'string.base': 'Please add a cover image',
    'string.empty': 'Gig cover image is required',
    'any.required': 'Gig cover image is required',
    'array.min': 'Please add a cover image'
  }),
  expectedDelivery: Joi.string().required().messages({
    'string.base': 'Please add expected delivery',
    'string.empty': 'Gig expected delivery is required',
    'any.required': 'Gig expected delivery is required',
    'array.min': 'Please add a expected delivery'
  }),
  basicTitle: Joi.string().required().messages({
    'string.base': 'Please add basic title',
    'string.empty': 'Gig basic title is required',
    'any.required': 'Gig basic title is required',
    'array.min': 'Please add a basic title'
  }),
  basicDescription: Joi.string().required().messages({
    'string.base': 'Please add basic description',
    'string.empty': 'Gig basic description is required',
    'any.required': 'Gig basic description is required',
    'array.min': 'Please add a basic description'
  })
});

const gigUpdateSchema: ObjectSchema = Joi.object().keys({
  title: Joi.string().required().messages({
    'string.base': 'Please add a gig title',
    'string.empty': 'Gig title is required',
    'any.required': 'Gig title is required'
  }),
  description: Joi.string().required().messages({
    'string.base': 'Please add a gig description',
    'string.empty': 'Gig description is required',
    'any.required': 'Gig description is required'
  }),
  categories: Joi.string().required().messages({
    'string.base': 'Please select a category',
    'string.empty': 'Gig category is required',
    'any.required': 'Gig category is required'
  }),
  subCategories: Joi.array().items(Joi.string()).required().min(1).messages({
    'string.base': 'Please add at least one subcategory',
    'string.empty': 'Gig subcategories are required',
    'any.required': 'Gig subcategories are required',
    'array.min': 'Please add at least one subcategory'
  }),
  tags: Joi.array().items(Joi.string()).required().min(1).messages({
    'string.base': 'Please add at least one tag',
    'string.empty': 'Gig tags are required',
    'any.required': 'Gig tags are required',
    'array.min': 'Please add at least one tag'
  }),
  price: Joi.number().required().greater(4.99).messages({
    'string.base': 'Please add a gig price',
    'string.empty': 'Gig price is required',
    'any.required': 'Gig price is required',
    'number.greater': 'Gig price must be greater than $4.99'
  }),
  coverImage: Joi.string().required().messages({
    'string.base': 'Please add a cover image',
    'string.empty': 'Gig cover image is required',
    'any.required': 'Gig cover image is required',
    'array.min': 'Please add a cover image'
  }),
  expectedDelivery: Joi.string().required().messages({
    'string.base': 'Please add expected delivery',
    'string.empty': 'Gig expected delivery is required',
    'any.required': 'Gig expected delivery is required',
    'array.min': 'Please add a expected delivery'
  }),
  basicTitle: Joi.string().required().messages({
    'string.base': 'Please add basic title',
    'string.empty': 'Gig basic title is required',
    'any.required': 'Gig basic title is required',
    'array.min': 'Please add a basic title'
  }),
  basicDescription: Joi.string().required().messages({
    'string.base': 'Please add basic description',
    'string.empty': 'Gig basic description is required',
    'any.required': 'Gig basic description is required',
    'array.min': 'Please add a basic description'
  })
});

export { gigCreateSchema, gigUpdateSchema };
~~~

## ElasticSearch

- Para elasticSearch tenemos el mismo archivo en gig-ms/src/elasticsearch.ts
- La data siempre está en ._source

~~~js
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse, CountResponse, GetResponse } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@gig/config';
import { ISellerGig, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});
            //la invoco en el server
const checkConnection = async (): Promise<void> => {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`GigService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.log('error', 'GigService checkConnection() method:', error);
    }
  }
};

async function checkIfIndexExist(indexName: string): Promise<boolean> {
  const result: boolean = await elasticSearchClient.indices.exists({ index: indexName });
  return result;
}

//esta función será llamada en el server
async function createIndex(indexName: string): Promise<void> {
  try {
    const result: boolean = await checkIfIndexExist(indexName);
    if (result) {
      log.info(`Index "${indexName}" already exist.`);
    } else {
    //creo el index y hago un refresh 
    //desde que se crea un index, todo documento adherido será buscable
      await elasticSearchClient.indices.create({ index: indexName });
      await elasticSearchClient.indices.refresh({ index: indexName });
      log.info(`Created index ${indexName}`);
    }
  } catch (error) {
    log.error(`An error occurred while creating the index ${indexName}`);
    log.log('error', 'GigService createIndex() method error:', error);
  }
}

const getDocumentCount = async (index: string): Promise<number> => {
  try {
    const result: CountResponse = await elasticSearchClient.count({ index });
    return result.count;
  } catch (error) {
    log.log('error', 'GigService elasticsearch getDocumentCount() method error:', error);
    return 0;
  }
};

    //guardo en result la data
const getIndexedData = async (index: string, itemId: string): Promise<ISellerGig> => {
  try {                                                             //id de tipo itemId               
    const result: GetResponse = await elasticSearchClient.get({ index, id: itemId });
                //la data siempre está en _source
    return result._source as ISellerGig;
  } catch (error) {
    log.log('error', 'GigService elasticsearch getIndexedData() method error:', error);
    return {} as ISellerGig; //en caso de error retorno un objeto vacio como ISellerGig
  }
};

const addDataToIndex = async (index: string, itemId: string, gigDocument: unknown): Promise<void> => {
  try {
    await elasticSearchClient.index({
      index,
      id: itemId,
      document: gigDocument //para añadir la data usaremos document 
    });
  } catch (error) {
    log.log('error', 'GigService elasticsearch addDataToIndex() method error:', error);
  }
};

const updateIndexedData = async (index: string, itemId: string, gigDocument: unknown): Promise<void> => {
  try {
    await elasticSearchClient.update({
      index,
      id: itemId,
      doc: gigDocument //para documentos con el update usaremos doc
    });
  } catch (error) {
    log.log('error', 'GigService elasticsearch updateIndexedData() method error:', error);
  }
};

const deleteIndexedData = async (index: string, itemId: string): Promise<void> => {
  try {
    await elasticSearchClient.delete({
      index,
      id: itemId
    });
  } catch (error) {
    log.log('error', 'GigService elasticsearch deleteIndexedData() method error:', error);
  }
};

export {
  elasticSearchClient, //exporto el cliente!
  checkConnection,
  createIndex,
  getDocumentCount,
  getIndexedData,
  addDataToIndex,
  updateIndexedData,
  deleteIndexedData
};
~~~

- También se pueden hacer consultas con SQL

~~~js
client.sql.query({
    query: "SELECT * FROM ..."
})
~~~

- Estos son los métodos que necesitamos para realizar operaciones dentro de un index en ElasticSearch
- Ahora el servicio de gig (completo)
- gig-ms/src/services/gig.service.ts
- Obtendremos la data desde elasticSearch

~~~js
import { addDataToIndex, deleteIndexedData, getIndexedData, updateIndexedData } from '@gig/elasticsearch';
import { IRatingTypes, IReviewMessageDetails, ISellerDocument, ISellerGig } from '@uzochukwueddie/jobber-shared';
import { gigsSearchBySellerId } from '@gig/services/search.service';
import { GigModel } from '@gig/models/gig.schema';
import { publishDirectMessage } from '@gig/queues/gig.producer';
import { gigChannel } from '@gig/server';
import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

const getGigById = async (gigId: string): Promise<ISellerGig> => {
  const gig: ISellerGig = await getIndexedData('gigs', gigId);
  return gig;
};

const getSellerGigs = async (sellerId: string): Promise<ISellerGig[]> => {
  const resultsHits: ISellerGig[] = [];
  const gigs = await gigsSearchBySellerId(sellerId, true);
  for(const item of gigs.hits) {
    resultsHits.push(item._source as ISellerGig);
  }
  return resultsHits;
};

const getSellerPausedGigs = async (sellerId: string): Promise<ISellerGig[]> => {
  const resultsHits: ISellerGig[] = [];
  const gigs = await gigsSearchBySellerId(sellerId, false);
  for(const item of gigs.hits) {
    resultsHits.push(item._source as ISellerGig);
  }
  return resultsHits;
};

const createGig = async (gig: ISellerGig): Promise<ISellerGig> => {
  const createdGig: ISellerGig = await GigModel.create(gig);
  if (createdGig) {
                      //No queremos el _id de mongo, uso el método toJSON del schema
    const data: ISellerGig = createdGig.toJSON?.() as ISellerGig;
    
    await publishDirectMessage(
      gigChannel,
      'jobber-seller-update', //consumer= consumeSellerDirectMessage
      'user-seller',      //lo pasamos como un string con stringify
      JSON.stringify({ type: 'update-gig-count', gigSellerId: `${data.sellerId}`, count: 1 }),
      'Details sent to users service.'
    );      //elasticSearch method    //podría usar data.id
    await addDataToIndex('gigs', `${createdGig._id}`, data);
  }
  return createdGig;
};

const deleteGig = async (gigId: string, sellerId: string): Promise<void> => {
  await GigModel.deleteOne({ _id: gigId }).exec();

  await publishDirectMessage(
    gigChannel,
    'jobber-seller-update',
    'user-seller',
    JSON.stringify({ type: 'update-gig-count', gigSellerId: sellerId, count: -1 }),
    'Details sent to users service.'
  );
  await deleteIndexedData('gigs', `${gigId}`);//elasticSearch
};

const updateGig = async (gigId: string, gigData: ISellerGig): Promise<ISellerGig> => {
  const document: ISellerGig = await GigModel.findOneAndUpdate(
    { _id: gigId },
    {
      $set: {
        title: gigData.title,
        description: gigData.description,
        categories: gigData.categories,
        subCategories: gigData.subCategories,
        tags: gigData.tags,
        price: gigData.price,
        coverImage: gigData.coverImage,
        expectedDelivery: gigData.expectedDelivery,
        basicTitle: gigData.basicTitle,
        basicDescription: gigData.basicDescription
      }
    },
    { new: true }
  ).exec() as ISellerGig;
  if (document) {
    const data: ISellerGig = document.toJSON?.() as ISellerGig;
    await updateIndexedData('gigs', `${document._id}`, data);
  }
  return document;
};

//le paso el id y modifico active
const updateActiveGigProp = async (gigId: string, gigActive: boolean): Promise<ISellerGig> => {
  const document: ISellerGig = await GigModel.findOneAndUpdate(
    { _id: gigId },
    {
      $set: { //para actualizar un campo uso $set
        active: gigActive
      }
    },
    { new: true } //para que me lo devuelva actualizado
  ).exec() as ISellerGig;
  if (document) {
    const data: ISellerGig = document.toJSON?.() as ISellerGig;
    await updateIndexedData('gigs', `${document._id}`, data);
  }
  return document;
};

const updateGigReview = async (data: IReviewMessageDetails): Promise<void> => {
  const ratingTypes: IRatingTypes = {
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
  };
  const ratingKey: string = ratingTypes[`${data.rating}`];
  const gig = await GigModel.findOneAndUpdate(
    { _id: data.gigId },
    {
      $inc: { //inc de increment
        ratingsCount: 1,
        ratingSum: data.rating,
        [`ratingCategories.${ratingKey}.value`]: data.rating,
        [`ratingCategories.${ratingKey}.count`]: 1,
      }
    },
    { new: true, upsert: true }
  ).exec();
  if (gig) {
    const data: ISellerGig = gig.toJSON?.() as ISellerGig;
    await updateIndexedData('gigs', `${gig._id}`, data);
  }
};

const seedData = async (sellers: ISellerDocument[], count: string): Promise<void> => {
  const categories: string[] = [
    'Graphics & Design',
    'Digital Marketing',
    'Writing & Translation',
    'Video & Animation',
    'Music & Audio',
    'Programming & Tech',
    'Data',
    'Business'
  ];
  const expectedDelivery: string[] = [
    '1 Day Delivery',
    '2 Days Delivery',
    '3 Days Delivery',
    '4 Days Delivery',
    '5 Days Delivery',
  ];
  const randomRatings = [
    { sum: 20, count: 4 },
    { sum: 10, count: 2 },
    { sum: 20, count: 4 },
    { sum: 15, count: 3 },
    { sum: 5, count: 1 },
  ];

  for(let i = 0; i < sellers.length; i++) {
    const sellerDoc: ISellerDocument = sellers[i];
    const title = `I will ${faker.word.words(5)}`;
    const basicTitle = faker.commerce.productName();
    const basicDescription = faker.commerce.productDescription();
    const rating = sample(randomRatings);
    const gig: ISellerGig = {
      profilePicture: sellerDoc.profilePicture,
      sellerId: sellerDoc._id,
      email: sellerDoc.email,
      username: sellerDoc.username,
      title: title.length <= 80 ? title : title.slice(0, 80),
      basicTitle: basicTitle.length <= 40 ? basicTitle : basicTitle.slice(0, 40),
      basicDescription: basicDescription.length <= 100 ? basicDescription : basicDescription.slice(0, 100),
      categories: `${sample(categories)}`,
      subCategories: [faker.commerce.department(), faker.commerce.department(), faker.commerce.department()],
      description: faker.lorem.sentences({ min: 2, max: 4 }),
      tags: [faker.commerce.product(), faker.commerce.product(), faker.commerce.product(), faker.commerce.product()],
      price: parseInt(faker.commerce.price({ min: 20, max: 30, dec: 0 })),
      coverImage: faker.image.urlPicsumPhotos(),
      expectedDelivery: `${sample(expectedDelivery)}`,
      sortId: parseInt(count, 10) + i + 1,
      ratingsCount: (i + 1) % 4 === 0 ? rating!['count'] : 0,
      ratingSum: (i + 1) % 4 === 0 ? rating!['sum'] : 0,
    };
    console.log(`***SEEDING GIG*** - ${i + 1} of ${count}`);
    await createGig(gig);
  }
};

export {
  getGigById,
  getSellerGigs,
  getSellerPausedGigs,
  createGig,
  deleteGig,
  updateGig,
  updateActiveGigProp,
  updateGigReview,
  seedData
};
~~~

- Vemaos el users-ms/src/queues/user.consumer

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
      if (type === 'auth') {
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
        await updateBuyerPurchasedGigsProp(buyerId, purchasedGigs, type);
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'UsersService UserConsumer consumeBuyerDirectMessage() method error:', error);
  }
};

//este es el consumer para createGig
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

- El gig/src/queues/gig.consumer.ts (el producer es el mismo que en los casos anteriores)

~~~js
import { config } from '@gig/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Channel, ConsumeMessage, Replies } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@gig/queues/connection';
import { seedData, updateGigReview } from '@gig/services/gig.service';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigServiceConsumer', 'debug');

const consumeGigDirectMessage = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'jobber-update-gig';
    const routingKey = 'update-gig';
    const queueName = 'gig-update-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const { gigReview } = JSON.parse(msg!.content.toString());
      await updateGigReview(JSON.parse(gigReview));
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'GigService GigConsumer consumeGigDirectMessage() method error:', error);
  }
};

const consumeSeedDirectMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'jobber-seed-gig';
    const routingKey = 'receive-sellers';
    const queueName = 'seed-gig-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const { sellers, count } = JSON.parse(msg!.content.toString());
      await seedData(sellers, count);
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'GigService GigConsumer consumeGigDirectMessage() method error:', error);
  }
};

export { consumeGigDirectMessage, consumeSeedDirectMessages };
~~~

- Paso el resto de controllers
- get

~~~js
import { getUserSelectedGigCategory } from '@gig/redis/gig.cache';
import { getGigById, getSellerGigs, getSellerPausedGigs } from '@gig/services/gig.service';
import { getMoreGigsLikeThis, getTopRatedGigsByCategory, gigsSearchByCategory } from '@gig/services/search.service';
import { ISearchResult, ISellerGig } from '@uzochukwueddie/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const gigById = async (req: Request, res: Response): Promise<void> => {
  const gig: ISellerGig = await getGigById(req.params.gigId);
  res.status(StatusCodes.OK).json({ message: 'Get gig by id', gig });
};

const sellerGigs = async (req: Request, res: Response): Promise<void> => {
  const gigs: ISellerGig[] = await getSellerGigs(req.params.sellerId);
  res.status(StatusCodes.OK).json({ message: 'Seller gigs', gigs });
};

const sellerInactiveGigs = async (req: Request, res: Response): Promise<void> => {
  const gigs: ISellerGig[] = await getSellerPausedGigs(req.params.sellerId);
  res.status(StatusCodes.OK).json({ message: 'Seller gigs', gigs });
};

const topRatedGigsByCategory = async (req: Request, res: Response): Promise<void> => {
  const category = await getUserSelectedGigCategory(`selectedCategories:${req.params.username}`);
  const resultHits: ISellerGig[] = [];
  const gigs: ISearchResult = await getTopRatedGigsByCategory(`${category}`);
  for(const item of gigs.hits) {
    resultHits.push(item._source as ISellerGig);
  }
  res.status(StatusCodes.OK).json({ message: 'Search top gigs results', total: gigs.total, gigs: resultHits });
};

const gigsByCategory = async (req: Request, res: Response): Promise<void> => {
  const category = await getUserSelectedGigCategory(`selectedCategories:${req.params.username}`);
  const resultHits: ISellerGig[] = [];
  const gigs: ISearchResult = await gigsSearchByCategory(`${category}`);
  for(const item of gigs.hits) {
    resultHits.push(item._source as ISellerGig);
  }
  res.status(StatusCodes.OK).json({ message: 'Search gigs category results', total: gigs.total, gigs: resultHits });
};

const moreLikeThis = async (req: Request, res: Response): Promise<void> => {
  const resultHits: ISellerGig[] = [];
  const gigs: ISearchResult = await getMoreGigsLikeThis(req.params.gigId);
  for(const item of gigs.hits) {
    resultHits.push(item._source as ISellerGig);
  }
  res.status(StatusCodes.OK).json({ message: 'More gigs like this result', total: gigs.total, gigs: resultHits });
};

export { gigById, sellerGigs, sellerInactiveGigs, topRatedGigsByCategory, gigsByCategory, moreLikeThis };
~~~

- update

~~~js
import { gigUpdateSchema } from '@gig/schemes/gig';
import { updateActiveGigProp, updateGig } from '@gig/services/gig.service';
import { BadRequestError, ISellerGig, isDataURL, uploads } from '@uzochukwueddie/jobber-shared';
import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const gigUpdate = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(gigUpdateSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Update gig() method');
  }
  const isDataUrl = isDataURL(req.body.coverImage);
  let coverImage = '';
  if (isDataUrl) {
    const result: UploadApiResponse = await uploads(req.body.coverImage) as UploadApiResponse;
    if (!result.public_id) {
      throw new BadRequestError('File upload error. Try again.', 'Update gig() method');
    }
    coverImage = result?.secure_url;
  } else {
    coverImage = req.body.coverImage;
  }
  const gig: ISellerGig = {
    title: req.body.title,
    description: req.body.description,
    categories: req.body.categories,
    subCategories: req.body.subCategories,
    tags: req.body.tags,
    price: req.body.price,
    expectedDelivery: req.body.expectedDelivery,
    basicTitle: req.body.basicTitle,
    basicDescription: req.body.basicDescription,
    coverImage
  };
  const updatedGig: ISellerGig = await updateGig(req.params.gigId, gig);
  res.status(StatusCodes.OK).json({ message: 'Gig updated successfully.', gig: updatedGig });
};

const gigUpdateActive = async (req: Request, res: Response): Promise<void> => {
  const updatedGig: ISellerGig = await updateActiveGigProp(req.params.gigId, req.body.active);
  res.status(StatusCodes.OK).json({ message: 'Gig updated successfully.', gig: updatedGig });
};

export { gigUpdate, gigUpdateActive };
~~~

- delete

~~~js
import { deleteGig } from '@gig/services/gig.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const gigDelete = async (req: Request, res: Response): Promise<void> => {
  await deleteGig(req.params.gigId, req.params.sellerId);
  res.status(StatusCodes.OK).json({ message: 'Gig deleted successfully.' });
};

export { gigDelete };
~~~

- search

~~~js

import { gigsSearch } from '@gig/services/search.service';
import { IPaginateProps, ISearchResult, ISellerGig } from '@uzochukwueddie/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sortBy } from 'lodash';

const gigs = async (req: Request, res: Response): Promise<void> => {
  const { from, size, type } = req.params;
  let resultHits: ISellerGig[] = [];
  const paginate: IPaginateProps = { from, size: parseInt(`${size}`), type };
  const gigs: ISearchResult = await gigsSearch(
    `${req.query.query}`,
    paginate,
    `${req.query.delivery_time}`,
    parseInt(`${req.query.minprice}`),
    parseInt(`${req.query.maxprice}`),
  );
  for(const item of gigs.hits) {
    resultHits.push(item._source as ISellerGig);
  }
  if (type === 'backward') {
    resultHits = sortBy(resultHits, ['sortId']);
  }
  res.status(StatusCodes.OK).json({ message: 'Search gigs results', total: gigs.total, gigs: resultHits });
};

export { gigs };
~~~

- seed

~~~js
import { publishDirectMessage } from '@gig/queues/gig.producer';
import { gigChannel } from '@gig/server';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const gig = async (req: Request, res: Response): Promise<void> => {
  const { count } = req.params;
  await publishDirectMessage(
    gigChannel,
    'jobber-gig',
    'get-sellers',
    JSON.stringify({ type: 'getSellers', count }),
    'Gig seed message sent to user service.'
  );
  res.status(StatusCodes.CREATED).json({ message: 'Gig created successfully'});
};

export { gig };

~~~

- La rabbitMQ connection es la misma
- gig-ms/src/queues/connection.ts

~~~js
import { config } from '@gig/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigQueueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Gig server connected to queue successfully...');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'GigService createConnection() method error:', error);
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

- El gig.producer es el mismo también
- gig-ms/src/queues/gig.producer

~~~js
import { config } from '@gig/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@gig/queues/connection';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigServiceProducer', 'debug');

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
    log.log('error', 'GigService publishDirectMessage() method error:', error);
  }
};

export { publishDirectMessage };
~~~

- El gig.consumer
- gig-ms/src/queues/gig.consumer.ts

~~~js
import { config } from '@gig/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Channel, ConsumeMessage, Replies } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@gig/queues/connection';
import { seedData, updateGigReview } from '@gig/services/gig.service';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigServiceConsumer', 'debug');

const consumeGigDirectMessage = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'jobber-update-gig';
    const routingKey = 'update-gig';
    const queueName = 'gig-update-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const { gigReview } = JSON.parse(msg!.content.toString());
      await updateGigReview(JSON.parse(gigReview));
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'GigService GigConsumer consumeGigDirectMessage() method error:', error);
  }
};

const consumeSeedDirectMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'jobber-seed-gig';
    const routingKey = 'receive-sellers';
    const queueName = 'seed-gig-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const { sellers, count } = JSON.parse(msg!.content.toString());
      await seedData(sellers, count);
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'GigService GigConsumer consumeGigDirectMessage() method error:', error);
  }
};

export { consumeGigDirectMessage, consumeSeedDirectMessages };
~~~

- En el server tengo los dos consumers escuchando

~~~js
const startQueues = async (): Promise<void> => {
  gigChannel = await createConnection() as Channel;
  await consumeGigDirectMessage(gigChannel);
  await consumeSeedDirectMessages(gigChannel);
};
~~~
------

## Create Reddis Connection

- 


