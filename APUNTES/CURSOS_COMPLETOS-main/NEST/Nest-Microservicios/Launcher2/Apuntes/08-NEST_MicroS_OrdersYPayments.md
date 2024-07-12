# NEST MICROSERVICIOS - INTEGRAR ORDERS Y PAYMENTS

- Integraremos payments a nuestra red de Docker
- Cuando desde el client-gateway entra la creación de una orden es el microservicio de la creación de la orden quien va a hablar con payments-ms
- Payments espera los productos, el id, etc y con esto creará la sesión que regresará una url, que mandamos de nuevo a la order para que la retorne a quien sea que creó la orden de pago
- La persona irá a pagar a Stripe. Una vez paga respondemos con exito o no, pero es nuestro webhook quien va a comunciarse con Stripe para verificar que la orden fue pagada, y el webhook también se comunicará con orders-ms para que lo marque como pagado
- Hemos visto el MessagePattern, que espera una respuesta, y ahora veremos EventPattern que es yo te envío un mensaje y sigo con mi vida, me da igual si respondes o no
- Esto es util, porque vamos a tener el webhook, la respuesta rápida que está esperando Stripe (un 200 o 400)
- Y en nuestro lado si vamos a recibir ese evento y procesamos toda la info
- Suena complicado pero son simplemente muchos pasos lógicos
- EL que yo tenga varios NULL en la DB en la fecha cuando se pagó se puede ver como una mala práctica
- Podría verse como una mala práctica tener en la columna de cuando es la fecha en que se pago NULL
- Es mejor tener una tabla aparte sin nulos, donde la orden se creó en tal fecha. Solo tener ahí las órdenes pagadas
- Los pagos se comunican a través de NATS con orders y con el gateway que es quién se comuncia con el cliente
- El webhook tiene que hablar con NATS y notifique al orders-ms que notifique que tal orden fue pagada y guardar el recibo en base de datos
----

## Agregar Repositorio al Launcher

- Agreguemos la imagen en el docker-compose.yml de la raíaz del launcher

~~~yml
version: '3'


services:

  
  nats-server:
    image: nats:latest
    ports:
      - "8222:8222"
    

  client-gateway:
    build: ./client-gateway
    ports:
      - ${CLIENT_GATEWAY_PORT}:3000
    volumes:
      - ./client-gateway/src:/usr/src/app/src
    command: npm run start:dev
    environment:
      - PORT=3000
      - NATS_SERVERS=nats://nats-server:4222

  products-ms:
    build: ./products-ms
    volumes:
      - ./products-ms/src:/usr/src/app/src
    command: npm run start:dev
    environment:
      - PORT=3001
      - NATS_SERVERS=nats://nats-server:4222
      - DATABASE_URL=file:./dev.db

  
  # Orders MS
  orders-ms:
    depends_on:
      - orders-db
    build: ./orders-ms
    volumes:
      - ./orders-ms/src:/usr/src/app/src
    command: npm run start:dev
    environment:
      - PORT=3002
      - DATABASE_URL=postgresql://postgres:123456@orders-db:5432/ordersdb?schema=public
      - NATS_SERVERS=nats://nats-server:4222



  # Orders DB
  orders-db:
    container_name: orders_database
    image: postgres:16.2
    restart: always
    volumes:
      - ./orders-ms/postgres:/var/lib/postgresql/data
    ports:
      - 5432:5432
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=123456
      - POSTGRES_DB=ordersdb

# ======================
# Payments Microservice
# ======================
  payments-ms:
    container_name: payments-ms
    build: ./payments-ms
    volumes:
      - ./payments-ms/src:/usr/src/app/src
    command: npm run start:dev
    ports:
      - ${PAYMENTS_MS_PORT}:${PAYMENTS_MS_PORT}
    environment:
      - PORT=${PAYMENTS_MS_PORT}
      - NATS_SERVERS=nats://nats-server:4222
      - STRIPE_SECRET=${STRIPE_SECRET}
      - STRIPE_SUCCESS_URL=${STRIPE_SUCCESS_URL}
      - STRIPE_CANCEL_URL=${STRIPE_CANCEL_URL}
      - STRIPE_ENDPOINT_SECRET=${STRIPE_ENDPOINT_SECRET}
~~~

- En orders-ms también tengo un .yml

~~~yml
version: '3'


services:
  orders-db:
    container_name: orders_database
    image: postgres:16.2
    restart: always
    volumes:
      - ./postgres:/var/lib/postgresql/data
    ports:
      - 5432:5432
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=123456
      - POSTGRES_DB=ordersdb
~~~

- Y el dockerfile de orders-ms

~~~dockerfile
FROM node:21-alpine3.19

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./


RUN npm install

COPY . .

EXPOSE 3002
~~~

- En el dockerfile de products genero el cliente

~~~dockerfile
FROM node:21-alpine3.19

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./


RUN npm install

COPY . .

RUN npx prisma generate


EXPOSE 3001
~~~

- El dockerfile de client y payments es igual al de orders
-----

## Microservicio híbrido - REST - NATS

- Porqué híbrido
- Al comunicarse payments-ms con nats podrá comunicarse con los otros microservicios
- Puedo aplicar un puerto (desde mi REST) para que Stripe mediante el webhook hable con payments
- Puedo no hacerlo híbrido y hacer que stripe se comunique como otro cliente a través del gateway
- O crear otro servidor, otro gateway
- O crear en el gateway otro POST que esté pendiente del endpoint de Stripe/webhook, pero no me interesa exponer payments, que alguien desde el exterior pueda acceder ahí
- En el main de payments-ms

~~~js
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Payments-ms');

  const app = await NestFactory.create(AppModule, {
    rawBody: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );


  //conecto el microservicio al NATS
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers, //"nats://localhost:4222,nats://localhost:4223"
    },
  }, {
    inheritAppConfig: true
  })


  await app.startAllMicroservices();
  
  await app.listen(envs.port);

  logger.log(`Payments Microservice running on port ${envs.port}`);
}
bootstrap();

~~~

- Configuro las variables de entorno en payments/src/config/envs

~~~js
import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;

  STRIPE_SECRET: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;
  STRIPE_ENDPOINT_SECRET: string;

  NATS_SERVERS: string[];
}

const envsSchema = joi.object({
  PORT: joi.number().required(),

  STRIPE_SECRET: joi.string().required(),
  STRIPE_SUCCESS_URL: joi.string().required(),
  STRIPE_CANCEL_URL: joi.string().required(),
  STRIPE_ENDPOINT_SECRET: joi.string().required(),

  NATS_SERVERS: joi.array().items( joi.string() ).required(),
})
.unknown(true);

const { error, value } = envsSchema.validate({ 
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
});


if ( error ) {
  throw new Error(`Config validation error: ${ error.message }`);
}

const envVars:EnvVars = value;


export const envs = {
  port: envVars.PORT,
  
  stripeSecret: envVars.STRIPE_SECRET,
  stripeSuccessUrl: envVars.STRIPE_SUCCESS_URL,
  stripeCancelUrl: envVars.STRIPE_CANCEL_URL,
  stripeEndpointSecret: envVars.STRIPE_ENDPOINT_SECRET,

  natsServers: envVars.NATS_SERVERS,
}
~~~
-----

## PaymentSession dede orders-ms

- Yo puedo acceder a 3003/payments/create-payment... y quiero evitarlo
- Puedo decir que el POST también recibe el MessagePattern

~~~js
// @Post('create-payment-session')
@MessagePattern('create.payment.session')
createPaymentSession(@Payload() paymentSessionDto: PaymentSessionDto ) {
  return this.paymentsService.createPaymentSession(paymentSessionDto);
}
~~~

- Cuando establezco el microservicio (con startAllMicroservices) automáticamente no va a aplicar el class-validator y class-transform
- No va a servir la configuración en el main de siempre con GlobalPipes
- En orders-ms-controller, tan pronto como creo la orden quiero crear la sesión

~~~js
@MessagePattern('createOrder')
async create(@Payload() createOrderDto: CreateOrderDto) {

  //pongo el cursor encima de order para obtener la interfaz a través de lo que construimos
  const order = await this.ordersService.create(createOrderDto);
  const paymentSession = await this.ordersService.createPaymentSession(order)//vamos a crear este método en el servicio

  return {
    order,
    paymentSession, //lo coloco aquí para poderlo observar
  }
}
~~~ 

- Si pongo el cursor encima de la variable order, la intellisense me muestra la interfaz
- La copio
- Creo en src/orders/interfaces/order-with-products.ts

~~~js
import { OrderStatus } from '@prisma/client';


export interface OrderWithProducts {
  OrderItem: {
      name: any;
      productId: number;
      quantity: number;
      price: number;
  }[];
  id: string;
  totalAmount: number;
  totalItems: number;
  status: OrderStatus; //Le quito $Enums.
  paid: boolean;
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
~~~ 

- Paso el schema de prisma de orders-ms

~~~js
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum OrderStatus {
  PENDING
  PAID
  DELIVERED
  CANCELLED
}

model Order {
  id          String @id @default(uuid())
  totalAmount Float
  totalItems  Int

  status         OrderStatus @default(PENDING)
  paid           Boolean     @default(false)
  paidAt         DateTime?
  stripeChargeId String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  OrderItem    OrderItem[]
  OrderReceipt OrderReceipt?
}

model OrderItem {
  id        String @id @default(uuid())
  productId Int
  quantity  Int
  price     Float

  Order   Order?  @relation(fields: [orderId], references: [id])
  orderId String?
}

model OrderReceipt {
  id String @id @default(uuid())

  order   Order  @relation(fields: [orderId], references: [id])
  orderId String @unique

  receiptUrl String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

}
~~~

- Creo el método en orders-ms.orders.service para enviarle la orden con los productos, al payments-ms.payments.controller
- Uso el firstValueFrom con dentro el .send para tratarlo como una promesa
- El payload todavía no lo tengo

~~~js
async createPaymentSession(order: OrderWithProducts) {

    const paymentSession = await firstValueFrom(
      this.client.send('create.payment.session', { 
            abc: 123,
            xyz:234
        })),
      
    

    return paymentSession;
  }
~~~

- En el payments-ms.payments.controller le paso el dto al service de payments
- Extraigo la data del dto, hago unmap de los items y creo el objeto para Stripe

~~~js
async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
  const { currency, items, orderId } = paymentSessionDto;

  const lineItems = items.map((item) => {
    return {
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // 20 dólares 2000 / 100 = 20.00 // 15.0000
      },
      quantity: item.quantity,
    };
  });
}
~~~

- Si creo una orden desde el endpoint, en el objeto total tengo un objeto que es paymentSession que recibimos del orders.service
- No debería de pasar porque en el payments.controller lo estamos validando contra el paymentSessionDto del payments.controller

~~~js
// @Post('create-payment-session')
@MessagePattern('create.payment.session')
createPaymentSession(@Payload() paymentSessionDto: PaymentSessionDto ) {
  return this.paymentsService.createPaymentSession(paymentSessionDto);
}
~~~

- Hay que configurarlo en el main (de payments) cuando no son aplicaciones basadas en HTTP con inheritAppConfig

~~~js
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Payments-ms');

  const app = await NestFactory.create(AppModule, {
    rawBody: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers,
    },
  }, {
    inheritAppConfig: true //configuro la validación 
  })


  await app.startAllMicroservices();
  
  await app.listen(envs.port);

  logger.log(`Payments Microservice running on port ${envs.port}`);
}
bootstrap();
~~~

- En orders.service tengo que pasar que valide los dtos de payments-ms/src/payments/dto

~~~js
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator';


export class PaymentSessionDto {


  @IsString()
  orderId: string;


  @IsString()
  currency: string;


  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type( () => PaymentSessionItemDto )
  items: PaymentSessionItemDto[];

}


export class PaymentSessionItemDto {

  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
~~~

- Ahora debo pasarle el objeto que pase la validación de los dto en orders.service

~~~js
async createPaymentSession(order: OrderWithProducts) {

  const paymentSession = await firstValueFrom(
    this.client.send('create.payment.session', {
       //abc: 123,
       //xyz:234
      orderId: order.id,
      currency: 'usd',
      items: [
        {
          name: 'ksjsjhs'.
          price:200,
          quantity: 300
        }
      ]
      ,
    }),
  );

  return paymentSession;
}
~~~
------

## Retornar URLS de sesión

- En lugar de enviar en duro el producto, debe recibir lo que hay en items

~~~js
async createPaymentSession(order: OrderWithProducts) {

  const paymentSession = await firstValueFrom(
    this.client.send('create.payment.session', {
      orderId: order.id,
      currency: 'usd',
      items: order.OrderItem.map( item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }) ),
    }),
  );

  return paymentSession;
}
~~~

- Entonces, ya estamos llegando al payments-ms.controller, recogemos el paymentsDto con @Payload
- En payments.service

~~~js
 async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto;

    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // 20 dólares 2000 / 100 = 20.00 // 15.0000
        },
        quantity: item.quantity,
      };
    });

    const session = await this.stripe.checkout.sessions.create({
      // Colocar aquí el ID de mi orden
      payment_intent_data: {
        metadata: {
          orderId: orderId
        },
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: envs.stripeSuccessUrl,
      cancel_url: envs.stripeCancelUrl,
    });

    //Si apunto al endpoint 3000/api/orders tengo muchisima info en la respuesta si retorno la sesión, más de la que necesito
    // return session;
    return {
      cancelUrl: session.cancel_url,
      successUrl: session.success_url, 
      url: session.url, //enlace para pagar
    }
  }  
~~~

- Cuando la orden es creada hace la solicitud al payments para que hable con stripe  yme dé el session url
- Por el mismo canal llega a orders para regresarle al cliente. Esta es la primera fase
- Una vez realizado el pago tenemos que asegurarnos de comunicarnos con el webhook para que comunique a orders la orden pagada y recoger el recibo
-----

## EventPattern

- Corro con ngrok el proxy para levantar el forwarder y disponer de la URL para el webhook de Stripe
- En payments.service creo el payload con la data
- Creo una nueva instancia de un logger y le paso el payload para chequearlo

~~~js
async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    // Real
    const endpointSecret = envs.stripeEndpointSecret;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    
    switch( event.type ) {
      case 'charge.succeeded': 
        const chargeSucceeded = event.data.object;
        const payload = {                     //creo el payload
          stripePaymentId: chargeSucceeded.id, 
          orderId: chargeSucceeded.metadata.orderId,
          receiptUrl: chargeSucceeded.receipt_url,
        }

         this.logger.log({ payload }); //chequeo el pyload con el logger
       
      break;
      
      default:
        console.log(`Event ${ event.type } not handled`);
    }

    return res.status(200).json({ sig });
  }
~~~

- Copio la carpeta transports con nats.module

~~~js
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE, envs } from 'src/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: envs.natsServers,
        },
      },
    ]),
  ],
  exports: [
    ClientsModule.register([
      {
        name: NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: envs.natsServers,
        },
      },
    ]),
  ],
})
export class NatsModule {}
~~~

- En imports de payments-ms.module en src/payments (no app.module) coloco el NatsModule

~~~js
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [NatsModule],
})
export class PaymentsModule {}
~~~

- En el PaymentsService inyecto el NATS

~~~js
@Injectable()
export class PaymentsService {

  private readonly stripe = new Stripe(envs.stripeSecret);
  private readonly logger = new Logger('PaymentsService');

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

}
~~~

- Uso .emit porque no espero respuesta
- Todavía no hay nadie que escuche el payment.succeeded

~~~js
 async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    // Real
    const endpointSecret = envs.stripeEndpointSecret;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    
    switch( event.type ) {
      case 'charge.succeeded': 
        const chargeSucceeded = event.data.object;
        const payload = {
          stripePaymentId: chargeSucceeded.id,
          orderId: chargeSucceeded.metadata.orderId,
          receiptUrl: chargeSucceeded.receipt_url,
        } //este payload corresponderá al PaidOrderDTO

        // this.logger.log({ payload });
        this.client.emit('payment.succeeded', payload ); //todavía no hay nadie escuchando este evento
      break;
      
      default:
        console.log(`Event ${ event.type } not handled`);
    }

    return res.status(200).json({ sig });
  }
~~~

- En el orders-ms.controller (no en el cliente) escucho con EventPattern el payment.succeeded
- Con el payload recoho la orden de pago, creo un dto para ella

~~~js
@EventPattern('payment.succeeded')
paidOrder(@Payload() paidOrderDto: PaidOrderDto ) {
  return this.ordersService.paidOrder( paidOrderDto );
}
~~~

- paidOrderDto

~~~js
import { IsString, IsUUID, IsUrl } from 'class-validator';


export class PaidOrderDto {

  @IsString()
  stripePaymentId:string;

  @IsString()
  @IsUUID()
  orderId: string;

  @IsString()
  @IsUrl()
  receiptUrl: string;


}
~~~

##  Preparar base de datos y PaidOrderDto

- En orders (mirto en TablePlus) puedo ver que tengo varios status, PENDING, DELIVERED; CANCELED
- Para no tener todos los paidAt en NULL, tendriamos el paid en false y cuando estuviera en true estableceriamos la relacion uno a uno con otra tabla que diga pagada
- En orders-ms/prisma en Order Status coloc PAID

~~~js
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum OrderStatus {
  PENDING
  PAID
  DELIVERED
  CANCELLED
}

model Order {
  id          String @id @default(uuid())
  totalAmount Float
  totalItems  Int

  status         OrderStatus @default(PENDING)
  paid           Boolean     @default(false)
  paidAt         DateTime?
  stripeChargeId String?  

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  OrderItem    OrderItem[]
  OrderReceipt OrderReceipt? //agrego OrderReceipt
}

model OrderItem {
  id        String @id @default(uuid())
  productId Int
  quantity  Int
  price     Float

  Order   Order?  @relation(fields: [orderId], references: [id])
  orderId String?
}

//creo el orderReceipt (para guardar el recibo)
model OrderReceipt {
  id String @id @default(uuid())

  order   Order  @relation(fields: [orderId], references: [id])
  orderId String @unique //me aseguro de que el orderId va a ser unico

  receiptUrl String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

}
~~~

- En el servicio creo paidOrder actualizo la order como pagada

~~~js
 async paidOrder( paidOrderDto: PaidOrderDto ) {

    this.logger.log('Order Paid');
    this.logger.log(paidOrderDto);

    const order = await this.order.update({
      where: { id: paidOrderDto.orderId },
      data: {
        status: 'PAID',
        paid: true,
        paidAt: new Date(),
        stripeChargeId: paidOrderDto.stripePaymentId,

        // La relación
        OrderReceipt: {
          create: {
            receiptUrl: paidOrderDto.receiptUrl
          }
        }
      }
    });

    return order;

  }
