# 02 NODE-REACT MICROSERVICES FULL STACK

## Helper Library

- Usaremos Cloudinary para albergar imágenes

> npm i **cloudinary**

- En jobber-shared/src/cloudinary-upload.ts
- **NOTA**: jobber-shared es un repo en gitu¡hub, una biblioteca hecha por mi con archivos helpers. En el primer pdf se explica cómo usarla

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

export function videoUpload(
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
        chunk_size: 50000,
        resource_type: 'video'
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) resolve(error);
        resolve(result);
      }
    );
  });
}
~~~
-----

## Error-handler

- En microservices/jobber-shared/src/error-handler.ts usaremos **la librería http-status-codes**

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

## jsonwebtoken - Gateway middleware

> npm i jsonwebtoken

- Se rechazarán todas las peticiones que no vengan del api-gateway
- Guardaré un token por cada servicio que espero recibir.
  - Lo declaro como un arreglo, en un caso real posiblemente usaramos otra metodología
  - El payload.id debe de estar en el arreglo, si no rechazará la conexión
  - Pasaremos el token en los headers
  -  Uso el método .verify de jwt para verificar el token  
- jobber-shared/src/gateway-middleware.ts

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
----

## Logger

- Usaremos Winston

> npm i winston winston-elasticsearch

- Los logs serán enviados a elasticsearch y desplegados por kibana
- jobber-shared/src/logger.ts

~~~js
import winston, { Logger } from 'winston';
import { ElasticsearchTransformer, ElasticsearchTransport, LogData, TransformedData } from 'winston-elasticsearch';

//mirar la documentación, creo el transformer
const esTransformer = (logData: LogData): TransformedData => {
  return ElasticsearchTransformer(logData);
}

export const winstonLogger = (elasticsearchNode: string, name: string, level: string): Logger => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true
    },
    elasticsearch: {
      level,
      transformer: esTransformer,//le paso el transformer
      clientOpts: {
        node: elasticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false
      }
    }
  };
  const esTransport: ElasticsearchTransport = new ElasticsearchTransport(options.elasticsearch);
  const logger: Logger = winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [new winston.transports.Console(options.console), esTransport]
  });
  return logger;
}
~~~
-----

## Helpers

- jobber-shared/src/helpers.ts

~~~js
export function firstLetterUppercase(str: string): string {
  const valueString = str.toLowerCase();
  return valueString
    .split(' ')
    .map(
        (value: string) =>
        `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`
    )
    .join(' ');
}

export function lowerCase(str: string): string {
  return str.toLowerCase();
}

export const toUpperCase = (str: string): string => {
  return str ? str.toUpperCase() : str;
};

export function isEmail(email: string): boolean {
  const regexExp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
  return regexExp.test(email);
}

export function isDataURL(value: string): boolean {
  const dataUrlRegex =
  /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\\/?%\s]*)\s*$/i;
  return dataUrlRegex.test(value);
}
~~~


