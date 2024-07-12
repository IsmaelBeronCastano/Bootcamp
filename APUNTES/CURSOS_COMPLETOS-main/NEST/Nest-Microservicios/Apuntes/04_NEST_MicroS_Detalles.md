# 04- NEST MICROSERVCIIOS - DETALLES

- Vamos a conectar Ordenes con Productos directamente para comprobar que los productos existen
- Debemos cambiar el dto de creacion de la orden para aceptar los tems, en orders igual
- Hay que crear en Products algún método para recibir el id de los productos y verificar que existen
- No voy a poder crear una orden si un producto no existe
- Es conveniente que inttroduzcamos algun tipo de middleman como NATS o RabbitMQ, algun sistema que mantenga el orden en este caos de tanto microservicio
----

## Orders-microservice

- Ordenes y detalle van a estar en el mismo microservicio
- Ambos están altamente acoplados, uno no va a existir sin el otro
- Comunicaremos ordenes y productos mediante TCP para validar
- Despues de esta sección implementaremos un middleman entre el cliente y los microservicios (un servidor NATS)
- Habrá otro microservicio de autenticación con MONGO
- Vamos con el desarrollo. Levantamos Docker, Orders y el cliente
- Uso docker-compose up -d en orders-microservice 
-----

## OrderItems - detalles de la orden

- En orders-microservice
- Para entender la comunicación que vamos a establecer, lo mejor es entender la estructura de la DB
- Practicamente, excepto totalAmount y totalItems, el resto de campos se crean automáticamente
- Voy a pedir siempre una cantidad de hijos (items) y esos items los voy a contar y sumar su valor para el totalAmount
- Una orden en la vida real podría tener más cosas, como un cupón de descuento
- Creo otro modelo como OrderItem
- productId no tiene una relación directa con SQLite de Products
  - Hay quien trabaja todo en un amisma DB, pero no son buenas practicas en microservicios
  - Se puede hacer, pero no permitiría escalar cada microservicio de manera independiente
- Si yo coloco esto en Order

~~~js
OrderItem OrderItem[]
~~~

- y PRESIONO CTRL+aLT+SHIFT me creará la relación automáticamente

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
  id          String @id @default(uuid())
  totalAmount Float
  totalItems  Int

  status OrderStatus @default(PENDING) //establezco PENDING por defecto
  paid   Boolean     @default(false)   //false por defecto
  paidAt DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  OrderItem OrderItem[]  //
}

model OrderItem {
  id        String @id @default(uuid())
  productId Int  //no hay una relación (física) directa con SQLite
  quantity  Int  //cantidad de este producto
  price     Float  //los precios pueden variar. Este precio se queda aqui en el momento que se creó la orden

  Order   Order?  @relation(fields: [orderId], references: [id]) //establezco la relación
  orderId String?
}
~~~

- Desde orders-microservice impacto la db con una migracion

> npx prisma migrate dev --name order-item

- Debes tener Docker corriendo y poder establecer conexión con el puerto correcto y la autenticación
- Puedo mirar en TablePlus
- Borro las ordenes anteriores porque estan mal creaqdas, les falta el OrderItem
------

## DTOs de creación de orden

- Para orders-microservice.create-order.dto pido un Array de minimo 1 elemento de tipo item: orderItemDto

~~~js
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

import { OrderItemDto } from './order-item.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1) //por lo menos un item
  @ValidateNested({ each: true }) //valida internamente los objetos en el array
  @Type(() => OrderItemDto) //ojo! no pongo que es un arreglo
  items: OrderItemDto[]; //aquí si indico que es un arreglo
}
~~~

- En order-item.dto tengo productId, quantity y price

~~~js
import { IsNumber, IsPositive } from 'class-validator';

export class OrderItemDto {
  @IsNumber()
  @IsPositive()
  productId: number; //En la DB de productos los productos tienen id de tipo numérico

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsNumber()
  price: number;
}
~~~

- Esto vendría a pedir algo asi en POSTMAN

~~~json
{
    "items":[
        {
            "productId": 4 ,
            "quantity": 3,
            "price": 20
        }
    ]
}
~~~

- Pero esto solo valida la petición en orders-microservice
- **Hay que hacer lo mismo en cliente-gateway**
- En cliente-gateway.orders.create-oder.dto es el mismo código
- En cliente-gateway.orders.order-item.dto también es el mismo código
- En el método create de orders-microservice.service voy a tener un error porque prsima valida el dto
- Coloco un return {service: "orders-service create", createOrderDto} devolviendo el dto
- **Falta validar que los productos de la orden existan**
------

## Products-microservice - Validar productos por ID

- En products-microservice estoy trabajando con SQLite (la abro en TablePlus) donde tengo la data
- Abro el products-microservice.controller y creo el controlador

~~~js
@MessagePattern({ cmd: 'validate_products' })
validateProduct( @Payload() ids: number[] ) {
return this.productsService.validateProducts(ids);
}
~~~

- En products-microservice.service creo un array  de id's y utilizo Set para eliminar los id's repetidos
- Hago la búsqueda con findMany le digo que el id debe estar en el arreglo ids con **where:{id:{in: ids}}**
- Si la cantidad de productos encontrados no coincide con la cantidad del array de ids es que algunos productos no los ha encontrado
- Retorno products

~~~js
async validateProducts(ids: number[]) {
ids = Array.from(new Set(ids));

const products = await this.product.findMany({
    where: {
    id: {
        in: ids
    }
    }
});

if ( products.length !== ids.length ) {
    throw new RpcException({
    message: 'Some products were not found',
    status: HttpStatus.BAD_REQUEST,
    });
}


return products;

}
~~~
-----

## Comunicar orders-microservice con products-microservice

- En orders-microservice tengo que registrar el products-microservice con ClientsModule.register
- Voy a necesitar añadir las variables de entorno en .env de orders-microservice

~~~js
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_SERVICE, envs } from 'src/config';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    // ClientsModule.register......
    ClientsModule.register([

      {
        name: PRODUCT_SERVICE,
        transport: Transport.TCP, //después usaremos NATS!!!
        options: {
          host: envs.productsMicroserviceHost,
          port: envs.productsMicroservicePort,
        }
      }


    ])
  ]
})
export class OrdersModule {}
~~~

- orders-microservice .env

~~~
PORT=3002

PRODUCTS_MICROSERVICE_HOST=localhost
PRODUCTS_MICROSERVICE_PORT=3001

DATABASE_URL="postgresql://postgres:123456@localhost:5434/ordersdb?schema=public"
~~~

- También debo añadirlas en el archivo de configuración de envs.ts de orders-microservice!!
- envs.ts

~~~js
import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  
  PRODUCTS_MICROSERVICE_HOST: string;
  PRODUCTS_MICROSERVICE_PORT: number;
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  
  PRODUCTS_MICROSERVICE_HOST: joi.string().required(),
  PRODUCTS_MICROSERVICE_PORT: joi.number().required(),
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
};
~~~

- También creo el archivo /config/services.ts con el token de inyección
- Lo coloco en el archivo de barril

~~~js
export const PRODUCT_SERVICE = 'PRODUCT_SERVICE';
~~~

- En orders-microservice.service necesito hacer la inyección usando **@Inject** pasándole el token de inyección **PRODUCT_SERVICE**
- Constructores de clases derivadas (herencia) deben llamar a **super**

~~~js
import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto';
import { PRODUCT_SERVICE } from 'src/config';
import { firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');

  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {
    super(); //llamo a super
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }
}
~~~

- Estoy en orders-microservice.service
- Con el método create necesito llegar a products con .send si quiero trabajarlo como un Observable
- Si quiero trabajarlo con una **promesa** debo usar **firstValueFrom**
- Coloco todo dentro de un try catch
- Con .map extraigo el arreglo de ids del dto
- Uso el await con firstValueFrom, como parámetro le paso el .send usando el productsClient (el servicio inyectado de PRODUCTS_SERVICE)  
  - Para comunicarme con el método validateProducts le paso en el objeto el cmd con el string validate_products (del MessagePattern) y el arreglo de ids que he sacado haciendo un map del dto.id
- Para calcular el total a pagar hago uso del reducer
  - acc es el acumulador. Uso el createOrderDto porque es donde están las orders con los items (y el precio)
  - Uso el arreglo de products para encontrar los productos que coincidan con los ids de cada orderItem y obtener el precio
  - Retorno el precio * la cantidad en cada orderItem
  - El acumulador empieza en 0
- Uso un reducer también para el total de items
  - Sumo el acumulador a la cantidad de items por orden
- Para crear la orden necesito insertar la orden y los items, ambas inserciones deben ser exitosas
- Esto suele hacerse con una **.$transaction** porque si una falla tengo que hacer un rollback
- Vamos a crearlo todo en una sola orden 
- *NOTA*: el reducer va acumulando en el acumulador el numero de iteraciones y los guarda en acc. 
  - El segundo parámetro del callback es el objeto que voy a iterar. El 0 es el valor inicial del acumulador
  - Por ejemplo:

~~~js
const reducidor = [1,2,3,4,5].reduce((acc, el)=> acc + el, 0)
console.log(reducidor) //Esto devuelve 15

//En la primera iteracion acc vale 0 y el vale 1, 0+1 == 1
//En la segunda acc vale 1 y el 2, 1+2 == 3
//En la tercera acc vale 3 y el 3 == 6
//En la cuarta acc vale 6 y el 4 == 10
//en la quinta acc vale 10 y el 5 == 15 
~~~

~~~js
 async create(createOrderDto: CreateOrderDto) {
    try {
      //1 Confirmar los ids de los productos
      const productIds = createOrderDto.items.map((item) => item.productId); //extraigo los ids en un arreglo


      //llamo al microservicio para validar que existan los productos
      const products: any[] = await firstValueFrom(
        this.productsClient.send({ cmd: 'validate_products' }, productIds),
      );

      //2. Cálculos de los valores                           //en orderItem tengo el precio
      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {

        //necesito encontrar orderItem dentro del arreglo de productos
        //no quiero confiar en el precio del dto, por eso uso el de los productos través del id
        const price = products.find(
          (product) => product.id === orderItem.productId).price;
        return price * orderItem.quantity + acc;
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        return acc + orderItem.quantity; //Si tengo x cantidad, necesito contarlo por cada uno de los elementos del arreglo
      }, 0); //Para la suma de todos los elementos de un arreglo, ene el acc voy guardando la suma de las iteraciones

      //3. Crear una transacción de base de datos
      const order = await this.order.create({
        data: {
          totalAmount: totalAmount,
          totalItems: totalItems,
          OrderItem: {
            createMany: {  //uso createMany
              data: createOrderDto.items.map((orderItem) => ({
                price: products.find(  //no puedo tomar directamente el orderItems.price porque no lo hemos validado, no sabemos si es el correcto
                  (product) => product.id === orderItem.productId, //uso los precios del arreglo de products que viene de la tabla de Products
                ).price,
                productId: orderItem.productId,
                quantity: orderItem.quantity,
              })),
            },
          },
        },
        //que incluya el OrderItem. Si pongo solo OrderItem: true me devuelve todo
        include: {
          OrderItem: {
            select: { //puedo seleccionar los campos que quiero devolver
              price: true,
              quantity: true,
              productId: true,
            },
          },
        },
      });

      return {
        ...order, //me quedo con todo lo de order menos OrderItem, qdel que me aseguro que el nombre coincida con la tabla de products
        OrderItem: order.OrderItem.map((orderItem) => ({
          ...orderItem, //me quedo con todo de orderItem, agrego el nombre de la tabla de Products desde el arreglo de products
          name: products.find((product) => product.id === orderItem.productId).name,
        })),
      };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Check logs',
      });
    }
  }
~~~

- De hecho, podríamos ignorar el precio en OrderItem porque lo vamos a usar de Products
- En findOrderById quiero que aparezca el detalle
------

## Buscar order por Id con su detalle

- Quiero saber el detalle de esa orden y los ids de los productos
- Uso el include para retornar el OrderItem con los campos indicados en el select

~~~js
  async findOne(id: string) {
    const order = await this.order.findFirst({
      where: { id },
      include: {
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            productId: true,
          },
        },
      },
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      });
    }
    const productIds = order.OrderItem.map((orderItem) => orderItem.productId); //extraigo los ids, un arreglo de números
    
    //valido comunicándome con el microservicio de products que los products existan
    //ESTO EN ESTE MOMENTO NO DEBERÍA FALLAR
    const products: any[] = await firstValueFrom(
      this.productsClient.send({ cmd: 'validate_products' }, productIds),
    );

    return {
      ...order, //retorno la order y trabajo con OrderItem
      OrderItem: order.OrderItem.map((orderItem) => ({
        ...orderItem, //retorno orderItem y del arreglo de products validado obtengo el nombre
        name: products.find((product) => product.id === orderItem.productId)
          .name,
      })),
    };
  }
~~~
-----

## Problemas y soluciones

- Esto, organizado así, es muy probable que se salga de control
- Orders está conectado directamente con Products
- En algún momento (cuando implementemos autenticación) orders va a tener que validar un token con el microservicio de auth
- Habría que conectar orders con auth, implica cambios, el cliente-gateway, etc
- Esto va a crear un anidamiento dificil de leer y gestionar
- La solución pasa por un **SERVICE BROKER**, un middleman que se encargue de procesar ese montón de paquetes y pedidos entre los microservicios
- **RabbitM**Q es muy popular. Se crea una cola de procesos y mensajería, es cómo una oficina postal que se va a dedicar a mandar las cartas a los destinatarios, eso queda en el file system y hasta que el destinatario lo confirma no se borra de la cola 
- También se puede, basado en alguna transacción o evento que suceda, notificar a dos o tres microservicios de manera simultanea
- Por ejemplo, si alguien paga una orden: yo quiero notificar a orders que la orden fue pagada, quiero notificar al cliente que el pago se recibió. Son dos cosas independientes relacionadas a microservicios distintos que reaccionan ante un mismo evento
- COn la arquitectura actual, significaría que desde el microservicio de pagos llamar al microservicio de notificaciones y esto sería ineficiente, significa acoplamiento, y si las notificaciones se caen fallan podría hacer fallar el servicio de pagos porque esa parte nos va a fallar
- Podemos mandar un evento desde orders a notificaciones y si lo recibe bien y si no también, pero no tiene mucho sentido
- Por todo esto vamos a implementar una arquitectura diferente, con un servidor de **NATS** que estará en medio del cliente-gateway y mis microservicios
- Vamos a centralizar la comunicación entre microservicios
- NATS server se va a encargar de **notificar a todos los microservicios que les interese un mensaje**
- Esto va a **eliminar la comunicación directa entre microservicios**
- NATS va a crear unos **TOPICS** y estos se notificarán a mis microservicios
  - Cuando se cree una orden, NATS se lo notificará al cliente-gateway
  - Como el cliente-gateway está suscrito a la respuesta de la creación de la orden, va a notificar al cliente
- En la práctica es más fácil trabajar con este servidor de NATS!