# 01- NEST MICROSERVICIOS - Gateway y Manejo de Errores

- El primer microservicio lo trabajaremos con SQLite (productos)
- products/entities/product.entity

~~~js
export class Product {


  public id: number;

  public name: string;

  public price: number;

}
~~~

- Hay que instalar class-validator y class-transformer
- También hay que configurarlo en el main

~~~js
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
~~~

- products/dtos/create-product.dto

~~~js
import { Type } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {

  @IsString()
  public name: string;

  @IsNumber({
    maxDecimalPlaces: 4, //máximo de decimales
  })
  @Min(0)
  @Type(() => Number ) //lo casteo a número
  public price: number;

}
~~~
-----

## Configurar variables de entorno

- Instalo dotenv y joi
- /config/envs.ts

~~~js
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  DATABASE_URL: joi.string().required(),
})
.unknown(true); //hay muchas más variables de entorno flotando en mi aplicación (el path de node, etc)


//hago la validación extrayendo los valores con desestructuración
const { error, value } = envsSchema.validate( process.env );


if ( error ) {
  throw new Error(`Config validation error: ${ error.message }`);
}

//En enVars de tipo Envars (interface) guardo los valores que desestructuré del Schema 
const envVars:EnvVars = value;

//Exporto las variables en un objeto
export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
}
~~~

- Es recomendable crear un snippet con este código (usar easySnippet)
- Creo el .env y el .env.template 

~~~
PORT=3001
DATABASE_URL="file:./dev.db"
~~~

- Uso las variables donde corresponde (en el main, uso await app.listen(envs.port) )
- Cuando configuremos el microservicio lo pondremos **en otro lugar**
------

## Prisma SQLite

- Instalo prisma como dependencia de desarrollo (prisma crea un cliente)
- Para inciar prisma

> npx prisma init

- Produjo una cadena de conexión para postgres en .env
- Lo borro y coloco la de SqLite

~~~
DATABASE_URL="file:./dev.db"
~~~

- En schema.prisma (instalar extensión de sintaxis de prisma)
- Luce como js (o ts) pero no lo es! Es sintaxis propia de prisma

~~~js
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"  //La db!!
  url      = env("DATABASE_URL") //le paso la variable de entorno
}

model Product {
  id    Int    @id @default(autoincrement()) //Agrego un id autoincrementado, el Int va a ser el identificador de id (@id)
  name  String
  price Float

  available Boolean @default(true)

  createdAt DateTime @default(now()) //uso now para usar la fecha del momento
  updatedAt DateTime @updatedAt

  @@index([available]) //indexo avaliable para que no aparezcan en las búsquedas
}
~~~

- Ejecuto la migración

> npx prisma migrate dev --name init

- Me crea la db 
- Instalo el @prisma/client
- Voy al servicio y lo extiendo de PrismaCLient e implementaré OnModuleInit

~~~js
@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
    
    onModuleInit() {
    this.$connect();  //Database connected!!
  }
}
~~~

- Ya podemos empezar a trabajar con la DB
- Puedo crear un logger para mejorar los logs

~~~js
@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService'); //creo un logger con el cabezal de ProductsService

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected'); //mejoro el log!
  }
}
~~~

- También lo uso en el main de la misma forma

~~~js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('Main');

  //const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    //AppModule,
    //{
      //transport: Transport.TCP,
      //options: {
        //port: envs.port
      //}
    //}
  //);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();
  logger.log(`Products Microservice running on port ${ envs.port }`); //el logger!

}
bootstrap();
~~~
-----

## Insertar y comprobar la DB

- createdAt ya tioene un valor por defecto
- Creo el método create en el servicio
- Es this.product porque la clase (el servicio) extiende de PrismaClient y el modelo se llama Product
- Uso el método create para insertar. regresa una promesa con el registro insertado
- El producto espera un name y un price 

~~~js
create(createProductDto: CreateProductDto) {

return this.product.create({
    data: createProductDto
});

}
~~~

-  Para ver la DB puedo usar Abrir con.. "TablePlus"
-  Para añadir data en Table PLus crear la nueva conexión con SQLite e importar el archivo desde la interfaz
------

## Obtener productos y paginarlos

- Creo el dto de paginación en common/dto/pagination.dto
- Hago ambos opcionales y casteo el tipo a number
- Les pongo valores por defecto

~~~js
import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

}
~~~

- En el servicio

~~~js
async findAll( paginationDto: PaginationDto ) {

    const { page, limit } = paginationDto;

    const totalProducts = await this.product.count({ where: { available: true } }); //para contar los productos disponibles
    const lastPage = Math.ceil( totalProducts / limit ); //divido el total de páginas (número de productos disponibles) por el limite
                                                     //.ceil redondea al siguiente número positivo 

    return {
      data: await this.product.findMany({
        //skip = 0 * (limit = 10) = 0 primera posición del arreglo páginas tengo 1,2,3
        //si estoy en la página 2 = (2-1) == 1 * limit ===10, skip 10 registros

        skip: ( page - 1 ) * limit,
        take: limit,
        where: {
          available: true //listo los que están disponibles
        }
      }),
      //meta de metadata
      meta: {
        total: totalProducts, //el resultado de .count de la cantidad de productos disponibles
        page: page,
        lastPage: lastPage, //el total de páginas en el documento
      }
    }
  }
~~~
----

## Retornar producto por id

~~~js
async findOne(id: number) {
    const product =  await this.product.findFirst({
      where:{ id, available: true }
    });

    if ( !product ) {
      throw new BadRequestException(`No hay ningún producto con el id ${id}`);
    }

    return product;

  }
~~~
-----

## Actualizar

- El dto
- Uso PATCH /:id

~~~js
  async update(id: number, updateProductDto: UpdateProductDto) {

    await this.findOne(id);
    
    return this.product.update({
      where: { id },
      data: updateProductDto,
    });
  }
~~~
--- 

## Eliminación

- Por lo general no voy a querer borrar un producto porque no sé que microservicios pueden tener relaciones con ese producto
- Esto podría generar una serie de errores en cascada
- Hago un borrado lógico. Cambio el avaliable a false

~~~js
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
~~~
----

## Transformar a microservicio

- Instalo @nestjs/microservices
- Para crear el microservicio, en el main creo app con NestFactory
- Le mando el AppModule y el objeto de configuración


~~~js
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('Main');


const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    
    AppModule,
    {
      transport: Transport.TCP, //Elijo que tipo de transporte quiero usar
      options: {
        port: envs.port
      }
    }
  );
}
~~~

- Puedo usar **app.startAllMicroservices()** para inciar todos los microservicios
- En este momento esto haría mi aplicación híbrida entre REST y microservicios (**ES COMPATIBLE**)
- Pero yo no quiero que esto sea un híbrido por lo que no usaré este comando
- Si te fijas en consola ya no aparacen los endpoints GET POST PATCH DELETE que se habían incializado
- Ya no estamos escuchando peticiones HTTP en ese puerto (pese a que ahi está el microservicio)
- Para comunicarnos tenemos los **eventos** y la **mensajería**
- *@MessagePattern* es "**te envío la pelota, regrésame la pelota con la información, ya puedo seguir con mi tarea**"
- *@EventPattern* es "**yo te mando el evento, y lo que suceda ahí ya es cosa tuya a mi me importa poco, sigo con mi vida**"
- En el controlador

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
  @MessagePattern({ cmd: 'create_product' }) //lo que hay en cmd es el string que me servirá para comunicar los microservicios
  create(@Payload() createProductDto: CreateProductDto) { //en el Payload está la información
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
  remove(@Payload('id', ParseIntPipe) id: number) { //puedo usar el ParseIntPipe con el id del payload!!
    return this.productsService.remove(id);
  }
}
~~~

- Para la actualización ya no tengo **@Params**, viene todo en el **@Payload**
- Modifico esto, hago un dto para el update

~~~js
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsPositive } from 'class-validator';

                                      //PartialType hace todas las propiedades del dto padre opcionales
export class UpdateProductDto extends PartialType(CreateProductDto) {

  @IsNumber()
  @IsPositive()
  id: number;

}
~~~

- Cambio el método en el servicio

~~~js
async update(id: number, updateProductDto: UpdateProductDto) {

    //ya tengo el id en id:updateProduct.id desde el controlador en la variable id
    //extraigo la data y le quito el id pq no me interesa
    const { id: __, ...data } = updateProductDto; //el id lo renombro a guión bajo pq no me interesa


    await this.findOne(id);
    
    return this.product.update({
      where: { id },
      data: data,
    });
  }
~~~

- Cuando el microservicio A quiera comunicarse con el microservicio B va a tener que usar el mismo objeto **{cmd:'lo que sea'}**
- Ahora uso **@Payload** para la información
- **Podría mantener el @POST o el @GET si fuera un híbrido**, iniciando desde el main con **.startAllMicroservices**
- Esto será útil con la autenticación, ya que puede ser una API propia o un microservicio
- No tengo porqué mandar el mensaje como un cmd:"string", puedo colocar solo un string, pero el standard es el objeto con cmd
  - **Ya está el microservicio implementado. Cómo lo vamos a probar?**
  - **Lo vamos a probar mediante un GATEWAY, va a ser el punto intermedio. Crearemos un API REST donde mis clientes se van a conectar y este GATEWAY se va a encargar de comunicarse mediante los microservicios usando TCP**
-------

## Github Organization

- Podemos crear una organización para agrupar todos los microservicios
- En Github Your Organizations /New Organization / Free Organization
- No invito a nadie (skip this step)
- Creo un nuevo repo
----