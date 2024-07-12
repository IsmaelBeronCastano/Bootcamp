# 04 Nest GraphQL - Usuarios y Enums

- Tengo este docker-compose.yml

~~~yml
version: '3'


services:
  db:
    image: postgres:14.4
    restart: always
    ports:
      - "5434:5432"
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    container_name: anylistDB
    volumes:
      - ./postgres:/var/lib/postgresql/data
~~~

- Con este .env

~~~
STATE=dev
DB_PASSWORD=123456
DB_NAME=AnyList
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=postgres

JWT_SECRET=Cambia_esto
~~~

- Antes de iniciar el server correr Docker y ejecutar 

> docker compose up -d

- El main sigue igual

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

- Este es mi app.module
- Si en lugar de Apollo Studio voy a usar el playground, coloco el playground en true y comento ApolloServerPluginLandingPageLocalDefault
- He importado el AuthModule y he inyectado el JwtService para inyectarlko en el useFactory y usarlo como servicio, por lo que ahora si coloco el forRoot() al ConfigModule
- Con el useFactory tengo el context desde donde puedo extraer la request
- Puedo comprobar si tengo el token y decodificarlo
- De esta manera puedo bloquear el schema con la autenticación

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

    //esta configuración es para bloquear el schema a través de autenticación JWT
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ AuthModule ],
      inject: [ JwtService ],
      useFactory: async( jwtService: JwtService ) => ({
        playground: false,
        autoSchemaFile: join( process.cwd(), 'src/schema.gql'), 
        plugins: [
          ApolloServerPluginLandingPageLocalDefault
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

- Los enumTypes en GraphQl funcionan ingual que en TypeScript
- Registro el enum con la función registerEnumType de nestjs/graphql para poder usarlo como tipo de dato GraphQL
- src/auth/enums/valid-roles.enum

~~~js
import { registerEnumType } from "@nestjs/graphql";

//aqui es un enum de typescript
export enum ValidRoles {
    admin     = 'admin', 
    user      = 'user',  
    superUser = 'superUser'
}

//aqui hago el enum un tipo de GraphQL
registerEnumType( ValidRoles, { name: 'ValidRoles', description: 'Fiesta en tu casa a las 3' } )
~~~

- Creo el @ArgsType para pasarle los roles que me interesa devolver en el findAll
- Uso @IsArray
- Puede ser nulo
- user/dto/args/roles.args

~~~js
import { ArgsType, Field } from '@nestjs/graphql';
import { IsArray } from 'class-validator';
import { ValidRoles } from '../../../auth/enums/valid-roles.enum';

@ArgsType()
export class ValidRolesArgs {
                  //para poder colocar el enum aqui como tipo de dato debo haberlo registrado con registerEnumType
    @Field( () => [ValidRoles], { nullable: true })
    @IsArray()
    roles: ValidRoles[] = [] //declararlo como un arreglo vacío por defecto indica que por defecto será nulo
        

}
~~~

- El users.resolver queda así
- El Resolver devuelve siempre algo de tipo User
- **Coloco el @UseGuards a nivel de Resolver y le paso el JwtAuthGuard**
- En **findAll** como argumento le paso el tipo que he creado ValidRolesArg
  - En el custom decorator @CurrentUser le digo que solo pueden acceder a la ruta admin y superUser
  - @CurrentUser user devolverá un user de tipo User
  - El método findAll devolverá una promesa de tipo arreglo de User
  - En el servicio crearé un QueryBuilder para recorrer los roles y sacar los usuarios (explicado más adelante)
- En el updateUser y blockUser necesito pasarle también el user 
- En updateUser lo necesito para el campo lastUpdateBy
- En blockUser para colocarle el isActive en false

~~~js
import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './dto/args/roles.arg';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Resolver(() => User)
@UseGuards( JwtAuthGuard )
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  
  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser ]) user: User
  ):Promise<User[]> {

    const users = await this.usersService.findAll( validRoles.roles );
    console.log(users);
    return this.usersService.findAll( validRoles.roles );
  }

  @Query(() => User, { name: 'user' })
  findOne( 
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser ]) user: User
  ): Promise<User> {
    
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin ]) user: User
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user );
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser( 
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser([ ValidRoles.admin ]) user: User
  ): Promise<User> {
    return this.usersService.block(id, user );
  }
}

~~~

- El users.service

~~~js
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


import { User } from './entities/user.entity';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRoles } from './../auth/enums/valid-roles.enum';

import { SignupInput } from './../auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UsersService {

  private logger: Logger = new Logger('UsersService')


  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}


  async create( signupInput: SignupInput ): Promise<User> {
    
    try {

        const newUser = this.usersRepository.create({
          ...signupInput,
          password: bcrypt.hashSync( signupInput.password, 10 )
        });

        return await this.usersRepository.save( newUser );

    } catch (error) {
      this.handleDBErrors( error );
    }

  }

  
  async findAll( roles: ValidRoles[] ): Promise<User[]> {

    if ( roles.length === 0 ) 
      return this.usersRepository.find({
        // TODO: No es necesario porque tenemos lazy la propiedad lastUpdateBy
        // relations: {
        //   lastUpdateBy: true
        // }
      });

    // ??? tenemos roles ['admin','superUser']
    return this.usersRepository.createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles )
      .getMany();

  
  }

  async findOneByEmail( email: string ): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException(`${ email } not found`);
      // this.handleDBErrors({
      //   code: 'error-001',
      //   detail: `${ email } not found`
      // });
    }
  }

  async findOneById( id: string ): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${ id } not found`);
    }
  }

  async update(
    id: string, 
    updateUserInput: UpdateUserInput,
    updateBy: User
  ): Promise<User> {

    try {
      const user = await this.usersRepository.preload({
        ...updateUserInput,
        id
      });

      user.lastUpdateBy = updateBy;

      return await this.usersRepository.save( user );

    } catch (error) {
      this.handleDBErrors( error );
    }
    
    
  }

  async block( id: string, adminUser: User ): Promise<User> {
    
    const userToBlock = await this.findOneById( id );

    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;

    return await this.usersRepository.save( userToBlock );

  }


  private handleDBErrors( error: any ): never {

    
    if (  error.code === '23505' ) {
      throw new BadRequestException( error.detail.replace('Key ','') );
    }

    if ( error.code == 'error-001' ) {
      throw new BadRequestException( error.detail.replace('Key ','') );
    }
    
    this.logger.error( error );

    throw new InternalServerErrorException('Please check server logs');

  }

}
~~~

- En la user.entity creo una relación @ManyToOne de User a lastUpdateBy en el campo lastUpdateBy que es opcional
- Le digo que puede ser nulo y coloco el lazy en true
- Le coloco @JoinColumn y le paso el name en un objeto 
- Le digo que es de tipo User

~~~js
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  
  //TODO: relaciones
  @ManyToOne( () => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field( () => User, { nullable: true })
  lastUpdateBy?: User;

}
~~~

- Añado los campos opcionales al dto de updateUSer, ambos pueden ser nulos

~~~js
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsOptional, IsUUID } from 'class-validator';

import { CreateUserInput } from './create-user.input';
import { ValidRoles } from './../../auth/enums/valid-roles.enum';


@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field( () => [ValidRoles], { nullable: true })
  @IsArray()
  @IsOptional()
  roles?: ValidRoles[];

  @Field( () => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

}
~~~

- Para hacer el query de findAll debo estar logeado
- Primero creo el usuario y le pido que me devuelva el fullName y el token

~~~js
mutation CreateUser($signUp: SignupInput!){
  signup(signupInput: $signUp){
    user{
      fullName
    }
    token
  }
}
~~~

- En las variables le paso los valores a $signUp

~~~json
{
  "signUp": {
    "email": "miguel@gmail.com",
    "fullName": "Miguel",
    "password": "123456"
  }
}
~~~

- Me devuelve el objeto data

~~~json
{
  "data": {
    "signup": {
      "user": {
        "fullName": "Miguel"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM3MjVlNDU1LTdhY2EtNDBlNi1hY2M1LTE0ZjYxM2YwOGMxZiIsImlhdCI6MTcxODI2NTQxMywiZXhwIjoxNzE4Mjc5ODEzfQ.eNt7pTns8-1U8eHupL3mz0pKV6yEDDNhXcrNoh6qYJE"
    }
  }
}
~~~

- Copio el token y hago el login pasándole en HTTP HEADERS el "Authorization": "Bearer token_aqui"

~~~js
mutation LoginUser($loginInput: LoginInput!){
  login(loginInput: $loginInput){
    user{
      fullName
    }
    token
  }
}
~~~

- En las variables le paso a la variable loginInput el email y password

~~~json
{
  "loginInput": {
    "email": "miguel@gmail.com",
    "password": "123456"
  }
}
~~~

- En HTTP HEADERS le paso el token del signup

~~~json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM3MjVlNDU1LTdhY2EtNDBlNi1hY2M1LTE0ZjYxM2YwOGMxZiIsImlhdCI6MTcxODI2NTQxMywiZXhwIjoxNzE4Mjc5ODEzfQ.eNt7pTns8-1U8eHupL3mz0pKV6yEDDNhXcrNoh6qYJE"
}
~~~

- Esto me devuelve el objeto data con los campos que le solicité (fullName y el token)

~~~json
{
  "data": {
    "login": {
      "user": {
        "fullName": "Miguel"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM3MjVlNDU1LTdhY2EtNDBlNi1hY2M1LTE0ZjYxM2YwOGMxZiIsImlhdCI6MTcxODI2NTc5OSwiZXhwIjoxNzE4MjgwMTk5fQ.QeDFAdelsK_tWb35kTSz1UbtQf_lAXypvA7LralbpRo"
    }
  }
}
~~~
- Ya puedo usar el token para acceder a los endpoints
- Ahora tengo el role user por defecto, habrá endpoints a los que no podré acceder, creo otro usuario con role admin y nombre admin
- Le cambio el role desde TablePlus
- Para hacer la query, le paso el argumento roles y le pido que me devuelva aquellos que sean user

~~~js
query Users{
  users(roles: user ){
    fullName
  }
}
~~~

- En HTTP HEADERS le coloco el token extraido del login de un usuario al que le he cambiado el role desde TablePlus a admin

~~~json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MGJlZjkwLTQzMGUtNDdmZS1iYThkLTc5OGI4N2YwZjAxOCIsImlhdCI6MTcxODI2NjA2NCwiZXhwIjoxNzE4MjgwNDY0fQ.uv3-yWS-l5LPtaXksK2cbLKG5m7XHTpiEcLtnDJ4q-U"
}
~~~

- Si miro el tipo ValidRolesArg que he creado con @ArgsType y he colocado en el query findAll, tiene un campo llamado role
- Por eso no ha hecho falta colocar el argumento como string entre los paréntesis de @Args() validRoles: ValidRolesArg en el query del resolver, ya que he declarado el tipo y este ya incluye role
- Para hacer la consulta

~~~js
query Users{
  users(roles: user ){
    fullName
  }
}
~~~

- Me devuelve esto

~~~json
{
  "data": {
    "users": [
      {
        "fullName": "Miguel"
      }
    ]
  }
}
~~~

- Miremos el users.service, creo el queryBuilder
- Podría usar el where. Usando andWhere todos los andWhere que vengan detrás **se tienen que cumplir**
- Le indico que busque en un ARRAY según la documentación para hacer querys sobre arreglos

~~~
'ARRAY[nombre_del_arreglo_en_la_DB]'
~~~

- Le indico con && (agrego otra condición, debe de estar mi argumento que lo indico con :) y esparzo roles con el spread ...

~~~
'ARRAY[roles] && '[:...roles]'
~~~

- Le estoy diciendo que el arreglo que le voy a mandar de roles como parámetro, al menos uno tiene que hacer match con la tabla de roles
- Por eso uso :...roles. : Para indicar que es un parámetro que introduzco desde fuera (como en los endpoints /:id) y ...roles para esparcir el arreglo en caso de mandar más de un role como parámetro
- Uso setParameter para establecer este parámetro de :roles que he indicado en el andWhere
- También ayuda a escapar caracteres especiales, evitar inyecciones de querys, etc
- El primer 'roles' es el nombre que le puse al parametro :...roles. El segundo parámetro roles es el valor que le estoy pasando como parámetro a findAll(roles) <--- este roles
- Uso getMany para obtener varios resultados

~~~js
async findAll( roles: ValidRoles[] ): Promise<User[]> {

  if ( roles.length === 0 ) 
    return this.usersRepository.find()

  //necesito tener el role de admin o superuser
  return this.usersRepository.createQueryBuilder()
    .andWhere('ARRAY[roles] && ARRAY[:...roles]')
    .setParameter('roles', roles )
    .getMany();
}
~~~

- Para poder acceder a findAll necesito ser admin o superuser

~~~js
@Query(() => [User], { name: 'users' })
async findAll(
  @Args() validRoles: ValidRolesArgs,
  @CurrentUser([ValidRoles.admin, ValidRoles.superUser ]) user: User
):Promise<User[]> {

  //const users = await this.usersService.findAll( validRoles.roles );
  //console.log(users);
  return this.usersService.findAll( validRoles.roles );
}
~~~

- **findOne**
- user.resolver
- Es un query porque solo queremos traer data, no vamos a impactar la DB

~~~js
@Query(() => User, { name: 'user' })
findOne( 
  @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
  @CurrentUser([ValidRoles.admin, ValidRoles.superUser ]) user: User
): Promise<User> {
  
  return this.usersService.findOneById(id);
}
~~~

- En el users.service uso el findOnByOrFail en un try catch por si lanza el error atraparlo con el catch
- Por eso lo de 'OrFail'

~~~js
async findOneById( id: string ): Promise<User> {
  try {
    return await this.usersRepository.findOneByOrFail({ id });
  } catch (error) {
    throw new NotFoundException(`${ id } not found`);
  }
}


//el findOneByEmail es igual, lo usaremos en otros lugares
async findOneByEmail( email: string ): Promise<User> {
  try {
    return await this.usersRepository.findOneByOrFail({ email });
  } catch (error) {
    throw new NotFoundException(`${ email } not found`);
    // this.handleDBErrors({
    //   code: 'error-001',
    //   detail: `${ email } not found`
    // });
  }
}
~~~

- Para hacer la query debo ser admin o superuser
- Le pido que me devuelva el fullName, el email y el role
~~~js
query User($id: ID!){
  user(id: $id ){
    fullName
    email
    roles
  }
}
~~~

- Le paso un token de algun usuario con role admin
- En variables le paso el id

~~~json
{
  "id": "c725e455-7aca-40e6-acc5-14f613f08c1f"
}
~~~

- Me devuelve esto

~~~json
{
  "data": {
    "user": {
      "fullName": "Miguel",
      "email": "miguel@gmail.com",
      "roles": [
        "user"
      ]
    }
  }
}
~~~
----

## Bloquear un usuario - ManyToOne

- Para bloquear un usuario voy a cambiar el estado de activo a false. Eso sería muy sencillo
- Con objetivos didácticos crearemos una nueva columna en la tabla de usuarios llamada lastUpdatedBy
- Nos dirá quien fue la última persona que hizo un cambio en esta tabla
- Esto nos servirá para aprender la relación ManyToOne
- Debe hacerlo un admin, le paso el id, lo valido con el UUIDPipe para asegurarme de que sea un UUID
- user.resolver

~~~js
@Mutation(() => User, { name: 'blockUser' })
blockUser( 
  @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
  @CurrentUser([ ValidRoles.admin ]) user: User
): Promise<User> {
  return this.usersService.block(id, user );
}
~~~

- Para añadir la relación ManyToOne en la entidad
- ManyToOne porque el mismo usuario puede estar en muchas actualizaciones, muchas personas y se van a relacionar con una 

~~~js
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
              //User (el ObjectType), como se va a relacionar user con lastUpdateBy
  @ManyToOne( () => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true }) //lazy es para que cargue la relación
  @JoinColumn({ name: 'lastUpdateBy' }) //para que typeorm cargue la información de este campo, 
                                        //uso el name para ponerle mi nombre personalizado a la columna en la tabla
  @Field( () => User, { nullable: true }) //hay que indicarle a graphQL que tipo de dato va a tener con Field
  lastUpdateBy?: User;

}
~~~

- En el users.service

~~~js
async block( id: string, adminUser: User ): Promise<User> {
  
  const userToBlock = await this.findOneById( id );

  userToBlock.isActive = false;
  userToBlock.lastUpdateBy = adminUser;

  return await this.usersRepository.save( userToBlock );

}
~~~

- Para obtener el lastUpdateBy yo podría hacer esto, pero esto me sigue regresando valores null ya que entra en el array con el queryBuilder

~~~js
async findAll( roles: ValidRoles[] ): Promise<User[]> {

  if ( roles.length === 0 ) 
    return this.usersRepository.find({
    relations: {
     lastUpdatebY: true
  }});

  //necesito tener el role de admin o superuser
  return this.usersRepository.createQueryBuilder()
    .andWhere('ARRAY[roles] && ARRAY[:...roles]')
    .setParameter('roles', roles )
    .getMany();
}
~~~

- El eager en true funciona (excepto en el query builder) para cargar la relación
- Puedo usar el **lazy en true**, es una forma de decirle cuando se cargue, carga esto también

~~~js
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
              //User (el ObjectType), como se va a relacionar user con lastUpdateBy
  @ManyToOne( () => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true }) //lazy es para que cargue la relación
  @JoinColumn({ name: 'lastUpdateBy' })                                               //ya que el eager en true no funciona con el queryBuilder
  lastUpdateBy?: User;                                                                //que es lo que tengo en el findAll

}
~~~

- Entonces no es necesario añadir al find la relación para que la cargue porque usamos el lazy en la relación desde la entidad

~~~js
async findAll( roles: ValidRoles[] ): Promise<User[]> {

  if ( roles.length === 0 ) 
    return this.usersRepository.find({
      // TODO: No es necesario porque tenemos lazy la propiedad lastUpdateBy
      // relations: {
      //   lastUpdateBy: true
      // }
    });

  // ??? tenemos roles ['admin','superUser']
  return this.usersRepository.createQueryBuilder()
    .andWhere('ARRAY[roles] && ARRAY[:...roles]')
    .setParameter('roles', roles )
    .getMany();


}
~~~
-----

## Update

- Hagamos una mutation en el users.resolver
- Solo el admin puede acceder
- Le paso el id, el dto y el user al servicio
~~~js
  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin ]) user: User
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user );
  }
~~~

- Recordemos el dto
- Es un @InputType para graphQL ya que lo recibo del body de la petición
- Extiendo la clase con Partial (lo que indica que todos los parámetros son opcionales) de CreateUserDto
- Coloco el id como obligatorio y los otros dos opcionales
- Uso los decoradores para validar

~~~js
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsOptional, IsUUID } from 'class-validator';

import { CreateUserInput } from './create-user.input';
import { ValidRoles } from './../../auth/enums/valid-roles.enum';


@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field( () => [ValidRoles], { nullable: true })
  @IsArray()
  @IsOptional()
  roles?: ValidRoles[];

  @Field( () => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

}
~~~

- En el users.service guardo en user usando el repositorio con el método preload y esparzo el dto, para pasarle el id y el body
- preload si no lo encuentra mandará el error al catch
- Actualizo el lastUpdateBY
- Salvo los cambios

~~~js
  async update(
    id: string, 
    updateUserInput: UpdateUserInput,
    updateBy: User
  ): Promise<User> {

    try {
      const user = await this.usersRepository.preload({
        ...updateUserInput,
        id
      });

      user.lastUpdateBy = updateBy;

      return await this.usersRepository.save( user );

    } catch (error) {
      this.handleDBErrors( error );
    } 
  }
~~~
------

## Bloquear GQLSchema

- signup y login no tienen que estar protegidos, porque si no no podríamos ingresar
- Usualmente se crean en un REST API, y el token generado desde ahi se usa para el schema
- Si el usuario no está autenticado con un token válido no va a poder acceder a los endpoints
- Lo que voy a hacer es bloquear la manera en la que el schema se obtiene mcon el JwtService
- Uso **forRootAsync**. El driver es obligatorio. 
- Importo el AuthModule donde tengo el JwtService
- Inyecto el JwtService
- Uso el useFactory para inyectar el JwtService
- Le indico el playground en true porque lo quiero usar desde el navegador para hacer las consultas en localhost:3000/graphql
- Le indico el path del schema de graphQL
- Si uso el ApolloPlugin... el playground debe de estar en false, y entonces usar Apollo Studio
- En el useFactory tengo el context, que trae la información de mi schema, del que puedo desestructurar la req
- **Si no dejo un espacio después de Bearer usando el replace** para eliminar esto de la request y quedarme solo con el token, **me quedaría el token con un espacio al principio**, lo que daría error
- Debo ponerle ? al authorization porque puede no venir
- Si el payload es null lanzo el error
- De esta manera **TAMBIÉN ESTOY PIDIENDO UN TOKEN PARA EL SIGNIN Y EL SIGNUP** por lo que **lo voy a dejar comentado de momento**
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
        context({ req }) {              //es importante el espacio despues de Bearer, si no dará error!!
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