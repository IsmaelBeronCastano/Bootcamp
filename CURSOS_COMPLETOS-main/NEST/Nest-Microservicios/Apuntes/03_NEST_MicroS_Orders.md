# 03- NEST MICROSERVICIOS - ORDERS

- Trabajaremos con PostgreSQL
- Las órdenes solo será el header de las órdenes
- En otro microservicio con Mongo tendremos el detalle
- Lo quiero manetener independiente para que puedan escalar sin manetener una relación entre si
- Creo un nuevo proyecto de Nest con **nest new**
- Levanto el gateway (da error porque no tengo Productos levantado)
- Configuro las variables de entorno de Orders, instalo **joi y dotenv**
- /config/envs.ts

~~~js
import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
})
.unknown(true);

const { error, value } = envsSchema.validate( process.env );


if ( error ) {
  throw new Error(`Config validation error: ${ error.message }`);
}

const envVars:EnvVars = value;


export const envs = {
  port: envVars.PORT,
};
~~~

- Coloco el puerto en el main para que corra en el 3002 y no de error
- Creo el logger en el main con **new Logger**
------

## Configuración

- Necesito crear los canales de comunicación para poder crear4 una orden similar a un CRUD pero con el MessagePattern y falta la instalación de los microservicios
- Instalo @nestjs/microservices
- Configuro el main con .createMicroservice al que le paso el AppModule y el objeto de configuración del microservicio con el tipo de transporte y el puerto en el objeto options

~~~js
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('OrdersMS-Main');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: envs.port,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();
  logger.log(`Microservice running on port ${envs.port}`);
}
bootstrap();
~~~

- Usamos el **CLI** con **nest g res orders** 
  - En lugar de crear un CRUD API REST, elegimos **Microservices (non-HTTP)**
  - Creo los endpoints (le digo que si)
  - La entity no la voy a ocupar
  - En lugar de usar @Get, @Post usará @MessagePattern
  - Los de actualizar y borrar no los necesito
- De forma automática coloco aun string en el MessagePattern
  - Aunque usamos un objeto anteriormente como {cmd: 'mensaje'} en orders usaremos un string
  - De todas maneras trata de estandarizar los MessagePattern y enviar siempre el mismo formato
- Evidentemente quiero llegar a orders desde el cliente-gateway
-----

## Conectar Gateway con Orders

- Para conectar orders.microservice con el cliente-gateway el microservicio tiene que estar levantado
- **En el cliente** genero un RESTFUL API con nest g res orders
  - La entity no la voy a ocupar
  - El servicio tampoco (lo borro del controlador y del módulo)
- En el ApppModule del cliente-gateway ahora tengo (en imports) a ProductsModule y OrdersModule
- Los endpoints de actualizar y borrar no los necesito
- Seguimos en el cliente-gateway, en /config/services.ts declaro el token de inyección para identificar el microservicio

~~~js
export const PRODUCT_SERVICE = 'PRODUCT_SERVICE';
export const ORDER_SERVICE = 'ORDER_SERVICE';
~~~

- Registro el microservicio en el módulo de la REST API de Orders del cliente-gateway

~~~js
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDER_SERVICE, envs } from 'src/config';

@Module({
  controllers: [OrdersController],
  imports: [
    ClientsModule.register([
      
      { 
        name: ORDER_SERVICE, 
        transport: Transport.TCP,
        options: {
          host: envs.ordersMicroserviceHost,
          port: envs.ordersMicroservicePort
        }
      },

    ]),
  ]
})
export class OrdersModule {}
~~~

- Por supuesto añado las variables de entrono a .env (y .env.template) y a .envs
- Recuerda que el puerto tiene que ser un número

~~~js
import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  PRODUCTS_MICROSERVICE_HOST: string;
  PRODUCTS_MICROSERVICE_PORT: number;

  ORDERS_MICROSERVICE_HOST: string;
  ORDERS_MICROSERVICE_PORT: number;
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  PRODUCTS_MICROSERVICE_HOST: joi.string().required(),
  PRODUCTS_MICROSERVICE_PORT: joi.number().required(),

  ORDERS_MICROSERVICE_HOST: joi.string().required(),
  ORDERS_MICROSERVICE_PORT: joi.number().required(),

})
.unknown(true);

const { error, value } = envsSchema.validate( process.env );


if ( error ) {
  throw new Error(`Config validation error: ${ error.message }`);
}

const envVars:EnvVars = value;


export const envs = {
  port: envVars.PORT,
  
  productsMicroserviceHost: envVars.PRODUCTS_MICROSERVICE_HOST,
  productsMicroservicePort: envVars.PRODUCTS_MICROSERVICE_PORT,

  ordersMicroserviceHost: envVars.ORDERS_MICROSERVICE_HOST,
  ordersMicroservicePort: envVars.ORDERS_MICROSERVICE_PORT,


};
~~~

- En .env.template

~~~js
PORT=3000


PRODUCTS_MICROSERVICE_HOST=localhost
PRODUCTS_MICROSERVICE_PORT=3001

ORDERS_MICROSERVICE_HOST=localhost
ORDERS_MICROSERVICE_PORT=3002
~~~

- Inyecto el microservicio en el OrdersController del cliente-gateway usando el token de inyección, de tipo **ClientProxy**
- Con **.send** (porque espero una respuesta) le mando el string del @MessagePattern en orders-microservice.controller para conectar, y el dto o lo que sea que necesite si lo requiere 
- En el código hay cosas que se irán explicando sobre la marcha 
- cliente-gateway.controller

~~~js
import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, Query, Patch } from '@nestjs/common';


import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {

  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll( @Query() orderPaginationDto: OrderPaginationDto ) {
    return this.ordersClient.send('findAllOrders', orderPaginationDto);
  }
  
  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe ) id: string) {
    try {
      const order = await firstValueFrom(
        this.ordersClient.send('findOneOrder', { id })
      );

      return order;

    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {

      return this.ordersClient.send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status,
      });

    } catch (error) {
      throw new RpcException(error);
    }
  }


  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe ) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      return this.ordersClient.send('changeOrderStatus', { id, status: statusDto.status })
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
~~~

- En el orders-microservice.controller 

~~~js
import { Controller, NotImplementedException, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern('findAllOrders')
  findAll(@Payload() orderPaginationDto: OrderPaginationDto ) {
    return this.ordersService.findAll(orderPaginationDto);
  }

  @MessagePattern('findOneOrder')
  findOne(@Payload('id', ParseUUIDPipe ) id: string) { //Si recojo el id, debo pasarlo en el payload (y lo parseo)
    return this.ordersService.findOne(id);
  }

  @MessagePattern('changeOrderStatus')
  changeOrderStatus(@Payload() changeOrderStatusDto: ChangeOrderStatusDto ) {
    return this.ordersService.changeStatus(changeOrderStatusDto)

  }
}
~~~

- Una vez probado que los endpoints se comunican corectamente, Orders debe crear la base de datos y hay que desarrollar la lógica en el servicio
-----

## Docker - Levantar PostgreSQL

- Si no quieres usar Docker puedes usar neon.tch, ofrecen un ServerLess Postgres (tienes un espacio gratuito para trabajar con PostgreSQL con limitaciones)
- Aqui lo haremos con Docker
- En la raíz de orders-microservice creo el docker-compose.yml- Para obtener la info de como generar volúmenes, puedes consultar en Docker-hub, en la imagen de la DB PostgreSQL
- Le estoy diciendo que enlace mi carpeta postgres de mi fileSystem con la ruta del fs del contenedor
- Pongo un puerto que no esté ocupado 
- No uso variables de entorno porque en producción no voy a usar Docker, voy a usar algún servicio

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
      - 5434:5432
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=123456
      - POSTGRES_DB=ordersdb
~~~

- Ejecuto (con Docker abierto corrriendo) en la raiz del proyecto
- Con el -d el container no se bajará si se cierra la terminal

> docker-compose -d

- En .gitignore coloco postgres/
- Me puedo conectar con Table Plus creando la conexión
- Vamos con Prisma
-------

## Modelo y conexión

- Está en la documentación de Nest cómo generar una cosa y otra usando Prisma
- Básicamente **instalo prisma** con **npm**, uso npx prisma, npx prisma init,  
- Esto crea una conexión postgres automática en .env
- La cambio y coloco la mía, con el password y user que le puse en el docker file
- Al ser una base de datos de desarrollo coloco pública la cadena de conexión 

~~~js
DATABASE_URL="postgresql://postgres:123456@localhost:5434/ordersdb?schema=public"
~~~

- Instalo el cliente de prisma con npm i @prisma/client
- Creo el schema en Prisma
- Creo un enum con los status
- Creo el modelo en orders-microservice/prisma/schema.prisma

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
  DELIVERED
  CANCELLED
}

model Order {
  id          String @id @default(uuid()) //uso uuid com id, @id crea el índice la llave primaria,etc
  totalAmount Float  //El total de la orden
  totalItems  Int   //cantidad de items

  status OrderStatus  //status de la orden
  paid   Boolean     @default(false)  //está pagada o no
  paidAt DateTime?                    //pagada cuando

  createdAt DateTime @default(now())  //valor por defecto now()
  updatedAt DateTime @updatedAt       //@updatedAt es una función propia
}
~~~

- Quizá sería más conveniente crear otra tabla con las pagadas y añadir el paidAt
- Ejecuto el comando **npx prisma migrate dev --name init**
- Se crea el cliente y se actualiza la DB
- Si todo va bien, aparecen los campos de Orders en tablePlus (!)
- Para terminar creamos un Logger en orders-microservice.service y conectamos con Prisma usando la herencia con PrismaCLient (que lo acabamos de instalar) e implementamos la interfaz de OnModuleInit que nos obliga al método onModuleInit para conectarnos con la DB

~~~js
import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto';


@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('OrdersService');


  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }
}
~~~

-----


## Crear una nueva orden

- 'orders' está en el decorador @Controller('orders') de orders-microservice.controller y también en el decorador del cliente-gateway.orders.controller. Los dos apuntan a orders
- Me creo el dto en orders-microservice (debo instalar class-validator y class-transformer)
- Debo configurar tambien el useGlobalPipes en el main
- Para utilizar el enum uso @IsEnum, le paso el listado y envío un mensaje dentro de un objeto

~~~js
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { OrderStatus, OrderStatusList } from '../enum/order.enum';

export class CreateOrderDto {


  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @IsNumber()
  @IsPositive()
  totalItems: number;

  @IsEnum( OrderStatusList, {
    message: `Possible status values are ${ OrderStatusList }`
  })
  @IsOptional()
  status: OrderStatus = OrderStatus.PENDING //por defecto pongo PENDING

  @IsBoolean()
  @IsOptional()
  paid: boolean = false; //por defecto pongo false
}
~~~

- Uso de useGlobalPipes

~~~js
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
~~~

- El cliente-gateway tiene el mismo dto, con el status y el paid con valores por defecto
- En cliente-gateway.orders.enum (order.enum.ts) tengo el OrderStatus (que también creé sin valores como string en el schema de prisma de orders.microservice)
- Y creo también el array con la OrderStatusList usando OrderStatus (estoy en el cliente-gateway)

~~~js
export enum OrderStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}


export const OrderStatusList = [
  OrderStatus.PENDING,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
]
~~~
- En el enum de orders-microservice , ya tengo el OrderStatus en el PrismaClient (desde el schema)

~~~js
import { OrderStatus } from '@prisma/client';


export const OrderStatusList = [
  OrderStatus.PENDING,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
]
~~~

- El schema en orders-microservice (extracto)

~~~js
enum OrderStatus {
  PENDING     //no tiene valores (strings) asignados pero si lo están en el cliente-gateway
  DELIVERED
  CANCELLED
}

model Order {
  id          String @id @default(uuid())
  totalAmount Float
  totalItems  Int

  status OrderStatus //se lo estoy pasando aqui
  paid   Boolean     @default(false)
  paidAt DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
~~~

- Ya tenemos el dto para el cliente y tenemos el otro dto para el microservicio (que son iguales)
- Importo el dto en el controlador del cliente-gateway para pasarselo al @Post
- Vamos con el orders-microservice.service
- No hace falta que inyecte nada en el servicio porque trabajo con el cliente de Prisma, y mi servicio hereda de PrismaClient y ya está conectado a la DB con onModuleInit
- Uso this.order, order porque en el schema le pusimos Order al modelo
- Le paso en la data el dto para hacer la isnerción con .create

~~~js
import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto';


@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('OrdersService');


  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  create(createOrderDto: CreateOrderDto) {
    
    return this.order.create({
      data: createOrderDto
    })

  }
~~~

- Para insertar apunto a http://localhost:3000/api/orders y le paso lo que me pide el dto

~~~json
{
  "totalAmount":135,
  "totalItems":4
  
}
~~~

- Esto devuelve algo como esto

~~~json
{
  "id": "34fc8622-44c0-4775-a491-8f8db607967e",
  "totalAmount": 135,
  "totalItems": 4,
  "status": "PENDING",
  "paid": false,
  "paidAt": null, //puede ser que yo no quiera valores null en mi tabla, por lo que tendría que crear una para paid y paidAt
  "createdAt": "2024-05-02T13:09:57.905Z",
  "updatedAt": "2024-05-02T13:09:57.905Z"
}
~~~
------

## Obtener orden por ID

- Copio un uuid de alguna order en TablePlus
- Lo paso en el endpoint de THUNDERCLIENT/POSTMAN orders/UUId-6456500uu-65656i-DUU-665656IDuuiD
- Primero nos aseguramos que desde cliente-gateway le mandemos el id
- Si en lugar de tratar como un Observable lo que devuelve .send y usar el catchError lo quiero tratar como una promesa con async await, debo usar firstValueFrom en un try catch, y atrapar la RpcException en el catch

~~~js
@Get('id/:id')
async findOne(@Param('id', ParseUUIDPipe ) id: string) {
  try {
    const order = await firstValueFrom(
      this.ordersClient.send('findOneOrder', { id })
    );

    return order;

  } catch (error) {
    throw new RpcException(error);
  }
}
~~~

- En el orders-microservice.service busco que exista y si no existe envio la RpcException. 
- Si existe la order retorno
- *NOTA*: sigo el mismo patrón siempre en las RpcException de incluir message y status para que todo vaya bien con el ExceptionFilter

~~~js
async findOne(id: string) {
  const order = await this.order.findFirst({
    where: { id }
  });

  if ( !order ) {
    throw new RpcException({ 
      status: HttpStatus.NOT_FOUND, 
      message: `Order with id ${ id } not found`
    });
  }

  return order;

}
~~~

- EN THUNDERCLIENT apunto con un GET a http://localhost:3000/api/orders/id/34fc8622-44c0-4775-a491-8f8db607967e (un UUID válido)
-----

## Paginación y Filtro (findAll)

- Crea varias órdenes
- Algunas ponlas canceladas y entregadas desde TablePlus
- En el controlador del cliente-gateway recojo de las Query y valido la data con orderPaginationDto
- En el .send primero le paso el string que es el mismo que me conecta desde MessagePattern con el orders-microservice.controller

~~~js
@Get()
  findAll( @Query() orderPaginationDto: OrderPaginationDto ) {
    return this.ordersClient.send('findAllOrders', orderPaginationDto);
  }
~~~

- El dto de orderPaginationDto quiero filtrar a través del status
- Extiendo de PaginationDto para tener las mismas propiedades opcionales de PaginationDto disponibles

~~~js
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common';
import { OrderStatus, OrderStatusList } from '../enum/order.enum';


export class OrderPaginationDto extends PaginationDto {


  @IsOptional()
  @IsEnum( OrderStatusList, {
    message: `Valid status are ${ OrderStatusList }`
  })
  status: OrderStatus;

}
~~~

- En el controlador de orders-microservice tenemos el mismo dto (este alojado en el microservicio Orders/src/orders/dto)
- Me interesa filtrar por el status
- Como el dto extiende de paginationDto, tengo disponibles pages y limit que son opcionales

~~~js
@MessagePattern('findAllOrders')
  findAll(@Payload() orderPaginationDto: OrderPaginationDto ) {
    return this.ordersService.findAll(orderPaginationDto);
  }
~~~

- En el servico de orders-microservice en el que me comunico con el cliente de Prsima para trabajar con la db a través del modelo y el cliente
- Con .count tengo el total de elementos, pasándole la condicion en el objeto de where
- Establezco la currentPage y el limite por página
- En el return, en el objeto data, con un await utilizo .findMany y hago la paginación
- En meta coloco la info que me parece interesante
  - Coloco la cantidad total de elementos filtrados por el status
  - Coloco la página donde estoy
  - Coloco el total de páginas (Math.ceil sirve para redondear)

~~~js
async findAll(orderPaginationDto: OrderPaginationDto) {

  //para tener el total de elementos según el status
  const totalPages = await this.order.count({
    where: {
      status: orderPaginationDto.status
    }
  });

  const currentPage = orderPaginationDto.page; //como orderPaginationDto extiende de paginationDto, tengo disponible page
  const perPage = orderPaginationDto.limit; //también limit


  return {
    //hago la paginación, que siempre es la misma cosa
    data: await this.order.findMany({
      skip: ( currentPage - 1 ) * perPage,
      take: perPage,
      where: {
        status: orderPaginationDto.status
      }
    }),
    meta: {
      total: totalPages,
      page: currentPage,
      lastPage: Math.ceil( totalPages / perPage )
    }
  }
}
~~~
------

## Cambiar estado de la orden

- En el controlador del cliente-gateway , en orders, uso @Patch
- De los parámetros extraemos el id, lo casteamos a un UUID, viene a ser un id de tipo string
- En el body tenemos el status (que debe coincidir con alguno de los del enum)
- Pasamos el id y el status que lo guardamos de statusDto.status
- metemos el .send en un try catch
- Lanzamos la RpcException en el catch 

~~~js
  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe ) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      return this.ordersClient.send('changeOrderStatus', { id, status: statusDto.status })
    } catch (error) {
      throw new RpcException(error);
    }
  }
~~~

- El statusDto está alojado en cliente-gateway/src/orders/dto

~~~js
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus, OrderStatusList } from '../enum/order.enum';



export class StatusDto {


  @IsOptional()
  @IsEnum( OrderStatusList, {
    message: `Valid status are ${ OrderStatusList }`
  })
  status: OrderStatus;

}
~~~

- En el orders-microservice.controller dentro de MessagePattern tenemos el mismo string que hemos usado en el cliente-gateway.orders.controller, y en el Payload le pasamos el dto 

~~~js
@MessagePattern('changeOrderStatus')
changeOrderStatus(@Payload() changeOrderStatusDto: ChangeOrderStatusDto ) {
  return this.ordersService.changeStatus(changeOrderStatusDto)

}
~~~

- El changeOrderStatusDto de orders-microservice.change-order-status.dto contiene un id (tipo UUID versión 4) y el status

~~~js
import { OrderStatus } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';
import { OrderStatusList } from '../enum/order.enum';



export class ChangeOrderStatusDto {

  @IsUUID(4)
  id: string;

  @IsEnum( OrderStatusList, {
    message: `Valid status are ${ OrderStatusList }`
  })
  status: OrderStatus;
}
~~~

- En orders-microservice.service extraigo el id y el status con desestructuración
- Busco por id con findOne. Si el status a actualizar es el mismo que el de la orden encontrada, devuelvo la orden tal cual
- Si no uso el .update, busco con el where por el id y en el objeto data cambio el status
- Puedo colocarlo en el return directamente

~~~js
 async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {

    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne(id);
    if ( order.status === status ) {
      return order;
    }

    return this.order.update({
      where: { id },
      data: { status: status }
    });
  }
~~~