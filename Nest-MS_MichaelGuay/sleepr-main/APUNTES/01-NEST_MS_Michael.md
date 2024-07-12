# 01 NEST MICROSERVICES MICHAEL GUAY

## Project Setup

- Instalo el cli si no lo tengo

> npm i -g @nestjs/cli

- Genero un nuevo proyecto. Usaré npm
- 
> nest new sleepr

- Haremos un **monorepo** que compartirá código a través de una librería entre las diferentes aplicaciones
- Genero una librería que añadirá el directorio *libs/common/src/* con el módulo, el servicio, un tsconfig.lib.json y un index


> nest generate library common

- En el tsconfig del proyecto se ha añadido la librería

~~~json
    "paths": {
      "@app/common": [
        "libs/common/src"
      ],
      "@app/common/*": [
        "libs/common/src/*"
      ]
    }
~~~

- En el nest-cli.json se ha añadido la sección projects

~~~json
"projects": {
    "common": {
      "type": "library",
      "root": "libs/common",
      "entryFile": "index",
      "sourceRoot": "libs/common/src",
      "compilerOptions": {
        "tsConfigPath": "libs/common/tsconfig.lib.json"
      }
    }
}
~~~
------

## Database & ConfigModule

- Instalaciones, para la persistencia usaremos Mongo pero podremos intercambiar las Dbs en el futuro
- Usaremos dotenv para las variables de entorno

> npm i @nestjs/mongoose mongoose @nestjs/config

- Generamos un módulo llamado database, con -p especifico el proyecto al que pertenece del objeto "projects" que hay en el nest-cli.json

> nest g mo database -p common

- No necesito el common.module, ni el common.service
- Creamos también el módulo de config de la misma forma

> nest g mo config -p common

- En el imports de config.module importo ConfigModule
- Lo renombro a **NestConfigModule para no tener conflicto**

~~~js
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule} from '@nestjs/config';


@Module({
  imports: [
    NestConfigModule.forRoot({})
  ]
})
export class ConfigModule {}
~~~

- Creo mi propio módulo de ConfigModule porque si queremos cambiar la configuración lo haremos en un solo lugar
- También es una manera de abstaernos de esta dependencia
- Es posible que esto lo llevemos de otra manera en el futuro
- **Usaremos joi** para validar las variables de entorno
- En database.module importamos el MongooseModule

~~~js
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/sleepr') //mejor usar 127.0.0.1 en lugar de localhost para evitar errores
  ],
})
export class DatabaseModule {}
~~~

- Unas lineas más abajo configuraremos las variables de entorno
- En app.module puedo importar la libreria **usando @app/common** como se indica en el tsconfig.lib

~~~js
import {DatabaseModule} from '@app/common'
@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule{}
~~~

- Puedo crear un archivo de barril dentro de la carpeta *libs/common/src/database* desde el que exportar lo que necesite con un index.ts

~~~js
export * from './database.module'
~~~

- Y otro index.ts en src desde el que exportar todo de los módulos que vaya creando

~~~js
export * from './database'
~~~

- Si el servicio de mongo no está corriendo puedo iniciarlo con este comando

> mongod --dbpath=data/db

- Viendo que me conecto a la DB puedo crear un archivo .env en la raíz con la variable de la db de mongo
- .env

~~~
MONGODB_URI=mongodb://127.0.0.1/sleepr
~~~

- Usaré **forRootAsync** en MongooseModule para poder usar **useFactory** e inyectar el **ConfigService** para pasarle la variable de entorno
- Al ser async podrá acceder al ConfigService cuando inicialice el módulo de Mongoose
- **Importo el ConfigModule**, que está exportando el ConfigService
- libs/common/src/database/database.module

~~~js
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService], //necesito inject para que la inyección surja efecto
    }),
  ],
})
export class DatabaseModule {}
~~~

- En config.module **exporto el servicio** (que es una importación de @nestjs/config)
- Los servicios siempre son providers. Los providers no siempre son servicios

~~~js
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService} from '@nestjs/config';


@Module({
  imports: [NestConfigModule.forRoot({})],
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule {}
~~~

- Podemos usar joi para validar las variables de entorno

> npm i joi

- Creo un objeto de Joi y uso validationSchema
- config.module

~~~js
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService} from '@nestjs/config';
import * as Joi from 'joi'

@Module({
  imports: [NestConfigModule.forRoot({
    validationSchema: Joi.object({
      MONGODB_URI: Joi.string().required()
    })
  })],
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule {}
~~~
------

## Abstract Repository

- Creo *lib/common/src/database/***abstract.schema.ts**
- Uso el decorador **@Schema** para el schema de mongoose
- El decorador **@Prop** para la propiedad y dentro de un objeto declaro el type importando **SchemaTypes** de mongoose, de tipo **ObjectId**
- La propiedad será **_id**, porque al ser un documento de mongo llevará el _id. Importo **Types** (también de mongoose) para tiparlo como **ObjectId**
- Los decoradores son de **@nestjs/mongoose**, el tipado de mongoose

~~~js
import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export class AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
}
~~~

- En el mismo directorio creo **abstract.repository.ts**
- Será una clase abstracta que nos asegurará no tener que repetir código en nuestras aplicaciones
- La tiparemos con un genérico que llamaremos TDocument que **extenderá** **de AbstractDocument**, porque al ser de mongoose llevará el **_id**
- Uso **protected** para que las clases subsiguientes no puedan acceder a ellos

~~~js
import { Logger} from '@nestjs/common';
import { Model, Types} from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

                          //omito el id
  async create(document: Omit<TDocument, '_id'>): Promise<TDocument>{

    //creo una nueva instancia de la entidad con el modelo que he inyectado
    const createdModel = new this.model({
      ...document, //esparzo con el spread
      _id: new Types.ObjectId() //creo un nuevo id usando Types de mongoose
    })      //retorno el salvado del documento con await ya que interactuo con la DB
            //Lo parseo a JSON. Debo tiparlo primero as unknown para poderlo tipar a TDocument
    return (await createDocument.save()).toJSON() as unknown as TDocument
  }
}
~~~

- Para implementar el método para encontrar una sola entidad (findOne) usaremos FilterQuery de mongoose
- Le paso el TDocument, así me aseguro que solo filtraremos cualquiera de las propiedades de TDocument con filterQuery
- Uso el **lean en true** para quitarle todas esas propiedades verbosas internas de mongoose del documento
- Puedo tiparlo como TDocument
- Si no encuentra un documento uso el logger para mostrar el error, le paso el parámetro por el cual no ha encontrado nada

~~~js
async findOne(filterQuery: FilterQuery<TDocument>)Promise<TDocument>{
  const document= await this.model
    .findOne(filterQuery)
    .lean<TDocument>(true)

  if(!document) {
    this.logger.warn("The document was not found with filterQuery", filterQuery)
    throw new NotFoundException('Document qwas not found')
  }

  return document

}
~~~

- Hagamos el update. También usaremos filterQuery

