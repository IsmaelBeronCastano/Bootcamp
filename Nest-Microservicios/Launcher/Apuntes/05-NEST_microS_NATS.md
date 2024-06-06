# 05- NEST MICROSERVICIOS - NATS

## Problema / Solución

- La orden se crea con el detalle, están fuertemente acopladas, las hicimos en el mismo microservicio
- Orders se comunica directamente con Products para confirmar los productos
- Con la arquitectura actual, cuando añadamos autenticación y queramos modificar una orden, vamos a tener que añadir otra dependencia a ordenes (el microservicio de auth)
   En lugar de eso, nos encargaremos de hacer las comunicaciones mediante un Service Broker, un middleman situado entre el cliente-gateaway y mis microservicios
- Cuando NATS recibe la solicitud de creación de una orden desde el cliente-gateway mandada por el cliente, orders que está suscrita al tópico de creación de la orden dará una respuesta
- Orders necesita saber si los ids de los productos que lleva el detalle existen en la db de productos
- El servidor de NATS servirá de intermediario entre orders-microservice y productws-microservice
- Bueno, esto es una forma simplificada de lo que ocurre
- **NATS BROKER**
  - Es open source, ligero y facil de configurar
  - Comunicará mis microservicios (estos pueden mantener interconexiones sin necesidad de pasar por NATS) 
  - NATS se encarga de hacer balanceo de carga
    - Es decir, si tengo varios microservicios y creo que todos respondan al mismo tiempo se puede configurar con NATS
    - Cuando implementemos los microservicios de pagos y notificaciones vamos a querer hacer uso de esto
  - Trabaja con mensajería tipo **publicar y suscribir**
  - Hay temas **topics/subjects** a los cuales **se escucha**
  - Puedes tener **múltiples escuchas (listeners)** al mismo topic
  - Pensado para **escalamiento horizontal**
  - Seguridad, balanceo de carga inlcuido
  - **Payload agnóstico**, pueden ser strings, numeros, lo que sea necesario
  - Rápido y eficiente, y open source  
- Por ejemplo, una vez realizado un pago voy a querer comunicarme con tres microservicios de manera instantánea
  - Con auth, email notification y ordenes
- Con la arquitectura que hemos implementado hasta ahora se convertirían en dependencias del microservicio de pagos
- Crearemos una **Docker Network** para tenerlo todo en un mismo lado y que solo mediante el puerto 3000 a través de una API REST se acceda a esta red interna
- Primero vamos a establecer la arquitectura con NATS y luego crearemos la Docker Network
-----

## 

- En orders-microservice debo ejecutar docker compose up -d para levantar el microservicio con Docker corriendo
- Si aparece el error de prisma usar **npx prisma generate**
- Para que no haya que instalar NATS físicamente en el host usaremos Docker
- Para levantar el servidor de NATS usar
  - 4222: Nuestros microservicios van a estar hablando con NATS por este puerto
  - 8222: ofrece una comunicación HTTP para monitorear los clientes y ver quien se conecta, quien se cae, se levanta, etc
  - 6222: Puerto utilizado para el clustering. En estecaso no lo usaremos
  - nats al final esla imagen de nats:latest por defecto
  - Le llamaremos nats-sever

> docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
> npm run start:dev

- En .env de orders tengo

~~~
PORT=3002

PRODUCTS_MICROSERVICE_HOST=localhost
PRODUCTS_MICROSERVICE_PORT=3001

DATABASE_URL="postgresql://postgres:123456@localhost:5434/ordersdb?schema=public"

# NATS_SERVERS="nats://localhost:4222,nats://localhost:4223"
NATS_SERVERS="nats://localhost:4222"
~~~

- En .env de products tengo
- El :4223 no existe. Servirá luego parahacer las pruebas de validación de las variables de entorno, donde validaremos que sea un array y separaremos por comas los strings para porder validarlos

~~~
PORT=3001

DATABASE_URL="file:./dev.db"


NATS_SERVERS="nats://localhost:4222,nats://localhost:4223"
~~~

- En .env de cliente-gateway tengo

~~~
PORT=3000


# PRODUCTS_MICROSERVICE_HOST=localhost
# PRODUCTS_MICROSERVICE_PORT=3001

# ORDERS_MICROSERVICE_HOST=localhost
# ORDERS_MICROSERVICE_PORT=3002


# NATS_SERVERS="nats://localhost:4222,nats://localhost:4223"
NATS_SERVERS="nats://localhost:4222"
~~~

- Una vez ya ha descargado la imagen de Docker, para iniciar el microservicio usar el mismo prompt sin el --name
- Con crear la conexión con NATS en orders es suficiente

> docker run -d -p 4222:4222 -p 8222:8222 nats
> npm run start:dev

- En localhost:8222 puedo monitorear el NATS (tiene una interfaz gráfica)

- **RESUMEN**:
  - uso el comando de docker run con el nombre del nats-server y los puertos + la imagen para que descargue la imagen de NATS si no la tengo
-------

## Products-microservice  - Cambiar de TCP a NATS

- Para trabajar con nats en NEST debo instalar nats con npm i nats
- Es muy similar a la conexión con TCP, solo que en lugar de los puertos tengo en options un arreglo con los servidores (puede ser uno, pueden ser más)
- Debo añadir la variable de entorno a envs.ts

~~~js
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;

  NATS_SERVERS: string[]; //añado el string del NATS
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  DATABASE_URL: joi.string().required(),
                                                              //en este momento todavía no es un arreglo, pero hago la validación
  NATS_SERVERS: joi.array().items( joi.string() ).required(), //valido que el NATS sea un array y que contenga un string ( yque sea obligatorio)
})
.unknown(true);

const { error, value } = envsSchema.validate({ 
  ...process.env,         //hago que sea un arreglo con .split                           
  NATS_SERVERS: process.env.NATS_SERVERS?.split(',') //si tengo varios strings, los separo por la coma para validarlos
});

//explicación: ES AL APLICAR SPLIT QUE DEVUELVE UN ARREGLO

const loquesea ="loalaoaoala, pwepejdoiejhd"

const arrayLoquesea = loquesea.split(',')

console.log(arrayLoquesea) //["loalaoaoala", " pwepejdoiejhd"]


if ( error ) {
  throw new Error(`Config validation error: ${ error.message }`);
}

const envVars:EnvVars = value;


export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,

  natsServers: envVars.NATS_SERVERS, //exporto la variable
}
~~~

- En el main

~~~js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('Main');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers //'nats://localhost:4222, nats://localhosts:4223'
      }
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();
  logger.log(`Products Microservice running on port ${ envs.port }`);

}
bootstrap();
~~~


- Puedo seguir usando el **MessagePattern**, puedo usar comodines


~~~js
@MessagePattern('time.*') //escuchará cualquier mensaje que venga de time
getDate(@Payload() data: number[], @Ctx() context: NatsContext){
  console.log(`Subject: ${context.getSubject()}`)
  return new Date().toLocaleString(...)
}
~~~

- Para poder ver los productos debemos cambiar tambien el canal de comunicación en cliente-gateway
- **RESUMEN**: instalo nats, configuro y valido la variable de entorno, me aseguro de que sea un arreglo, coloco la variable en el main y cambio el transporte
-------

## Cliente-gateway - Cambiar TCP a NATS

- Debemos instalar nats tambien con npm i nats
- Vamos a crear un módulo centralizado para poder importar la comunicación
- Podemos hacer el cambio en cliente-gateway.products.module de esta forma

~~~js
imports:[
    ClientsModule.register([
    {
      name: NATS_SERVICE,
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
      },
    },
  ])
]
~~~

- Pero podemos crear un módulo que podamos copiar y pegar a los otros clientes (orders, en este caso)
- Creo la carpeta en cliente-gateway/src/products/transports/nats.module.ts

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

- El token de inyección NATS_SERVICE está alojado en cliente-gateway/src/config/services.ts

~~~js
export const PRODUCT_SERVICE = 'PRODUCT_SERVICE';
export const ORDER_SERVICE = 'ORDER_SERVICE';


export const NATS_SERVICE = 'NATS_SERVICE';
~~~

- Importo el módulo en cliente-gateway.app.module

~~~js
import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { NatsModule } from './transports/nats.module';


@Module({
  imports: [ProductsModule, OrdersModule, NatsModule],
})
export class AppModule {}
~~~

- Y también en cliente-gateway.products.module

~~~js
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [NatsModule],
})
export class ProductsModule {}
~~~

- Hago lo mismo en orders! copio la carpeta transports y hago la importación del módulo
- Para usarlo en el controller de cliente-gateway.products.controller debo inyectarlo con el token de inyección y usar CLientProxy nuevamente
- ya no lo nombro productsClient, simplemente **client**
- cliente-gateway.products.controller

~~~js
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy, //inyecto el token y uso Clientproxy
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send(
      { cmd: 'create_product' },
      createProductDto,
    );
  }
}
~~~

- Lo mismo en el módulo de orders de cliente-gateway
- Tengo que hacer la misma configuración en orders-microservice, copiar el modulo transports, importarlo, validar la variable de entorno, inyectar el token en el controlador, renombrar el servicio a client...
------

## Docker Network - problema y necesidad

- Tenemos varias terminales corriendo, el Docker, tenemos que levantar el NATS....
- Un poco complicado (y tedioso de levantar y subir) para alguien que venga de fuera desarrollar así
- Crearemos una red que se encargue de comunicarse con mis servidores, que mediante un solo comando levante toda la infraestructura
- Puedo hacer que no se levanten los microservicios si NATS no está arriba
- Lo mismo con la DB, si no está arriba el microservicio no se va a levantar
- Crearemos un monorepo. No es más que un repositorio que tiene varios repositorios de nuestra app
- Nest ofrece una manera un poco acoplada
- Usaremos otra metodología
