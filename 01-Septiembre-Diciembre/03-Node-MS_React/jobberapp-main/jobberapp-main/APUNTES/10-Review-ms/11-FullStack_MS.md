# FULL STACK MICROSERVICES - REVIEW-MS

## Postgres database

- reviews-ms/src/database

~~~js
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@review/config';
import { Pool } from 'pg';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'reviewDatabaseServer', 'debug');

const pool: Pool = new Pool({
  host: `${config.DATABASE_HOST}`,
  user: `${config.DATABASE_USER}`,
  password: `${config.DATABASE_PASSWORD}`,
  port: 5432,
  database: `${config.DATABASE_NAME}`,
  ...(config.NODE_ENV !== 'development' && config.CLUSTER_TYPE === 'AWS' && {
    ssl: {
      rejectUnauthorized: false
    }
  })
});

pool.on('error', (error: Error) => {
  log.log('error', 'pg client error', error);
  process.exit(-1);
});

const createTableText = `
  CREATE TABLE IF NOT EXISTS public.reviews (
    id SERIAL UNIQUE,
    gigId text NOT NULL,
    reviewerId text NOT NULL,
    orderId text NOT NULL,
    sellerId text NOT NULL,
    review text NOT NULL,
    reviewerImage text NOT NULL,
    reviewerUsername text NOT NULL,
    country text NOT NULL,
    reviewType text NOT NULL,
    rating integer DEFAULT 0 NOT NULL,
    createdAt timestamp DEFAULT CURRENT_DATE,
    PRIMARY KEY (id)
  );

  CREATE INDEX IF NOT EXISTS gigId_idx ON public.reviews (gigId);

  CREATE INDEX IF NOT EXISTS sellerId_idx ON public.reviews (sellerId);
`;

const databaseConnection = async (): Promise<void> => {
  try {
    await pool.connect();
    log.info('Review service successfully connected to postgresql database.');
    await pool.query(createTableText);
  } catch (error) {
    log.error('ReviewService - Unable to connecto to database');
    log.log('error', 'ReviewService () method error:', error);
  }
};

export { databaseConnection, pool };
~~~

- controller/get

~~~js
import { getReviewsByGigId, getReviewsBySellerId } from '@review/services/review.service';
import { IReviewDocument } from '@uzochukwueddie/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const reviewsByGigId = async (req: Request, res: Response): Promise<void> => {
  const reviews: IReviewDocument[] = await getReviewsByGigId(req.params.gigId);
  res.status(StatusCodes.OK).json({ message: 'Gig reviews by gig id', reviews });
};

export const reviewsBySellerId = async (req: Request, res: Response): Promise<void> => {
  const reviews: IReviewDocument[] = await getReviewsBySellerId(req.params.sellerId);
  res.status(StatusCodes.OK).json({ message: 'Gig reviews by seller id', reviews });
};
~~~

- controller/create

~~~js
import { addReview } from '@review/services/review.service';
import { IReviewDocument } from '@uzochukwueddie/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const review = async (req: Request, res: Response): Promise<void> => {
  const review: IReviewDocument = await addReview(req.body);
  res.status(StatusCodes.CREATED).json({ message: 'Review created successfully.', review });
};
~~~

- services/review.service

~~~js
import { pool } from '@review/database';
import { publishFanoutMessage } from '@review/queues/review.producer';
import { reviewChannel } from '@review/server';
import { IReviewDocument, IReviewMessageDetails } from '@uzochukwueddie/jobber-shared';
import { map } from 'lodash';
import { QueryResult } from 'pg';

interface IReviewerObjectKeys {
  [key: string]: string | number | Date | undefined;
}

const objKeys: IReviewerObjectKeys = {
  review: 'review',
  rating: 'rating',
  country: 'country',
  gigid: 'gigId',
  reviewerid: 'reviewerId',
  createdat: 'createdAt',
  orderid: 'orderId',
  sellerid: 'sellerId',
  reviewerimage: 'reviewerImage',
  reviewerusername: 'reviewerUsername',
  reviewtype: 'reviewType'
};

const addReview = async (data: IReviewDocument): Promise<IReviewDocument> => {
  const {
    gigId,
    reviewerId,
    reviewerImage,
    sellerId,
    review,
    rating,
    orderId,
    reviewType,
    reviewerUsername,
    country
  } = data;
  const createdAtDate = new Date();
  const { rows } = await pool.query(
    `INSERT INTO reviews(gigId, reviewerId, reviewerImage, sellerId, review, rating, orderId, reviewType, reviewerUsername, country, createdAt)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `,
    [gigId, reviewerId, reviewerImage, sellerId, review, rating, orderId, reviewType, reviewerUsername, country, createdAtDate]
  );
  const messageDetails: IReviewMessageDetails = {
    gigId: data.gigId,
    reviewerId: data.reviewerId,
    sellerId: data.sellerId,
    review: data.review,
    rating: data.rating,
    orderId: data.orderId,
    createdAt: `${createdAtDate}`,
    type: `${reviewType}`
  };
  await publishFanoutMessage(
    reviewChannel,
    'jobber-review',
    JSON.stringify(messageDetails),
    'Review details sent to order and users services'
  );
  const result: IReviewDocument = Object.fromEntries(
    Object.entries(rows[0]).map(([key, value]) => [objKeys[key] || key, value])
  );
  return result;
};

const getReviewsByGigId = async (gigId: string): Promise<IReviewDocument[]> => {
  const reviews: QueryResult = await pool.query('SELECT * FROM reviews WHERE reviews.gigId = $1', [gigId]);
  const mappedResult: IReviewDocument[] = map(reviews.rows, (key) => {
    return Object.fromEntries(
      Object.entries(key).map(([key, value]) => [objKeys[key] || key, value])
    );
  });
  return mappedResult;
};

const getReviewsBySellerId = async (sellerId: string): Promise<IReviewDocument[]> => {
  const reviews: QueryResult = await pool.query('SELECT * FROM reviews WHERE reviews.sellerId = $1 AND reviews.reviewType = $2', [
    sellerId,
    'seller-review'
  ]);
  const mappedResult: IReviewDocument[] = map(reviews.rows, (key) => {
    return Object.fromEntries(
      Object.entries(key).map(([key, value]) => [objKeys[key] || key, value])
    );
  });
  return mappedResult;
};

export { addReview, getReviewsByGigId, getReviewsBySellerId };
~~~

- src/routes/routes

~~~js
import { review } from '@review/controllers/create';
import { reviewsByGigId, reviewsBySellerId } from '@review/controllers/get';
import express, { Router } from 'express';

const router: Router = express.Router();

const reviewRoutes = (): Router => {
  router.get('/gig/:gigId', reviewsByGigId);
  router.get('/seller/:sellerId', reviewsBySellerId);
  router.post('/', review);

  return router;
};

export { reviewRoutes };
~~~

- routes

~~~js
import { verifyGatewayRequest } from '@uzochukwueddie/jobber-shared';
import { Application } from 'express';
import { healthRoutes } from '@review/routes/health';
import { reviewRoutes } from '@review/routes/review';

const BASE_PATH = '/api/v1/review';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, reviewRoutes());
};

export { appRoutes };
~~~

- elastic serach el mismo de siempre
- server.ts

~~~js
import http from 'http';

import 'express-async-errors';
import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@review/config';
import { Application, Request, Response, NextFunction, json, urlencoded } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';
import { checkConnection } from '@review/elasticsearch';
import { appRoutes } from '@review/routes';
import { createConnection } from '@review/queues/connection';
import { Channel } from 'amqplib';

const SERVER_PORT = 4007;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'reviewServer', 'debug');
let reviewChannel: Channel;

const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  reviewErrorHandler(app);
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
  reviewChannel = await createConnection() as Channel;
};

const startElasticSearch = (): void => {
  checkConnection();
};

const reviewErrorHandler = (app: Application): void => {
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    log.log('error', `ReviewService ${error.comingFrom}:`, error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
};

const startServer = async (app: Application): Promise<void> => {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Review server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Review server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'ReviewService startServer() method error:', error);
  }
};

export { start, reviewChannel };
~~~

- app.ts

~~~js
import express, { Express } from 'express';
import { start } from '@review/server';
import { databaseConnection } from '@review/database';

const initialize = (): void => {
  const app: Express = express();
  databaseConnection();
  start(app);
};

initialize();
~~~

- En el api-gateway/src/controller/review

~~~js
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { reviewService } from '@gateway/services/api/review.service';

export class Get {
  public async reviewsByGigId(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await reviewService.getReviewsByGigId(req.params.gigId);
    res.status(StatusCodes.OK).json({ message: response.data.message, reviews: response.data.reviews });
  }

  public async reviewsBySellerId(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await reviewService.getReviewsBySellerId(req.params.sellerId);
    res.status(StatusCodes.OK).json({ message: response.data.message, reviews: response.data.reviews });
  }
}
~~~

- create

~~~js
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { reviewService } from '@gateway/services/api/review.service';

export class Create {
  public async review(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await reviewService.addReview(req.body);
    res.status(StatusCodes.CREATED).json({ message: response.data.message, review: response.data.review });
  }
}
~~~
