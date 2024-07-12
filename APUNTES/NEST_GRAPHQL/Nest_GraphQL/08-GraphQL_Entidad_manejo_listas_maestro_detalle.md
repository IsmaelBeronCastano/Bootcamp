# Nest GraphQL - Entidad para el manejo de listas Maestro Detalle

- Creo el módulo Lists y armo el lists.resolver
- lists.resolver

~~~js

import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';

import { ListsService } from './lists.service';
import { ListItemService } from './../list-item/list-item.service';

import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';

import { List } from './entities/list.entity';
import { ListItem } from './../list-item/entities/list-item.entity';
import { User } from './../users/entities/user.entity';

import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { PaginationArgs, SearchArgs } from './../common/dto/args';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';

@Resolver(() => List)
@UseGuards( JwtAuthGuard )
export class ListsResolver {

  constructor(
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemService
  ) {}

  @Mutation(() => List)
  async createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user: User
  ):Promise<List> {
    return this.listsService.create( createListInput, user );
  }

  @Query(() => [List], { name: 'lists' })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ):Promise<List[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs );
  }

  @Query(() => List, { name: 'list' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listsService.findOne( id, user );
  }

  @Mutation(() => List)
  updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listsService.update(updateListInput.id, updateListInput, user );
  }

  @Mutation(() => List)
  removeList(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User
  ) {
    return this.listsService.remove( id, user );
  }

  @ResolveField( () => [ListItem], { name: 'items' } )
  async getListItems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<ListItem[]> {

    return this.listItemsService.findAll( list, paginationArgs, searchArgs );
  }

  @ResolveField( () => Number, { name: 'totalItems' } )
  async countListItemsByList(
    @Parent() list: List,
  ): Promise<number> {
    return this.listItemsService.countListItemsByList( list );
  }

}
~~~

- create-list.input

~~~js
import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateListInput {

  @Field(() => String )
  @IsString()
  @IsNotEmpty()
  name: string;

}
~~~

- update-list.input

~~~js
import { CreateListItemInput } from './create-list-item.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateListItemInput extends PartialType(CreateListItemInput) {
  
  @Field(() => ID )
  @IsUUID()
  id: string;

}
~~~

- Necesitaré también el list-items. Creo el módulo (GraphQl Code first).
- En lists.module importo el listItemModule para usar el servicio. Exporto el TypeOrmModule opara inyectar su repositorio en otro módulo

~~~js
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';

import { ListItemModule } from './../list-item/list-item.module';

import { List } from './entities/list.entity';

@Module({
  providers: [ListsResolver, ListsService],
  imports: [
    TypeOrmModule.forFeature([ List ]),
    ListItemModule,
  ],
  exports: [
    TypeOrmModule,
    ListsService,    
  ]
})
export class ListsModule {}
~~~

- Para inyectar los servicios debo importa también los módulos en el list-item.module y exportar los servicios en los otros módulos

~~~js
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common'
;
import { ListItem } from './entities/list-item.entity';

import { ListItemService } from './list-item.service';
import { ListItemResolver } from './list-item.resolver';

@Module({
  providers: [ListItemResolver, ListItemService],
  imports: [
    TypeOrmModule.forFeature([ ListItem ])
  ],
  exports: [
    ListItemService, TypeOrmModule
  ]
})
export class ListItemModule {}
~~~ 

- Este es el resolver de list-item
- list-item.resolver

~~~js
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards, ParseUUIDPipe } from '@nestjs/common';

import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';

import { ListItemService } from './list-item.service';
import { ListItem } from './entities/list-item.entity';

import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';

@Resolver(() => ListItem)
@UseGuards( JwtAuthGuard )
export class ListItemResolver {
  
  constructor(private readonly listItemService: ListItemService) {}

  @Mutation(() => ListItem)
  createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
    //! Todo pueden pedir el usuario para validarlo
  ): Promise<ListItem> {
    return this.listItemService.create(createListItemInput);
  }

  // @Query(() => [ListItem], { name: 'listItem' })
  // findAll() {
  //   return this.listItemService.findAll();
  // }

  @Query( () => ListItem, { name: 'listItem' })
  async findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe ) id: string 
  ): Promise<ListItem> {
    return this.listItemService.findOne(id);
  }

  @Mutation(() => ListItem)
  async updateListItem(
    @Args('updateListItemInput') updateListItemInput: UpdateListItemInput
  ): Promise<ListItem> {
    return this.listItemService.update( updateListItemInput.id, updateListItemInput );
  }

  // @Mutation(() => ListItem)
  // removeListItem(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemService.remove(id);
  // }
}
~~~
- La entidad de Lists es esta
- list.entity

~~~js
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ListItem } from './../../list-item/entities/list-item.entity';
import { User } from './../../users/entities/user.entity';

@Entity({ name: 'lists' })
@ObjectType()
export class List {
  
  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID )
  id: string;

  @Column()
  @Field( () => String )
  name: string;

  // Relación, index('userId-list-index')
  @ManyToOne( () => User, (user) => user.lists, { nullable: false, lazy: true  })
  @Index('userId-list-index')
  @Field( () => User )
  user: User;

  @OneToMany( () => ListItem, (listItem) => listItem.list, { lazy: true })
  // @Field( () => [ListItem] )
  listItem: ListItem[];
  
}
~~~

- La entity de list-item
- Un constrain es una regla de validación.
- Necesitamos el ListId para poder insertar un ListItem

~~~js
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Item } from './../../items/entities/item.entity';
import { List } from './../../lists/entities/list.entity';

@Entity('listItems')
@Unique('listItem-item', ['list','item']) //los constrains son reglas de validación para la DB, primero se añade la entidad y luego el decorador
@ObjectType()
export class ListItem {

  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID )
  id: string;

  @Column({ type: 'numeric' })
  @Field( () => Number )
  quantity: number;

  @Column({ type: 'boolean' })
  @Field( () => Boolean )
  completed: boolean;


  // Relaciones
  @ManyToOne( () => List, (list) => list.listItem, { lazy: true })
  @Field( () => List )
  list: List;

  @ManyToOne( () => Item, (item)=> item.listItem, { lazy: true })
  @Field( () => Item )
  item: Item;

}
~~~

- El servicio de list
- list.service

~~~js
import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { List } from './entities/list.entity';
import { User } from './../users/entities/user.entity';

import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class ListsService {

  constructor(
    @InjectRepository( List )
    private readonly listsRepository: Repository<List>
  ) {}

  async create(createListInput: CreateListInput, user: User ): Promise<List> {
    
    const newList = this.listsRepository.create({ ...createListInput, user })
    return await this.listsRepository.save( newList );

  }

  async findAll( user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<List[]> {

    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    
    const queryBuilder = this.listsRepository.createQueryBuilder()
      .take( limit )
      .skip( offset )
      .where(`"userId" = :userId`, { userId: user.id });

    if ( search ) {
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${ search.toLowerCase() }%` });
    }

    return queryBuilder.getMany();
  }

  async findOne( id: string, user: User ): Promise<List> {

    const list = await this.listsRepository.findOneBy({ 
      id,
      user: { id: user.id }
    });

    if ( !list ) throw new NotFoundException(`List with id: ${ id } not found`);

    return list;
  }

  async update(id: string, updateListInput: UpdateListInput, user: User ): Promise<List> {
    
    await this.findOne( id, user );

    const list = await this.listsRepository.preload({ ...updateListInput, user });

    if ( !list ) throw new NotFoundException(`List with id: ${ id } not found`);

    return this.listsRepository.save( list );

  }

  async remove(id: string, user: User ): Promise<List> {
     
     const list = await this.findOne( id, user );
     await this.listsRepository.remove( list );
     return { ...list, id };
  }

  async listCountByUser( user: User ): Promise<number> {
    
    return this.listsRepository.count({
      where: {
        user: { id: user.id }
      }
    });

  }

}
~~~

- El servicio de list-item

~~~js
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { List } from './../lists/entities/list.entity';
import { ListItem } from './entities/list-item.entity';

import { PaginationArgs, SearchArgs } from './../common/dto/args';

import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';

@Injectable()
export class ListItemService {

  constructor(
    
    @InjectRepository( ListItem )
    private readonly listItemsRepository: Repository<ListItem>,

  ) {}


  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {

    const { itemId, listId, ...rest } = createListItemInput;
    
    const newListItem = this.listItemsRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId }
    });

    await this.listItemsRepository.save( newListItem );

    return this.findOne( newListItem.id );
  }

  async findAll( list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<ListItem[]> {

    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    
    const queryBuilder = this.listItemsRepository.createQueryBuilder('listItem') // <-- Nombre para las relaciones
      .innerJoin('listItem.item','item') // <--- Lo añadí después, fue un problema que no grabé
      .take( limit )
      .skip( offset )
      .where(`"listId" = :listId`, { listId: list.id });

    if ( search ) {
      queryBuilder.andWhere('LOWER(item.name) like :name', { name: `%${ search.toLowerCase() }%` });
    }

    return queryBuilder.getMany();

  }

  async countListItemsByList( list: List ): Promise<number> {
    return this.listItemsRepository.count({
      where: { list: { id: list.id }}
    });
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.listItemsRepository.findOneBy({ id });

    if ( !listItem ) throw new NotFoundException(`List item with id ${ id } not found`);

    return listItem;
  }

  async update(
    id: string, updateListItemInput: UpdateListItemInput
  ): Promise<ListItem> {

    const { listId, itemId, ...rest } = updateListItemInput;

    const queryBuilder = this.listItemsRepository.createQueryBuilder()
      .update()
      .set( rest )
      .where('id = :id', { id });

    if ( listId ) queryBuilder.set({ list: { id: listId } });
    if ( itemId ) queryBuilder.set({ item: { id: itemId } });

    await queryBuilder.execute();

    return this.findOne( id );

  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
~~~ 

- create-list-item.input

~~~js
import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {

  @Field( () => Number, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity: number = 0;

  @Field( () => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;

  @Field( () => ID )
  @IsUUID()
  listId: string;

  @Field( () => ID )
  @IsUUID()
  itemId: string;
}
~~~

- update-list-item.input

~~~js
import { CreateListItemInput } from './create-list-item.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateListItemInput extends PartialType(CreateListItemInput) {
  
  @Field(() => ID )
  @IsUUID()
  id: string;

}
~~~
------

# Dockerizar

- El objetivo de dockerizar la aplicación es tener la imagen lista para correr como si estuviera instalada
- Se puede hacer mediante un docker-compose.yml o un Dockerfile
- Vamos a tomar un linux, instalar Linux, instalar los paquetes de la aplicación, el build...
- Vamos a usar un gist de Fernando dónde tiene lo necesario para construir imágenes de Node
- docker-compose.prod.yml

~~~yml
version: '3'


services: 
  db:
    image: postgres:14.4
    restart: always
    ports:
      - "${DB_PORT}:${DB_PORT}"
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    container_name: anylistDB
    volumes:
      - ./postgres:/var/lib/postgresql/data

  anylistapp:
    depends_on:
      - db
    build: 
      context: .
      dockerfile: Dockerfile  # le indico el Dockerfile para el build
    image: nest-graphql
    container_name: AnylistApp
    restart: always # reiniciar el contenedor si se detiene
    ports:
      - "${PORT}:${PORT}"

    environment:
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: ${DB_NAME}
      DB_HOST: ${DB_HOST}
      DB_PORT: ${DB_PORT}
      DB_USERNAME: ${DB_USERNAME}
      JWT_SECRET: ${JWT_SECRET}
      PORT: ${PORT}
~~~

- DockerFile

~~~Dockerfile
# Install dependencies only when needed
# usamos la imagen de node de 5MB y le ponemos el nombre de deps
FROM node:18-alpine3.15 AS deps  
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# libc6-compat es para ciertos paquetes/procedimientos internos (opcional)
RUN apk add --no-cache libc6-compat
# trabajaremos en este directorio . Cualquier path relativo va a ser en este directorio
WORKDIR /app 

# copiamos el json de nuestro proyecto
COPY package.json yarn.lock ./
# congelamos el yarn-lock
RUN yarn install --frozen-lockfile


# Build the app with cache dependencies contenedor solo para construir la aplicación
# otro FROm es otra etapa
FROM node:18-alpine3.15 AS builder
# trabajamos en /app
WORKDIR /app
# desde deps instalamos en el path app/node_modules los node-modules 
COPY --from=deps /app/node_modules ./node_modules
# una vez copiados los modulos de node, le digo que copie todo lo que se encuentra en nuestro proyecto
# hay que hacer algo para evitar que copie literalmente todo lo que hay en el proyecto, porque eso no me interesa
# nop quiero que copie dist, los módulos de node por lo que creo un .dockerignore
COPY . . 
# ejecuto el build
RUN yarn build


# Production image, copy all the files and run next
# usamos una nueva imagen de node limpia
FROM node:18-alpine3.15 AS runner

# Set working directory
# le indico el directorio
WORKDIR /usr/src/app

# copio el pckage.json y el yarn.lock y lo pegamos en el working directory
COPY package.json yarn.lock ./
# ejecuto el yarn install
RUN yarn install --prod
# copio  desde la imagen builder (anterior) el /app/dist en el directorio ./dist
COPY --from=builder /app/dist ./dist

# el comando para levantarlo (tambien se podria usar nest start)
CMD [ "node","dist/main" ]
~~~

- .dockerignore
~~~
dist/
node_modules/
postgres/

.git/
~~~

- Usaremos libc6-compat  como librería para Node
- El Dockerfile esta dividio en tres etapas
  - Instalación de dependencias
  - Un contenedor solamente para construir la aplicación
  - El runner que hará correr la aplicación que es lo que terminamos ejecutando
- De esta manera, si no tenemos cambios en nuestras dependencias es una construcción mucho más rápida
- Para construir uso el markdown de BUILD
## Build
docker-compose -f docker-compose.prod.yml --env-file .env.prod up --build

## Run
docker-compose -f docker-compose.prod.yml --env-file .env.prod up

## Nota
Por defecto, __docker-compose__ usa el archivo ```.env```, por lo que si tienen el archivo .env y lo configuran con sus variables de entorno de producción, bastaría con
```
docker-compose -f docker-compose.prod.yml up --build
```

## Cambiar nombre
```
docker tag <nombre app> <usuario docker hub>/<nombre repositorio>
```
Ingresar a Docker Hub
```
docker login
```

Subir imagen
```
docker push <usuario docker hub>/<nombre repositorio>
```
