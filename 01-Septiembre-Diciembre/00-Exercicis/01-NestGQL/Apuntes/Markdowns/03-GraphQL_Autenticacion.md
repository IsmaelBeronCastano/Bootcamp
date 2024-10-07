# 03 Nest GraphQL - Autenticación


- Estamos creando una app para manejar listas
- El usuario solo podrá ver sus listas
- El administrador podrá ver todas las listas
- Este es el JSON, se ha añadido bcrypt, passport, passport-jwt, @nestjs/passport y @nestjs/jwt
- tambien instalo como dependencia de desarrollo  @types/passport-jwt

~~~json
{
  "name": "anylist",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@nestjs/apollo": "^12.1.0",
    "@nestjs/common": "^10.3.9",
    "@nestjs/config": "^3.2.2",
    "@nestjs/core": "^10.3.9",
    "@nestjs/graphql": "^12.1.1",
    "@nestjs/platform-express": "^10.3.9",
    "@nestjs/testing": "^10.3.9",
    "@nestjs/typeorm": "^10.0.2",
    "apollo-server-core": "^3.13.0",
    "apollo-server-express": "^3.13.0",
    "bcrypt": "^5.1.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "graphql": "^16.8.1",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.0",
    "pg": "^8.12.0",
    "reflect-metadata": "^0.1.13",
    "rimraf": "^3.0.2",
    "rxjs": "^7.2.0",
    "typeorm": "^0.3.20"
  },
  "devDependencies": {
    "@nestjs/cli": "^9.0.0",
    "@nestjs/schematics": "^9.0.0",
    "@types/bcrypt": "^5.0.0",
    "@types/express": "^4.17.13",
    "@types/jest": "28.1.8",
    "@types/node": "^16.0.0",
    "@types/passport-jwt": "^3.0.7",
    "@types/supertest": "^2.0.11",
    "@typescript-eslint/eslint-plugin": "^5.0.0",
    "@typescript-eslint/parser": "^5.0.0",
    "eslint": "^8.0.1",
    "jest": "28.1.3",
    "source-map-support": "^0.5.20",
    "supertest": "^6.1.3",
    "ts-jest": "28.0.8",
    "ts-loader": "^9.2.3",
    "ts-node": "^10.0.0",
    "tsconfig-paths": "4.1.0",
    "typescript": "^4.7.4"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
~~~

- Autenticación (saber quien es el usuario) y autorización (son los permisos que tiene el usuario, habrá ciertos querys bloqueados a ciertos roles)
- Signup y Login normalmente no está en graphQL, porque si no cualquier persona no autorizada tendrían acceso a los endpoints
- Se suele usar REST, u otros tipos de auth
- Crearemos custom decorators, haremos la autenticación, veremos las estrategias para logearnos, validar los tokens, las mutations
- Veremos como bloquear el schema en caso de no tener acceso

-------

## User Entity, resolver, Servicio y Auth

- El main está igual

~~~js
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
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

- Creo los módulos de Auth (login, signin, revalidación del token) y User(para manejar los usuarios, más en plan admin)
- Veremos la dependencia cíclica de los módulos

> nest g res user  

- GraphQl Code first, creo los endpoints
- En el app.module

~~~js
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

import { ItemsModule } from './items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [
        //ApolloServerPluginLandingPageLocalDefault
      ]
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
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

- User.entity queda así
- Aparte de ser una entidad, también es un ObjectType

~~~js
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  // @Field(() => String)
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  @Field( () => [ String ])
  roles: string[];

  @Column({
    type: 'boolean',
    default: true
  })
  @Field( () => Boolean )
  isActive: boolean;

  //TODO: relaciones y otras cosas
}
~~~

- En user.module debo indicar la entidad con forFeature

~~~js
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './entities/user.entity';

@Module({
  providers: [
    UsersResolver, 
    UsersService
  ],
  imports: [
    TypeOrmModule.forFeature([ User ])
  ],
  exports: [
    // TypeOrmModule,
    UsersService
  ]
})
export class UsersModule {}
~~~

- La parte de creación de usuarios en el resolver generado no la quiero aquí, la quiero en Auth. Si la tendré en el servicio pero no necesito un endpoint aquí
- El método findAll es async, devuelve un Promise de tipo User[], modifico el resto también 
- El resolver de User ha quedado así
- **IMPORTANTE**: asegurarse de que el **Query** importado **es de nestjs/graphql** y no de nestjs/common

~~~js
~~~js
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [ User ], { name: 'users' })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => ID }) id: string
  ): Promise<User> {
    //todo:
    throw new Error('No implementado');
    // return this.usersService.findOne(id);
  }

  // @Mutation(() => User)
  // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
  //   return this.usersService.update(updateUserInput.id, updateUserInput);
  // }

  @Mutation(() => User)
  blockUser(@Args('id', { type: () => ID }) id: string
  ): Promise<User> {
    return this.usersService.block( id );
  }
}
~~~

- En el servicio inyecto el repositorio con @InjectRepository y le paso la entidad, luego uso Repository de typeorm de tipo la entidad (User)

~~~js
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

import { SignupInput } from '../auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  
  //genero el logger
  private logger = new Logger('UsersService')

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ){}

  async create( signupInput: SignupInput ): Promise<User> {
    try {

      const newUser = this.usersRepository.create({ 
        ...signupInput,
        password: bcrypt.hashSync( signupInput.password, 10 ) //hasheo el password
       });

      return await this.usersRepository.save( newUser ); //salvo el newUser

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOneByEmail( email: string ): Promise<User> {
   
    try {
      return await this.usersRepository.findOneByOrFail({ email })
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
      return await this.usersRepository.findOneByOrFail({ id })
    } catch (error) {
      throw new NotFoundException(`${ id } not found`);
    }

  }

  update( id: number, updateUserInput: UpdateUserInput ) {
    return `This action updates a #${id} user`;
  }

  block( id: string ): Promise<User> {
    throw new Error(`block method not implement`);
  }
                                      //never porque nunca regresará un valor, siempre una excepción
  private handleDBErrors( error: any ): never{
    
    //cuando tenemos una llave duplicada devuelve este código de error
    if( error.code === '23505' ){   //error.detail empieza el mensaje con 'Key ...', la quito para que quede más bonito el error en el logger
      throw new BadRequestException(error.detail.replace('Key', ''));
    }
    
    //cuando no encuentra el usuario lanza este error
    if( error.code == 'error-001' ){
      throw new BadRequestException(error.detail.replace('Key', ''));
    }

    this.logger.error( error );
    
    throw new InternalServerErrorException('Please check server logs');
  }
}
~~~

- El create-user.dto

~~~js
import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
~~~

- El update-user.dto

~~~js
import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id: number;
}
~~~

- Ahora creo el módulo de Auth
- Necesito métodos accesibles desde fuera como el sign in, sign out

> nest g res auth --no-spec

- GraphQl Code First (sin los endpoints)
- En el resolver debo crear dos Mutations, el sign up y el login
- Hago un tercer método para revalidar el token
- En este momento todavía no tengo el tipo de la respuesta que devolverá la Mutation
- Será src/auth/types/AuthResponse
- El custom decorator @CurrentUser lo veremos más adelante

~~~js
import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { SignupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.types';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver()

export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Mutation( () => AuthResponse, { name: 'signup' })
  async signup(
    @Args('signupInput') signupInput: SignupInput
  ): Promise<AuthResponse>{
    return this.authService.signup(signupInput)
  }

  @Mutation( () => AuthResponse, { name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthResponse>{
    return this.authService.login(loginInput)
  }

  @Query( () => AuthResponse, { name: 'revalidate' })
  @UseGuards( JwtAuthGuard )
  revalidateToken(
    @CurrentUser( /**[ ValidRoles.admin ]*/ ) user: User
  ): AuthResponse{
    return this.authService.revalidateToken( user );
  }
}
~~~

- AuthResponse

~~~js
import { Field, ObjectType } from "@nestjs/graphql";
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class AuthResponse {

    @Field(() => String)
    token: string;

    @Field(() => User)
    user: User;

}
~~~

- En los dtos tengo signupInput y LoginInput
- SignupInput

~~~js
import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

@InputType()
export class SignupInput {
    
    @Field( () => String )
    @IsEmail()
    email: string;
    
    @Field( () => String )
    @IsNotEmpty()
    fullName: string;

    @Field( () => String )
    @MinLength(6)
    password: string;

}
~~~

- LoginInput

~~~js
import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, MinLength } from "class-validator";

@InputType()
export class LoginInput {
    
    @Field( () => String )
    @IsEmail()
    email: string;

    @Field( () => String )
    @MinLength(6)
    password: string;

}
~~~
----

## Crear usuario

- En el servicio de User

~~~js
@Injectable()
export class UsersService {
  
  private logger = new Logger('UsersService')

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ){}

  async create( signupInput: SignupInput ): Promise<User> {
    try {

      const newUser = this.usersRepository.create({ 
        ...signupInput,
        password: bcrypt.hashSync( signupInput.password, 10 ) //hasheo el password
       });

      return await this.usersRepository.save( newUser ); //salvo el newUser

    } catch (error) {
      this.handleDBErrors(error);
    }
  }
}
~~~

- En el AuthService, inyecto el UsersService y el JwtService de @nestjs/jwt
- Al incluir el JwtModule en el auth.module tengo disponible el JawtService

~~~js
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { SignupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.types';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    private getJwtToken( userId: string ) {
        return this.jwtService.sign({ id: userId }); //genero el token pasándole el ID como payload
    }

    //para crear el usuario
    async signup( signupInput: SignupInput ): Promise<AuthResponse> { 
                            //llamo al usersService
        const user = await this.usersService.create( signupInput )

        const token = this.getJwtToken( user.id ); //uso el método que he creado para generar el token

        return {token, user} //retrono el token y el user
               
    }
}
~~~

- Este token lo voy a estar buscando en los headers de la petición. 
- Para que esto funcione, el jwt necesita una secret_key que escribiré en las variables de entorno
- Además en el módulo, debo registrar la estrategia con PassportModule, colocar en providers los servicios, exportarlos, importar ConfigModule y ConfigService de @nestjs/config. Al usar JwtModule.registerAsync() se dá por importado también JwtModule
- **Todo lo que lleve Module va en los imports**
- Uso JwtModule con el método Async, poder usar useFactory, importo el ConfigModule para inyectar el ConfigService y llamar a la variable de entorno en el campo secret
- En signOptions le digo que el token expire en 4 horas en el campo expiresIn
- auth.module

~~~js
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

import { UsersModule } from '../users/users.module';

@Module({
  providers: [ AuthResolver, AuthService, JwtStrategy],
  exports: [ JwtStrategy, PassportModule, JwtModule ],
  imports: [

    ConfigModule, //no uso forFeature porque lo quiero usar en el useFactory

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => ({ //uso el return implicito al englobar la respuesta entre paréntesis
        
        //console.log(configService.get('JWT_SECRET')) --> me aseguro que tengo la variable de entorno
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '4h'
        }
      })
    }),
    
    UsersModule,
  ]
})
export class AuthModule {}
~~~

- En auth/strategies/jwt.strategy
- La clase extiende de PassportStrategy de @nestjs/passport a la que le paso la Strategy que importo de passport-jwt
- Uso @Injectable para hacerlo un servicio (inyectable). Debo incluirlo en los providers de auth.module
- En el constructor inyecto el ConfigService y el AuthService
- En el super (constructor del padre) le paso en un objeto el secretKey usando el ConfigService para obtener la variable de entorno
- Con ExtractJwt de passport-jwt obtengo el token de la Request sin hacer el split y todo aquello para obtenerlo de los headers
- Creo un método validate que devuelve una promesa de tipo User donde extraigo el id con desestructuración del payload que recibe (que tiene una interfaz JwtPayload) y hago la busqueda por id con authService.validateUser
- **Lo que retorne esta función es lo que se añadirá a la request para poder obtener el usuario del AuthGuard con @UseGuards y poderlo extraer en el customDecorator para validar si el rol del usuario tiene permisos o no**
- Desde **AQUI YA ESTÄ EN LA REQUEST**, pues está en la **STRATEGY**
  
~~~js
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){

    constructor(
        private readonly authService: AuthService,

        ConfigService: ConfigService
    ) {
        super({
            secretOrKey: ConfigService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    //lo que retorne esta función se añadirá a la request, sea el user o la excepción
    async validate( payload: JwtPayload ): Promise<User> {
        
        const { id } = payload;

        const user = await this.authService.validateUser( id );

        return user; //este usuario se añadirá a la request. Esto será req.user
        
    }
}
~~~

- En el authService creo el método validate para el que ya tengo el id del user, que me servirá para verificar que el usario está activo para poder acceder a las rutas que yo quiera a través del @UseGuards y el @CurrentUser (mi custom decorator para validar los roles extraidos del payload de la request)

~~~js
 async validateUser( id: string ): Promise<User> {

        const user = await this.usersService.findOneById( id ); //findOneById es el mismo que findOneByEmail pero con el id

        if( !user.isActive ){
            throw new UnauthorizedException(`User is inactive, talk with an admin`);
        }

        delete user.password; //aunque esté encriptado lo borro para asegurarme que no fluye por ahi

        return user;
    }
~~~

- La interfaz de JwtPayload

~~~js
export interface JwtPayload {
    id: string;
    iat: number; //fecha de creación
    exp: number; //fecha de expiración
}
~~~

- En el usersService que llamo desde el signup hago uso del repositorio con typeorm para crear el user y lo guardo
- Quédate que el token no lo guardo en la DB

~~~js
async create( signupInput: SignupInput ): Promise<User> {
    try {

      const newUser = this.usersRepository.create({ 
        ...signupInput,
        password: bcrypt.hashSync( signupInput.password, 10 )
       });

      return await this.usersRepository.save( newUser ); 

    } catch (error) {
      this.handleDBErrors(error);
    }
  }
~~~

- Normalmente queremos el login y el signin fuera de graphQL, en una API REST tradicional porque no queremos que la persona tenga acceso a los endpoints 
- Es recomendable
-------

## Login

- Para el **login** tengo esto en el auth.resolver, una Mutation que devuelve una AuthResponse, llamo al método login en el objeto
- Uso @Args para indicar que recibirá un objeto de tipo loginInput
- El método devolverá una promesa de tipo AuthResponse
- Llamo al servicio invocando al método login pasándole el loginInput

~~~js
@Mutation( () => AuthResponse, { name: 'login' })
async login(
  @Args('loginInput') loginInput: LoginInput
): Promise<AuthResponse>{
  return this.authService.login(loginInput)
}
~~~

- En el authService desestructuro el email y password del dto
- Hago la búsqueda por mail usando el método del usersService
- Usando el método compareSync de bcrypt veo si hace match el password
- Si no lo hace mando una excepción
- Si hace match genero el token pasándole el id y lo regreso junto al user

~~~js
 async login( loginInput: LoginInput ): Promise<AuthResponse>{
        
        const { email, password } = loginInput;
        const user = await this.usersService.findOneByEmail( email );

        if( !bcrypt.compareSync( password, user.password) ){ //
            throw new BadRequestException('Email / Password do not match');
        }
        
        const token = this.getJwtToken( user.id );
        
        return {
            token,
            user
        }
    }
~~~

- El método findOneByemail del usersService

~~~js
async findOneByEmail( email: string ): Promise<User> {
   
    try {                                //en el caso de que no lo encuentre va a lanzar un error que atraparé con el catch
      return await this.usersRepository.findOneByOrFail({ email })
    } catch (error) {
      
      throw new NotFoundException(`${ email } not found`);

      // this.handleDBErrors({
      //   code: 'error-001',
      //   detail: `${ email } not found`
      // });
    }
  }
~~~

- Para validar las rutas creo en el auth.resolver una petición que requiera autenticación
- Siempre queremos regresar algo de tipo Authresponse porque ahí es dónde tenemos el usuario y el token

~~~js
@Query( () => AuthResponse, { name: 'revalidate' })
@UseGuards( JwtAuthGuard ) //no hace falta ejecutarlo porque ya lo estoy invocando en la construcción
revalidateToken(
  @CurrentUser( /**[ ValidRoles.admin ]*/ ) user: User
): AuthResponse{
  return this.authService.revalidateToken( user );
}
~~~

- El revalidateToken del auth.service luce así

~~~js
revalidateToken( user: User ): AuthResponse {

    const token = this.getJwtToken( user.id );

    return { token, user }

}
~~~

- Si uso @UseGuards con el AuthGuard me lanza un error que no puede leer las propiedades de undefined
- Más adelante usaremos este @UseGuard a nivel de resolver porque haremos que todos los querys necesiten uno u otro role
- Crearemos nuestro propio AuthGuard basado en el que ofrece passport
- Le especifico que uso para validar, 'jwt'
- Sobreescribo el método getRequest de AuthGuard y le paso cómo parámetro el ExecutionContext de nestjs/common
- Creo el contexto con gqlExecutionContext (gql de GraphQL) y le paso el context
- Obtengo la request usando el context  
- Retorno la request
- En src/auth/guards/jwt-auth.guard

~~~js
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

                                  //como lo estoy ejecutando aquí no hace falta ponerle paréntesis en el @UseGuards
export class JwtAuthGuard extends AuthGuard('jwt') {

    //! Override (sobreescribo el getRequest de AuthGuard)
    getRequest( context: ExecutionContext ) {

        const ctx = GqlExecutionContext.create( context ); //creo el context de graphQL
        const request = ctx.getContext().req; //obtengo la request

        return request; //retorno la request

    }

}
~~~

- Creo un custom decorator con la función de flecha createParamdecorator, le paso los roles válidos y el context
- Creo de nuevo el context graphQL y obtengo el user de la request
- Debo validar si el rol tiene permisos y si está activo 
- En auth/decorators/current-user.decorator

~~~js
import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from '../enums/valid-roles.enum';
import { User } from '../../users/entities/user.entity';

export const CurrentUser = createParamDecorator( 
    ( roles: ValidRoles[] = [], context: ExecutionContext ) => {

        const ctx = GqlExecutionContext.create( context ) //creo el context de graphql
        const user: User = ctx.getContext().req.user; //extraigo el user de la request que obtengo del strategy con validate

        if ( !user ) {   //si viene nulo será un error del server, porque no debería ser null
            throw new InternalServerErrorException(`No user inside the request - make sure that we used the AuthGuard`)
        }

        if ( roles.length === 0 ) return user; //si el role está vacío voy a dejar pasar al usuario (por defecto todos tienen "user")

        for ( const role of user.roles ) { //recorro el array de roles
            //TODO: Eliminar Valid Roles
            if ( roles.includes( role as ValidRoles ) ) { //valido que el role esté en ValidRoles
                return user;
            }
        }

        //si no tiene un role válido  devuelvo la excepción
        throw new ForbiddenException(
            `User ${ user.fullName } need a valid role [${ roles }]`
        )

})
~~~

- auth/enum/valid-roles

~~~js
// TODO: Implementar enum como GraphQL Enum Type
export enum ValidRoles {

    admin = 'admin', 
    user = 'user', 
    superUser = 'superUser'
}
~~~

- Podría pasarle así el role al Query

~~~js
@Query( () => AuthResponse, { name: 'revalidate' })
@UseGuards( JwtAuthGuard ) //no hace falta ejecutarlo porque ya lo estoy invocando en la construcción
revalidateToken(
  @CurrentUser( [ ValidRoles.admin ] ) user: User
): AuthResponse{
  return this.authService.revalidateToken( user );
}
~~~

- Para hacer la consulta desde el playground, debo añadir crear en el apartado headers Authorization y pasarle el token como Bearer oauihaoshaois
- Bearer(espacio) tokensincomillasninada
- El query revalidateToken es solo para comprobar que funciona el AuthGuard que he creado y el @CurrentUser
- Las querys serían algo asi
- Para crear usuario, en el playground, donde en la query pido que me devuelva el fullName y el token

~~~js
mutation Signup($signUp: SignupInput!){
  
  signup(signupInput: $signUp){
    user{
      fullName
    }
    token
  }
  
}
~~~

- En query variables

~~~json
{
  "signUp": {
    "fullName": "Marta",
   "email": "marta@gmail.com",
    "password": "soclamarta"
  }
}
~~~

- Me devuelve esto

~~~json
{
  "data": {
    "signup": {
      "user": {
        "fullName": "Marta"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOGIxZGU2LWZhNGQtNGUyNy04ZjU1LTM5YmY1MTVmOTkzMSIsImlhdCI6MTcxODIyNjA5NSwiZXhwIjoxNzE4MjQwNDk1fQ.-OoEkevWs-It677KFfrlkOA_-Aqqwn2BbBMsZeChge0"
    }
  }
}
~~~

- Para el Login (en el caso de que quiera obtener el fullName y el token)

~~~js
mutation Login($loginInput: LoginInput!){
  
  login(loginInput: $loginInput){
		user{
      fullName
    }
    token
  }
  
}
~~~

- En las variables

~~~json
{
  "loginInput": {
   "email": "marta@gmail.com",
    "password": "soclamarta"
  }
}
~~~

- Debo pasarle el token en el playground en HTTP HEADERS

~~~json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOGIxZGU2LWZhNGQtNGUyNy04ZjU1LTM5YmY1MTVmOTkzMSIsImlhdCI6MTcxODIyNjA5NSwiZXhwIjoxNzE4MjQwNDk1fQ.-OoEkevWs-It677KFfrlkOA_-Aqqwn2BbBMsZeChge0"
}
~~~

- Me devuelve esto

~~~json
{
  "data": {
    "login": {
      "user": {
        "fullName": "Marta"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOGIxZGU2LWZhNGQtNGUyNy04ZjU1LTM5YmY1MTVmOTkzMSIsImlhdCI6MTcxODIyNjQzMiwiZXhwIjoxNzE4MjQwODMyfQ.yU7BxEuF11b_GTDZs5cVTZ-5-10veSdM2-h_Y8YVbLw"
    }
  }
}
~~~

- Para la query revalidate

~~~js
query Revalidate{
  revalidate{
    token
    user{
      id
      fullName
      roles
      isActive
    }
  }
}
~~~

- En HTTP HEADERS debo pasarle el Bearer Token del Login

~~~json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOGIxZGU2LWZhNGQtNGUyNy04ZjU1LTM5YmY1MTVmOTkzMSIsImlhdCI6MTcxODIyNjQzMiwiZXhwIjoxNzE4MjQwODMyfQ.yU7BxEuF11b_GTDZs5cVTZ-5-10veSdM2-h_Y8YVbLw"
}
~~~

- Me devuelve esto

~~~json
{
  "data": {
    "revalidate": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOGIxZGU2LWZhNGQtNGUyNy04ZjU1LTM5YmY1MTVmOTkzMSIsImlhdCI6MTcxODIyNjg5NCwiZXhwIjoxNzE4MjQxMjk0fQ.gFSjMoJ2jyjKjtnrdqJalAwmV22lVTl3JjtllDwytZc",
      "user": {
        "id": "5c8b1de6-fa4d-4e27-8f55-39bf515f9931",
        "fullName": "Marta",
        "roles": [
          "user"
        ],
        "isActive": true
      }
    }
  }
}
~~~

- El env.template

~~~
STATE=dev
DB_PASSWORD=123456
DB_NAME=AnyList
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=postgres

JWT_SECRET=por_favor_cambiar_esto
~~~

