# 02- NEST MICROSERVICES - CLIENT-GATEWAY

- Instalo dotenv joi @nestjs/microservices
- Tenemos que crear algo muy parecido al REST API de productos
- Es el cliente quien se va aq conectar al microservicio de productos
- Configuro las variables de entorno (uso el snippet)
- config/envs.ts

~~~js
import 'dotenv/config';

import * as joi from 'joi';

//hago la interfaz
interface EnvVars {
  PORT: number;
  PRODUCTS_MICROSERVICE_HOST: string;
  PRODUCTS_MICROSERVICE_PORT: number;
}

//creo el Schema
const envsSchema = joi.object({
  PORT: joi.number().required(),
  PRODUCTS_MICROSERVICE_HOST: joi.string().required(),
  PRODUCTS_MICROSERVICE_PORT: joi.number().required(),

})
.unknown(true); //para el resto de variables en process.env

//desestructuro el error y value
const { error, value } = envsSchema.validate( process.env );


//si hay algún error lo lanzo
if ( error ) {
  throw new Error(`Config validation error: ${ error.message }`);
}

//guardo el valor en una variable que cumple con la interfaz
const envVars:EnvVars = value;


//exporto las variables en un objeto
export const envs = {
  port: envVars.PORT,
  productsMicroserviceHost: envVars.PRODUCTS_MICROSERVICE_HOST,
  productsMicroservicePort: envVars.PRODUCTS_MICROSERVICE_PORT,
};
~~~

- .env

~~~
PORT=3000


PRODUCTS_MICROSERVICE_HOST=localhost
PRODUCTS_MICROSERVICE_PORT=3001
~~~

- Creemos las rutas

> nest g res products

- El cliente **SI ES UN RESTFULL API**
- No voy a necesitar el servicio
- Pongo a correr el microservicio de products
- Creo la conexión en products.module del CLIENTE_GATEWAY, registro el microservicio en imports

~~~js
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_SERVICE, envs } from 'src/config';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [
    ClientsModule.register([
      
      { 
        name: PRODUCT_SERVICE, //variable en /config/services (injection token) 
        transport: Transport.TCP, //uso el mismo canal de comunicación que usa el microservicio de productos
        options: {
          host: envs.productsMicroserviceHost, //localhost
          port: envs.productsMicroservicePort //3001, el de products-microservice
        }
      },

    ]),
  ]
})
export class ProductsModule {}
~~~

- Fijarse que .register abre un arreglo en el que puedes registrar todos los microservicios que necesites
- En app.module (del client-gateway) solo tengo ProductsModule
- Creo el fichero /config/services.ts donde coloco la variable (o injection token) que va a identificar a el transport que voy a colocar. Viene a ser la definición de mi microservicio

~~~js
export const PRODUCT_SERVICE = 'PRODUCT_SERVICE';
~~~

- Es lo que vamos a necesitar para inyectar el (micro)servicio en los controladores
- Lo guardamos en una variable para no tener problemas de errores con el string
- Creo un archivo de barril en config/index.ts

~~~js
export * from './envs';
export * from './services';
~~~
-----

## Obtener todos los productos

- Si estuviera trabajando las variables de entorno con ConfigModule tendria que usar r .registerAsync() en products.module del gateway, inyectar el ConfigModule... 
- Para conectar con findProducts inyectamos el microservicio de products en el controlador
- client-gateway-products.controller

~~~js
import { ClientProxy} from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}
}
~~~

- En el controlador findAllProducts llamo al microservicio
- Si espero una respuesta uso **.send**
- Si no espero una respuesta uso **.emit**
- Le paso exactamente lo mismo que puse entre paréntesis del @MessagePattern
- En este caso de segundo argumento le paso un objeto vacío
- Es porque está esperando el payload, que en este caso es el paginationDto

~~~js
@Get()
  findAllProducts() {
    return this.productsClient.send(
      { cmd: 'find_all_products' }, {}
    );
  }
~~~

- En products-micro-service.controller

~~~js
@MessagePattern({ cmd: 'find_all_products' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }
~~~

- Los valores del paginationDTo son opcionales
- Para incluir los query parameters que introduzco en la url "products?page=2&limit=10" uso **@Query**
- client-gateway.products.controller

~~~js
@Get()
findAllProducts(@Query() paginationDto: PaginationDto) {
return this.productsClient.send(
    { cmd: 'find_all_products' },
    paginationDto,
);
}
~~~

- Resumiendo:
  - En el products.module del cliente registro el microservicio con **ClientsModule.register** que abre un arreglo
  - Le paso el **token de inyección** que usaré en el controlador para inyectar el microservicio (no es más que una variable que me sirve para identificar el microservicio que estoy registrando en products.module del cliente-gateway), el mismo tipo de transporte que usa dicho microservicio, y dentro de options le paso el puerto del microservicio y el host (en este caso localhost)
  - Inyecto el microservicio en el controlador del cliente usando **@Inject(token de inyección)** y el tipado es client: **ClientProxy**
  - Para comunicarme con el controlador de products y poder usarlo, usaré **.send** si espero una respuesta, y cómo argumento primero el objeto literal que hay en **@MessagePattern** y lo que sea que me pide (**Payload**)
----

## Manejo de excepciones

- Para buscar por id desde el controlador del cliente-gateway debo pasarle el mismo objeto que en el @MessagePattern del servicio de productsy el @Payload, en este caso el id
- Uso con **productsClient: ClientProxy** al que le he inyectado el token de PRODUCT_SERVICE, con **.send** porque espero respuesta
- Este .send es un **Observable** (devuelve un Observable). No es más que **un flujo de información**
- Para escuchar los Observables necesito el **.subscribe()** y mandarle la respuesta y retornarla

~~~js
.subscribe(res=>{
  //return res
})
~~~

- Esa como se trabajan comunmente los Observables
- Estoy lanzando un NotFoundException desde el servicio de products.microservice, pero los errores son atrapados en los RpcException cuando usamos .send y microservicios
- Vamos a crear un ExceptionFilter para atrapar todos los Rpc
- Primero solucionémoslo de manera empírica
- Lo meto en un try catch y uso el .firstValueFrom de rxjs que me permite trabajar como una promesa el Observable
- Le estoy diciendo "espera el primer valor que este Observable va a emitir"
- Puedo usar .pipe con catchError o puedo capturarlo en el catch
-client-gateway.products.controller

~~~js
@Get(':id')
  async findOne(@Param('id') id: string) {
    
    try{      
      const product= await firstValuefrom(
        this.productsClient.send({ cmd: 'find_one_product' }, { id })
      )

      return product

    }catch(error){
      throw new BadRequestException(error)
    }
    
    
  }

~~~

- Pero así no estoy atrapando la RpcException
-----

## ExceptionFilter

- Las excepciones van a estar continuamente manejadas como RpcException, a veces puede que manden un string y no un objeto
- Vamos a hacer que las excepciones siempre sean manejadas como objetos y no solo como strings
- Uso el decorador **@Catch()** y le paso el RpcException de @nestjs/microservices
- Implemento la clase **ExceptionFilter**
- En el metodo **catch** le paso la **RpcException** y el **host: ArgumentsHost**
- Creo el **context** usando el **host** y **.switchToHttp()**
- Obtengo la **response** (la respuesta) con el context **.getResponse()**
- **Guardo el error** usando la RpcException que pasé como parámetro al catch con **.getError()** 
- Si el error es un objeto y contiene status y message **me aseguro de que el status es un número** y si no lo casteo
- **Retorno la response que obtuve del context** con **.status** y **envío el error con .json**
- Si no pasa las validaciones **genero yo la respuesta como un objeto** pasándole **status y messsage**
- **El global exceptionFilter no está disponible en aplicaciones híbridas**
- El exceptionFilter esta **fuera del Exception zone**
- /common/exceptions/roc-custom-exception.filter.ts

~~~js
import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();

    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const status = isNaN(+rpcError.status) ? 400 :+rpcError.status;
      return response.status(status).json(rpcError);
    }

    response.status(400).json({
      status: 400,
      message: rpcError,
    });
  }
}
~~~

- Lo coloco en el main par aplicarlo

~~~js
app.useGlobalFilters(new RpcCustomExceptionFilter())
~~~

- En el controlador del cliente estaba atrapando la excepción con un try catch y mandando un BadRequest
- Si hago un console.log del error no tengo una instancia de RpcException si no un objeto con status y message
- Debo enviar el RpcException para poder mandarlo en la respuesta
- client-gateway.products.controller

~~~js
@Get(':id')
  async findOne(@Param('id') id: string) {
    
    try{      
      const product= await firstValuefrom(
        this.productsClient.send({ cmd: 'find_one_product' }, { id })
      )

      return product

    }catch(error){
      throw new RpcException(error)
    } 
  }
~~~

- En product-microservice.service lanzo el RpcException con el message y el status

~~~js
async findOne(id: number) {
  const product =  await this.product.findFirst({
    where:{ id, available: true }
  });

  if ( !product ) {
    throw new RpcException({ 
      message: `Product with id #${ id } not found`,
      status: HttpStatus.BAD_REQUEST //HttpStatus de @nestjs/common
    });
  }

  return product;

}
~~~

- En el cliente puedo usar .pipe con catchError para atrapar la RpcException que ha pasado por el ExceptionFilter
- .pipe viene en los observables, catchError viene de rxjs
- client-gateway.products.controller

~~~js
@Get(':id')
async findOne(@Param('id') id: string) {
  return this.productsClient.send({ cmd: 'find_one_product' }, { id }).pipe(
    catchError((err) => {
      throw new RpcException(err);
    }),
  );
}
~~~

- Se puede trabajar como Observable con .pipe o como promesa con try catch
---------

## Implementar métodos faltantes

- Creación, borrado y actualizacion en el client-gateway.products.controller

~~~js
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send(
      { cmd: 'create_product' },
      createProductDto,
    );
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send(
      { cmd: 'find_all_products' },
      paginationDto,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );

    // try {

    //   const product = await firstValueFrom(
    //     this.productsClient.send({ cmd: 'find_one_product' },{ id })
    //   );
    //   return product;

    // } catch (error) {
    //   throw new RpcException(error);
    // }
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id: number, //casteo el id
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsClient
      .send(
        { cmd: 'update_product' },
        {
          id,
          ...updateProductDto,
        },
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
~~~

- Paso el servicio de products.microservices

~~~js
import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';

import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  create(createProductDto: CreateProductDto) {
    
    return this.product.create({
      data: createProductDto
    });
    
  }

  async findAll( paginationDto: PaginationDto ) {

    const { page, limit } = paginationDto;

    const totalPages = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil( totalPages / limit );

    return {
      data: await this.product.findMany({
        skip: ( page - 1 ) * limit,
        take: limit,
        where: {
          available: true
        }
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      }
    }
  }

  async findOne(id: number) {
    const product =  await this.product.findFirst({
      where:{ id, available: true }
    });

    if ( !product ) {
      throw new RpcException({ 
        message: `Product with id #${ id } not found`,
        status: HttpStatus.BAD_REQUEST
      });
    }

    return product;

  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: __, ...data } = updateProductDto;


    await this.findOne(id);
    
    return this.product.update({
      where: { id },
      data: data,
    });


  }

  async remove(id: number) {

    await this.findOne(id);
    
    // return this.product.delete({
    //   where: { id }
    // });

    const product = await this.product.update({
      where: { id },
      data: {
        available: false
      }
    });

    return product;


  }
}
~~~

- Paso también el products-microservice.controller

~~~js
import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // @Post()
  @MessagePattern({ cmd: 'create_product' })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'find_all_products' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'find_one_product' })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    // { id: 1
    return this.productsService.findOne(id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'update_product' })
  update(
    // @Param('id', ParseIntPipe) id: number,
    // @Body() updateProductDto: UpdateProductDto,
    @Payload() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  // @Delete(':id')
  @MessagePattern({ cmd: 'delete_product' })
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
~~~

- Resumen de la comunicación:
  - En el products-microservice.controller creo el objeto de @MessagePattern que me servirá para comunicarme con el cliente
  - Le paso al servicio los parámetros que necesita que vendrán del cliente
  - En el cliente inyectando el ClientProxy en el controlador, uso .send y le paso en un objeto el objeto (literal) del MessagePattern
    - Y en otro objeto el Payload del products.microservice.controller (no disponemos de @Params, @Body, etc) con lo que necesita
  - Cuando trabajo con .send trabajo con Observables, para manejar los errores debo usar RpcException
  - Puedo trabajar los Observables como promesas con try catch y async await
- Evidentemente hay más pasos con la conexión, el registro del cliente, etc
- Pero la comunicación viene a ser esa

