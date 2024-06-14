# 05 Nest GraphQL - Items + Usuarios: Peticiones autenticadas 

- No vamos a trabajar estando pidiendo el id del usuario
- Trabajaremos basándonos en el dueño/a del token
- Más adelante haremos paginación
- No voy a poder crear items si no se a que usuario pertenece
- Me interesa poder diferenciar estos artículos porque podemos tener cientos de usuarios y algunos el mismo artículo
- Por eso necesito saber de quien es el articulo de manera indexada
- De momento el app.module se queda igual
- app.module

~~~js
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [

    ConfigModule.forRoot(),

    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ AuthModule ],
      inject: [ JwtService ],
      useFactory: async( jwtService: JwtService ) => ({
        playground: true,
        autoSchemaFile: join( process.cwd(), 'src/schema.gql'), 
        plugins: [
          //ApolloServerPluginLandingPageLocalDefault
        ],
        context({ req }) {
          // const token = req.headers.authorization?.replace('Bearer ','');
          // if ( !token ) throw Error('Token needed');

          // const payload = jwtService.decode( token );
          // if ( !payload ) throw Error('Token not valid');
          
        }
      })
    }),

    // TODO: configuración básica
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   // debug: false,
    //   playground: false,
    //   autoSchemaFile: join( process.cwd(), 'src/schema.gql'), 
    //   plugins: [
    //     ApolloServerPluginLandingPageLocalDefault
    //   ]
    // }),

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

    UsersModule,

    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
~~~

- En la entidad de Item debo establecer la relación con los usuarios
- Si fuera una relación uno a uno significaría que solo tenemos 1 item relacionado con 1 usuario
- Muchos a uno significa que muchos artículos pueden estar asociados a una persona
- De uno a muchos significaría que un item puede tener muchos usuarios.
- **Tiene más sentido que muchos items pertenece a un usuario**
- Indico con qué entidad me voy a relacionar, y defino que campo es el que voy a usar para establecer la relación 
- Pongo user.items (que todavía no existe)
- Indico que lo quiero indexado con **@Index** y le paso el nombre del campo
- Debo indicarle el campo a GraphQL con **@Field** y le indico que va a retornar algo de tipo User
- El nullable en true dice que puede ser nulo, y el lazy en true me sirve como el eager para poder traer la info en la query usadno un queryBuilder
- item.entity

~~~js
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './../../users/entities/user.entity';


@Entity({ name: 'items' })
@ObjectType()
export class Item {
  
  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID )
  id: string;

  @Column()
  @Field( () => String )
  name: string;

  // @Column()
  // @Field( () => Float )
  // quantity: number;

  @Column({ nullable: true })
  @Field( () => String, { nullable: true } )
  quantityUnits?: string; // g, ml, kg, tsp

  // stores
  // user
  @ManyToOne( () => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('userId-index')
  @Field( () => User )
  user: User;

}
~~~

- Debo establecer el campo y la relación en user.entity
- Yo debo saber el usuario propietario de este item
- Del lado del usuario, un usuario puede tener muchos items
  
~~~js
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Item } from './../../items/entities/item.entity';


@Entity({ name: 'users' })
@ObjectType()
export class User {
  
  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID )
  id: string;

  @Column()
  @Field( () => String )
  fullName: string;

  @Column({ unique: true })
  @Field( () => String )
  email: string;

  @Column()
  // @Field( () => String )
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  @Field( () => [String] )
  roles: string[]

  @Column({
    type: 'boolean',
    default: true
  })
  @Field( () => Boolean )
  isActive: boolean;
  
  @ManyToOne( () => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field( () => User, { nullable: true })
  lastUpdateBy?: User;

  //Aqui tengo la relación de uno a muchos con item!
  @OneToMany( () => Item, (item) => item.user, { lazy: true })
  @Field( () => [Item] )
  items: Item[];

}
~~~

- 