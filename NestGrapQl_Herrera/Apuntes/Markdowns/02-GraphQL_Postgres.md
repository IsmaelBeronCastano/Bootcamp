# 02 Nest GraphQL  - AnyList (Postgres)

- Actualización del código

> npm i @nestjs/apollo @nestjs/common @nestjs/config @nestjs/core @nestjs/graphql @nestjs/platform-express @nestjs/typeorm apollo-server-core apollo-server-express class-transformer class-validator graphql typeorm pg  

- Harermos un CRUD que impacte una DB con graphQL
- Todavía no hay autenticación ni paginación
- Necesito un Schema con al menos un query para poder levantar el server con graphQL
- Para la DB usaremos typeorm
- Si lleva la palabra module es que va en los imports
- En app.module

~~~js
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

import { ItemsModule } from './items/items.module';


@Module({
  imports: [

    ConfigModule.forRoot(),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // debug: false,
      playground: true,
      autoSchemaFile: join( process.cwd(), 'src/schema.gql'), 
      plugins: [
        //ApolloServerPluginLandingPageLocalDefault
      ]
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),

    ItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
~~~

- En el main uso GlobalPipes para las validaciones

~~~js
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true, 
    })
  );

  await app.listen(3000);
}
bootstrap();
~~~

- Creo un CRUD completo con **nest g res items**
  - Le indico GraphQL (code first)
  - Le digo que SI genere los endpoints (en este caso)
- Esto me crea la entidad con @ObjectType, el @InputTyoe para el updateItem, en el módulo me puso el ItemResolver y el ItemService en los providers, entre otras cosas...
- Al tener el resolver automáticamente crea el schema.gql necesario para echar a andar el server
-----

## Docker - Levantar base de datos

- docker-compose.yml
- *NOTA*: para ver la dfocumentacion acudir a **docker hub** y buscar postgres. Uso el puerto 5434 porque el 5432 cesta ocupado
- Si no encuentra la DB y está levantada en Docker, con el user y password correctos, cambia el puerto!

~~~yml
services:
  db:
    image: postgres:14.4
    restart: always
    ports:
      - "5434:5432"
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USERNAME: ${DB_USERNAME}
    container_name: anylistDB
    volumes:
      - ./postgres:/var/lib/postgresql/data
~~~

- Defino las .env

~~~
STATE=dev

DB_PASSWORD=123456
DB_NAME=AnyList
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=postgres
~~~


- Uso docker compose. Tiene que estar docker corriendo ( si ya tienes la imagen es rápido)

> docker compose up -d

- -d es detouch (desacoplado de la terminal)
- Debe estar el ConfigModule.onRoot() en app.module para usar las variables de entorno
----

## Item Entity


- src/items/entities/item.entity
- Combino los decoradores de typeorm y graphql

~~~js
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  
  @PrimaryGeneratedColumn('uuid') //el tipo de id será uuid
  @Field( () => ID )
  id: string;

  @Column()
  @Field( () => String )
  name: string;

  @Column()
  @Field( () => Float )
  quantity: number;

  @Column({ nullable: true })
  @Field( () => String, { nullable: true } ) //al ser opcional puede ser null
  quantityUnits?: string; // g, ml, kg, tsp

  // stores
  // user
}
~~~

- En el imports de items.module importo la entidad

~~~js
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { Item } from './entities/item.entity';

@Module({
  providers: [
    ItemsResolver, 
    ItemsService
  ],
  imports: [
    TypeOrmModule.forFeature([ Item ])
  ]
})
export class ItemsModule {}
~~~
----

## Crear items - Servicio y dtos

- Por ahora vamos a crear los usuarios sin autenticación. Más adelante se hará todo el módulo de autenticación
- items/dtos
- create-item.dto

~~~js
import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  
  @Field( () => String )
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field( () => Float )
  @IsPositive()
  quantity: number;
  
  @Field( () => String, { nullable: true })
  @IsString()
  @IsOptional()
  quantityUnits?: string;

}
~~~

- updateItem.dto

~~~js
import { CreateItemInput } from './create-item.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  
  @Field(() => ID)
  @IsUUID()
  id: string;

}
~~~

- item.service
- Uso @InjectRepository de @nestjs/typeorm y le paso la entidad.
- Uso **Repository** de typeorm y le paso de tipo la entidad
- Los métodos son async al trabajar con una DB
- Al ser async devuelven una promesa. Especifico el tipo
- El servicio llama al repositorio que he inyectado para interactuar con la DB

~~~js
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository( Item )
    private readonly itemsRepository: Repository<Item>,

  ) {}


  async create( createItemInput: CreateItemInput ): Promise<Item> {
    const newItem = this.itemsRepository.create( createItemInput )
    return await this.itemsRepository.save( newItem );
  }

  async findAll(): Promise<Item[]> {
    // TODO: filtrar, paginar, por usuario...
    return this.itemsRepository.find();
  }

  async findOne( id: string ): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ id })

    if ( !item ) throw new NotFoundException(`Item with id: ${ id } not found`);

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    
    const item = await this.itemsRepository.preload( updateItemInput );

    if ( !item ) throw new NotFoundException(`Item with id: ${ id } not found`);

    return this.itemsRepository.save( item );

  }

  async remove( id: string ):Promise<Item> {
    // TODO: soft delete, integridad referencial
    const item = await this.findOne( id );
    await this.itemsRepository.remove( item );
    return { ...item, id };
  }
}
~~~

- Deberíamos crear un índice para que cada usuario solo pueda subir un item con el mismo nombre
- Que Fernando pudiera subir un item llamado uvas, que Melissa también, pero solo una vez
- Para crear la peticiópn, que sería POST en una PAI REST uso mutation (no query!)
- Hago la mutation desde el playground o Apollo Server
- Veamos en el resolver como está construido el create

~~~js
@Mutation(() => Item) //la Mutation retorna un item
async createItem(
  @Args('createItemInput') createItemInput: CreateItemInput //como argumento le paso el createItemInput
): Promise<Item> { //al ser async devuelve una promesa de tipo Item
  return this.itemsService.create(createItemInput); //llamo al servicio
}
~~~

- La query sería así

~~~js
mutation CreateItem($createItemInput: CreateItemInput!){
  createItem(createItemInput: $createItemInput){
    id
    name
    quantity
    quantityUnits
  }
}
~~~

- En el apartado variables (en otra terminal abajo de la query) creo el json con el objeto createItemInput

~~~json
{
  "createItemInput": {
    "name": "Cervezas",
    "quantity": 1 
  } 
}
~~~

- El create devuelve esto

~~~json
{
  "data": {
    "createItem": {
      "id": "6b5f010e-233a-4858-9944-b50196ca64de",
      "name": "Cervezas",
      "quantity": 1,
      "quantityUnits": null
    }
  }
}
~~~

- En la query en items.resolver de findAll retorno una promesa de tipo arreglo de Item 

~~~js
@Query(() => [Item], { name: 'items' })
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }
~~~

- En la query de findAll, solo necesito pasarle items y los campos a devolver, ya que en el resolver llamé a la query items 

~~~js
{
  items{
    id
    name
    quantity
    quantityUnits
  }
}
~~~

- En el findOne recibimos el id de tipo string. En el resolver será de tipo ID y usaremos el pipe para validarlo
- Es un string al fin y al cabo

~~~js
@Query(() => Item, { name: 'item' }) //llamaré item en la query
async findOne(
  @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string
): Promise<Item> {
  return this.itemsService.findOne(id);
}
~~~

- En el servicio busco por el id, si no lo encuentra devuelvo una excepción

~~~js
async findOne( id: string ): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ id })

    if ( !item ) throw new NotFoundException(`Item with id: ${ id } not found`);

    return item;
  }
~~~

- En la query le paso el id de tipo ID 
- En la query puedo nombrar la variable que le paso a item como quiera, pero en item tengo que llamarla igual que la nombré en el resolver
- Luego le paso la variable que declaré en la query

~~~js
                //aquí puedo llamarla como quiera
query QueryItem($idDelItem: ID!){
      //aqui tengo que llamarla igual que en el resolver
 item(id: $idDelItem){
    id
    name
    quantity
    quantityUnits
  
  }
}
~~~

- En el apartado de variables (abajo, en otra terminal del playground) le paso el id en un json
- Aquí tengo que pasarle el nombre de la variable de la query

~~~json
{
	"idDelItem": "6b5f010e-233a-4858-9944-b50196ca64de"
}
~~~

- La respuesta me devuelve un json con el objeto data 

~~~json
{
  "data": {
    "item": {
      "id": "6b5f010e-233a-4858-9944-b50196ca64de",
      "name": "Cervezas",
      "quantity": 1,
      "quantityUnits": null
    }
  }
}
~~~

- Actualizar un item
- En el resolver le paso el dto de updateItem con el id y los campos actualizar
- Por supuesto es una mUtation ya que vamos a cambiar data

~~~js
@Mutation(() => Item)
updateItem(
  @Args('updateItemInput') updateItemInput: UpdateItemInput
):Promise<Item> {
  return this.itemsService.update( updateItemInput.id, updateItemInput ); //le paso el id que viene en el dto y el dto
}
~~~

- En el servicio uso .preload
- También podría usar el findOne para buscar y luego actualizar, pero .preload buscará por el id que viene en el dto y lo actualizará

~~~js
async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
  
  const item = await this.itemsRepository.preload( updateItemInput ); //preload busca por el id y carga la entidad (como viene el id lo buscará)

  if ( !item ) throw new NotFoundException(`Item with id: ${ id } not found`);

  return this.itemsRepository.save( item );// si lo ha encontrado lo salvo

}
~~~

- Para eliminar, en el resolver recojo el id
- También es una mutation, claro

~~~js
@Mutation(() => Item)
removeItem(
  @Args('id', { type: () => ID }) id: string
): Promise<Item> {
  return this.itemsService.remove(id);
}
~~~

- En el service uso el findOne para encontrarlo y validar que exista, luego lo elimino
- Se buscará hacer un borrado lógico, dónde no se pierda la integridad referencial. Algo como active: false

~~~js
async remove( id: string ):Promise<Item> {
  // TODO: soft delete
  const item = await this.findOne( id );
  await this.itemsRepository.remove( item );
  return { ...item, id };
}
~~~

