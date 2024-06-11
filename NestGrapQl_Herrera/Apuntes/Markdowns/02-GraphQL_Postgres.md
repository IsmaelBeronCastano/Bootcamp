# 02 Nest GraphQL  - AnyList (Postgres)

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
- *NOTA*: para ver la dfocumentacion acudir a **docker hub** y buscar postgres

~~~yml
version: '3'


services:
  db:
    image: postgres:14.4
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
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
DB_PORT=5432
DB_USERNAME=postgres
~~~

- Uso docker compose. Tiene que estar docker corriendo ( si ya tienes la imagen es rápido)

> docker compose up 