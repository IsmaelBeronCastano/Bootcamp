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
- Como puede ser que tenga miles de items y quiero consultarlo de una manera rápida
- Esto añade un índice para que cuando haga una consulta, sabe que voy a usar este campo para hacer la solicitud e ir más rápido
- Se pueden crear índice únicos cvon unique: true
- Se pueden hacer índices compuestos, usando dos o más columnas de la db. Es sencillo y cómodo con typeorm

~~~js
@Index(["firstName", "lastName"], {unique:true})
~~~

- Debo indicarle el campo a GraphQL con **@Field** y le indico que va a retornar algo de tipo User
- El nullable en true dice que puede ser nulo, y el lazy en true me sirve como el eager para poder traer la info en la query desde apollo
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

   @Column()
   @Field( () => Float )
   quantity: number;


  @ManyToOne( () => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('userId-index')
  @Field( () => User )
  user: User;

}
~~~

- Debo establecer el campo y la relación en user.entity
- Yo debo saber el usuario propietario de este item
- Del lado del usuario, un usuario puede tener muchos items
-** En el primer argumento le indico con una función de flecha con qué se va a relacionar**
- **En el segundo establezco la relación con el campo de la entidad, y le añado en un objeto las opciones**
- Si en este objeto no le digo que es nullable, **siempre va a tener un valor**
- Debo indicar el Field con el tipo para gql
- Coloco Item entre llaves cuadradas porque va a ser un arreglo
- No lo pongo opcional porque siempre voy a tener un valor, si quisiera eso podría devolver un arreglo vacío, pero no es el caso
  
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
                  //el lazy está en true para poder cargar la info desde la query de user con items anidados
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

- Vamos a tener ciertos problemas porque hemos hecho modificaciones tanto en la parte de usuarios como en la parte de itemsw
- Cuando pedíamos un item, en la parte de los dto/inputs, para crear un item le pedíamso la cantidad
- Ya no se la vamos a pedir, no es parte del item la cantidad
- Si la cantidad de uniddades!

~~~js
import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  
  @Field( () => String )
  @IsNotEmpty()
  @IsString()
  name: string;

  // @Field( () => Float )
  // @IsPositive()
  // quantity: number;
  
  @Field( () => String, { nullable: true })
  @IsString()
  @IsOptional()
  quantityUnits?: string;
}
~~~

- En la entity item, ya no tengo quantity y debo agregar las unidades

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

  // este campo de userId nunca debe de ser nulo, siempre debo poder asociar el item a un usuario
  @ManyToOne( () => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('userId-index')
  @Field( () => User )
  user: User;
}
~~~
----

## CreateItem

- Miremos la query del items.resolver
- Ahora createItemInput solo me pide el name y quantityUnits
- Tengo que estar autenticado para hacer uso de ella!!
- El user llega al resolver a través de lo que hicimos con JwtAuthGuard y @CurrentUser usando el @UseGuards a nivel de resolver
- Para trabajar con items no necesito ser admin ni super-user, si estar logueado siendo user por default es suficiente
- Lo único que debo añadir al createItemInput es el user, por lo que desestructuro el createItemInput para esparcirlo (ya que el user no viene en él) y le paso el user

~~~js
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';

import { ItemsService } from './items.service';

import { Item } from './entities/item.entity';
import { User } from './../users/entities/user.entity';

import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Item)
@UseGuards( JwtAuthGuard )
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, { name: 'createItem' })
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() user: User
  ): Promise<Item> {
    return this.itemsService.create( createItemInput, user );
  }

 
}
~~~

- Puedo hacer una mutation y pedir toda la información del user (email, fullName) porque es @CurrentUser quien se encarga de pasarlo a la request
- Echémosle un ojo a auth/decorators/CurrentUser

~~~js
import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { ValidRoles } from '../enums/valid-roles.enum';



export const CurrentUser = createParamDecorator( 
    ( roles: ValidRoles[] = [], context: ExecutionContext  ) => {


        const ctx = GqlExecutionContext.create( context );
        const user: User = ctx.getContext().req.user; 

        if ( !user ) {
            throw new InternalServerErrorException(`No user inside the request - make sure that we used the AuthGuard`);
        }

        if ( roles.length === 0 ) return user;

        for ( const role of user.roles ) {
          
            if ( roles.includes( role as ValidRoles ) ) {
                return user; //aquí lo establecemos en la request
            }
        }

        throw new ForbiddenException(
            `User ${ user.fullName } need a valid role [${ roles }]`
        )

})
~~~

- En el items.service

~~~js
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
***
import { User } from './../users/entities/user.entity';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository( Item )
    private readonly itemsRepository: Repository<Item>,

  ) {}


  async create( createItemInput: CreateItemInput, user: User ): Promise<Item> {

    const newItem = this.itemsRepository.create({ ...createItemInput, user })
    return await this.itemsRepository.save( newItem );
  }

}
~~~

- Para **findAll** en items.resolver

~~~js
@Query(() => [Item], { name: 'items' })
async findAll(
  @CurrentUser() user: User
): Promise<Item[]> {
  return this.itemsService.findAll( user );
}
~~~

- En el items.service busco los items que pertenecen al usuario
- Uso el where para establecer la condición y le digo que el id de user es el user.id

~~~js
async findAll( user: User ): Promise<Item[]> {
  // TODO: filtrar, paginar, por usuario...
  return this.itemsRepository.find({
    where: {
      user: {
        id: user.id
      }
    }
  });
}
~~~

- Para **findOne** y **removeItem**
- No deberíamos poder borrar un item que sea parte de una lista o si se borra un item borrar la lista (luego lo veremos)
- En el remove todavía no he hecho el borrado lógico (soft delete), ya se hará 

~~~js
@Query(() => Item, { name: 'item' })
async findOne(
  @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
  @CurrentUser() user: User
): Promise<Item> {
  return this.itemsService.findOne(id, user );
}

@Mutation(() => Item)
removeItem(
  @Args('id', { type: () => ID }) id: string,
  @CurrentUser() user: User
): Promise<Item> {
  return this.itemsService.remove(id, user);
}
~~~

- En el items.service para el findOne le paso el id, y el id del user

~~~js
 async findOne( id: string, user: User ): Promise<Item> {

    const item = await this.itemsRepository.findOneBy({ 
      id,          //de esta manera tienen que cumplirse las dos condiciones
      user: {
        id: user.id  //también podría usar el andwhere
      }
    });

    if ( !item ) throw new NotFoundException(`Item with id: ${ id } not found`);

    // item.user = user;

    return item;
  }

  async remove( id: string, user: User ):Promise<Item> {

    // TODO: soft delete, integridad referencial
    const item = await this.findOne( id, user );
    await this.itemsRepository.remove( item );
    return { ...item, id };
  }
~~~

- Puedo traerme la información del user cuando hago la query desde apollo, porque tengo el lazy en true desde la entidad
- En **updateItem** de items.resolver

~~~js
@Mutation(() => Item)
updateItem(
  @Args('updateItemInput') updateItemInput: UpdateItemInput,
  @CurrentUser() user: User
):Promise<Item> {
  return this.itemsService.update( updateItemInput.id, updateItemInput, user );
}
~~~

- En items.service, uso findOne, que lanzará unba excepción si no encuentra el item por el id de ese usuario
- Si el flujo del código continua, es que tengo el item, con lo cual le paso el updateItemInput
- Con el preload no puedo establecer el where ni nada, pero si le paso los campos hace la búsqueda automáticamente
- Uso .save para salvar los cambios

~~~js
async update(id: string, updateItemInput: UpdateItemInput, user: User ): Promise<Item> {
  
  await this.findOne( id, user );
  //? const item = await this.itemsRepository.preload({ ...updateItemInput, user }); si no usara el lazy en true podría hacerlo así
  const item = await this.itemsRepository.preload( updateItemInput );

  if ( !item ) throw new NotFoundException(`Item with id: ${ id } not found`);

  return this.itemsRepository.save( item ); //salvo el item!

}
~~~

- El dto sigue igual

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

- Podría crear consultas para hacer la paginación, buscar el más caro de los productos, todo en un solo query
- Los querys pueden ser muy grandes en graphQL
- Por ejemplo

~~~js
{
  items(to:0, limit:120){
    name
  }
  items(to:120, limit:220){
    name
  }
  //buscar el más caro
  //hacer excepciones
  //etc
}
~~~
-----

## Items por usuario

- Tiene sentido que cree un itemCount desde los users para poder medir cuantos items quiero mostrar, ya que el usuario podría tener miles y eso podría ser demasiado pesado
- No tenemos paginaciones todavía
- En la entidad le coloco el lazy en la relación cOneToMany con los items, algo que deberemos deshabilitar después

~~~js
@OneToMany( () => Item, (item) => item.user, { lazy: true })
@Field( () => [Item] )
items: Item[];
~~~
------

## ResolveField con información del padre

- Para poder limitar el numero de items puedo crear un itemCount
- Sabiendo el usuario sería un simple SELECT * la_tabla WHERE user.id == USER
- Cómo lo quiero agregar a la query de usuarios, tiene sentido colocarlo en el users.resolver
- Con **@ResolveField** estoy modificando mi esquema diciéndole que voy a tener un nuevo campo, y **este es el método que va a usarse en este campo cuando sea solicitado**
- **@Parent** nos permite tener acceso a la información del padre (User)
- users.resolver

~~~js
@ResolveField( () => Int, { name: 'itemCount' })
async itemCount(
  @CurrentUser([ ValidRoles.admin ]) adminUser: User,
  @Parent() user: User
): Promise<number> {
  return this.itemsService.itemCountByUser( user )
}
~~~

- Este resolveField está amarrado a mi usuario, si voy a la definición de Usuario en DOCS del Schema voy a tener itemCount
- En cualquier punto que tenga acceso al usuario puedo saber el itemCount
- Tiene más sentido que el conteo de los items esté en itemsService
- Uso el método count

~~~js
async itemCountByUser( user: User ): Promise<number> {
  
  return this.itemsRepository.count({
    where: {
      user: {
        id: user.id
      }
    }
  })

}
~~~

- Para poder inyectar itemsService en users.resolver debo exponerllo en el módulo de items e imporarlo en el de users
- En items.module exporto el servicio

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
  ],
  exports: [
    ItemsService,
    TypeOrmModule,
  ]
})
export class ItemsModule {}
~~~

- En users.module importo el módulo 
- Si quisiera inyectar el repositorio debería importar el TypeOrmModule

~~~js
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ItemsModule } from './../items/items.module';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [
    TypeOrmModule.forFeature([ User ]),
    ItemsModule,
  ],
  exports: [
    // TypeOrmModule, si quisiera inyectar el repositorio
    UsersService
  ]
})
export class UsersModule {}
~~~