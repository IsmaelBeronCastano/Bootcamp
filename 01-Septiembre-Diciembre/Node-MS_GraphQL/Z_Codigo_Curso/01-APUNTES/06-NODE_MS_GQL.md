# NODE MICROSERVICIOS - 06 GraphQL como Microservice Client

- Elimino el api-gateway
- Creo un nuevo proyecto 

> nest new client-gql

## Agregar graphQL

- Instalo

> npm i @nestjs/graphql @nestjs/apollo @apollo/server graphql

- En el app.module uso ApolloServer (Apollo Studio) en lugar del playground (con el navegador)
- Uso autoSchemaFile para que genere automáticamente los Schemas
- join lo importo de path, coloco node: delante porque es la nueva convención con los paquetes de node

~~~js
import { join } from "node:path";

import { Module } from "@nestjs/common";

import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";

import { RandomModule } from "./random/random.module";
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"), //para que genere automaticamente los schemas
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    RandomModule,
    //AuthModule,
    //CoursesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
~~~

- El main se queda igual

~~~js
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { envs } from "./config/envs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(envs.port);
}
bootstrap();
~~~

- Recuerda que para que graphql funcione debe tener al menos un query y un resolver

> nest g res random
> GraphQL (code first) (uso decoradores y Nest se encarga por detrás de hacer los schemas)
> Generar CRUD (si!)

- El client-gql/src/random.module queda así

~~~js
import { Module } from '@nestjs/common';
import { RandomService } from './random.service';
import { RandomResolver } from './random.resolver';

@Module({
  providers: [RandomResolver, RandomService],
})
export class RandomModule {}
~~~

- El random.resolver lo dejo solo con el findAll

~~~js
import { Int, Query, Resolver } from "@nestjs/graphql";

import { Random } from "./entities/random.entity";
import { RandomService } from "./random.service";

             //random.entity
@Resolver(() => Random) 
export class RandomResolver {
  constructor(private readonly randomService: RandomService) {}

  @Query(() => Int, {
    name: "getRandomNumber", //haré la query con este nombre
    description: "Get a random number",
  })
  findAll() {
    return this.randomService.findAll();
  }
}
~~~

- Debo definir el tipo en client-gql/src/entities/random.entity.ts

~~~js
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Random {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
~~~

- El random service queda así

~~~js
import { Injectable } from "@nestjs/common";

@Injectable()
export class RandomService {
  findAll() {
    return Math.floor(Math.random() * 1000); //número random entre 0 y 1000
  }
}
~~~

- En el client-gql/schema.gql tengo esto

~~~js
type Query {
  """Get a random number"""
  getRandomNumber: Int!
}
~~~

- La query la hago así

~~~gql
query Query{
    getRandomNumber
}
~~~
-----

## Mutations

- Genero con nest g res auth (code first)
- client-gql/src/auth
- auth.module

~~~js
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";

import { envs } from "../config/envs";
import { QueuesEnum, ServicesTokens } from "../enums";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesTokens.AUTH_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [envs.rmqUrl],
          queue: QueuesEnum.AuthQueue,
          queueOptions: {
            durable: true,
          },
          noAck: true,
        },
      },
    ]),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
~~~

- El resolver en client-gql/src/auth/auth.resolver.ts
- Uso @Args para capturar el inputType (login.input)

~~~js
import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { AuthService } from "./auth.service";

import { AuthGuard } from "./guards/auth.guard";

import { LoginInput } from "./dto/login.input";
import { RegisterInput } from "./dto/register.input";

import { GetAuthenticatedUserByToken } from "../decorators/getUserByToken.decorator";
import { Auth } from "./entities/auth.entity";
import { Token } from "./entities/token.entity";

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth, { name: "login" })
  login(@Args("loginInput") loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => Auth, { name: "register" })
  register(@Args("registerInput") registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Query(() => Token, { name: "verifyJWT" })
  @UseGuards(AuthGuard)
  verifyToken(@GetAuthenticatedUserByToken() user: Token) {
    return this.authService.verifyToken(user);
  }
}
~~~

- En el service uso firstValueFrom para trabajar con promesas en lugar de Observables
- Inyecto el token de inyección y lo uso con ClientProxy

~~~js
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { firstValueFrom } from "rxjs";
import { ServicesTokens } from "../enums";
import { LoginInput } from "./dto/login.input";
import { RegisterInput } from "./dto/register.input";
import { Auth } from "./entities/auth.entity";
import { Token } from "./entities/token.entity";

@Injectable()
export class AuthService {
  constructor(
    @Inject(ServicesTokens.AUTH_SERVICE)
    private readonly authService: ClientProxy,
  ) {}
                                      //al ser async trabajamos con promesas
                                      //Regresa una promesa de tipo Auth
  async login(loginInput: LoginInput): Promise<Auth> {
    const {
      id,
      token,
      email,
      username: name,//renombro el username a name
    } = await firstValueFrom(
      this.authService.send("auth.login", { ...loginInput }),
    );

    return {
      id,
      email,
      name,
      token,
    };
  }

  async register(registerInput: RegisterInput): Promise<Auth> {
    const {
      id,
      token,
      email,
      username: name,
    } = await firstValueFrom(
      this.authService.send("auth.register", { ...registerInput }),
    );

    return {
      id,
      email,
      name,
      token,
    };
  }

  verifyToken({ token, user }: Token): Token {
    return { token, user };
  }
}
~~~

- El authGuard es el mismo, solo que extraigo el context de Gql

~~~js
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { GqlExecutionContext } from "@nestjs/graphql";
import { ClientProxy } from "@nestjs/microservices";
import { Request } from "express";
import { firstValueFrom } from "rxjs";
import { ServicesTokens } from "../../enums";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(ServicesTokens.AUTH_SERVICE)
    private readonly authService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request = context.switchToHttp().getRequest();

    if (!request) {
      const ctx = GqlExecutionContext.create(context); //Gql
      request = ctx.getContext().req;
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    const { token: renewToken, user } = await firstValueFrom(
      this.authService.send("auth.verify.token", { token }),
    );

    request["token"] = renewToken;
    request["user"] = user;

    return renewToken;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];

    return type === "Bearer" ? token : undefined;
  }
}
~~~

- En entities tengo auth.entity

~~~js
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Auth {
  @Field(() => String, {
    name: "id",
    description: "id of the user",
  })
  id: string;

  @Field(() => String, {
    name: "name",
    description: "name of the user",
  })
  name: string;

  @Field(() => String, {
    name: "email",
    description: "email of the user",
  })
  email: string;

  @Field(() => String, {
    name: "token",
    description: "jwt of the user",
    nullable: true,
  })
  token: string;
}
~~~

- También token.entity

~~~js
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
class UserJWT {
  @Field(() => String, {
    name: "id",
    description: "id of the user",
  })
  id: string;

  @Field(() => String, {
    name: "email",
    description: "email of the user",
  })
  email: string;
}

@ObjectType()
export class Token {
  @Field(() => String, {
    name: "token",
    description: "jwt of the user",
    nullable: true,
  })
  token: string;

  @Field(() => UserJWT, {
    name: "user",
    description: "user data",
  })
  user: UserJWT;
}
~~~

- En los dtos tengo login.input

~~~js
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class LoginInput {
  @Field(() => String, { name: "email", description: "User email" })
  email: string;

  @Field(() => String, { name: "password", description: "User password" })
  password: string;
}
~~~

- register.input

~~~js
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class RegisterInput {
  @Field(() => String, { name: "email", description: "User email" })
  email: string;

  @Field(() => String, { name: "username", description: "Username" })
  username: string;

  @Field(() => String, { name: "password", description: "User password" })
  password: string;
}
~~~

## Proceso de autenticación

- Una vez tengo el cliente-gql/src/auth/auth.controller hago el resolver
- Inyecto el AuthService
- El @Resolver devuelve algo de tipo Auth
- Las mutation, por tanto, también
- La Query verifyToken devuelve algo de tipo token
- cliente-gql/src/auth/auth.controller

~~~js
import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { AuthService } from "./auth.service";

import { AuthGuard } from "./guards/auth.guard";

import { LoginInput } from "./dto/login.input";
import { RegisterInput } from "./dto/register.input";

import { GetAuthenticatedUserByToken } from "../decorators/getUserByToken.decorator";
import { Auth } from "./entities/auth.entity";
import { Token } from "./entities/token.entity";

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth, { name: "login" })
  login(@Args("loginInput") loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => Auth, { name: "register" })
  register(@Args("registerInput") registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Query(() => Token, { name: "verifyJWT" })
  @UseGuards(AuthGuard)
  verifyToken(@GetAuthenticatedUserByToken() user: Token) {
    return this.authService.verifyToken(user);
  }
}
~~~

- La cliente-gql/src/entities/auth.entity es esta
- Debo declarar en el **@ObjectType** cada **@Field** con una función en la que debo declarar el tipo de retorno

~~~js
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Auth {
  @Field(() => String, {
    name: "id",
    description: "id of the user",
  })
  id: string;

  @Field(() => String, {
    name: "name",
    description: "name of the user",
  })
  name: string;

  @Field(() => String, {
    name: "email",
    description: "email of the user",
  })
  email: string;

  @Field(() => String, {
    name: "token",
    description: "jwt of the user",
    nullable: true,
  })
  token: string;
}
~~~

- El decorador para verificar el token es este
- Uso createParamDecorator, devuelve un token
- Extraigo elk context de Gql, y de este la request
- Retorno el token y el user

~~~js
import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { Token } from "../auth/entities/token.entity";

export const GetAuthenticatedUserByToken = createParamDecorator(
  (data, context: ExecutionContext): Token => {
    let request = context.switchToHttp().getRequest();

    if (!request) {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    }

    return { token: request.token, user: request.user };
  },
);
~~~

- Para hacer una mutation desde Apollo Server

~~~gql
mutation Login($loginInput: LoginInput!){
  login(loginInput: $loginInput){
    id
    name
    email
  }
}

##VARIABLES

{
  "loginInput":{
    "email": "miemail@correo.com",
    "password": "mi_password"
  }
}
~~~
------

- El cliente-gql/controller se conecta al cliente-gql/service que se conecta con el auth-ms/auth.controller que se conecta con el aut-ms/auth.service
- El service de cliente.gql/login es este

~~~js
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { firstValueFrom } from "rxjs";
import { ServicesTokens } from "../enums";
import { LoginInput } from "./dto/login.input";
import { RegisterInput } from "./dto/register.input";
import { Auth } from "./entities/auth.entity";
import { Token } from "./entities/token.entity";

@Injectable()
export class AuthService {
  constructor(
    @Inject(ServicesTokens.AUTH_SERVICE)
    private readonly authService: ClientProxy,
  ) {}

  async login(loginInput: LoginInput): Promise<Auth> {
    const {
      id,
      token,
      email,
      username: name,
    } = await firstValueFrom( //me comunico con al auth-ms/controller  
      this.authService.send("auth.login", { ...loginInput }), 
    );

    return {
      id,
      email,
      name,
      token,
    };
  }
}
~~~

- Este controlador llama al microservicio auth usando el .send (espero una respuesta) del ClientProxy
- En el auth-ms/src/auth/controllers/auth.controller llamo al auth.login

~~~js
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";

import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern("auth.healt")
  healt() {
    return { status: 200, message: "ok" };
  }

  @MessagePattern("auth.verify.token")
  verifyToken(@Payload("token") token: string) {
    return this.authService.verifyToken(token);
  }

  //AQUI!!
  @MessagePattern("auth.login")
  login(@Payload() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @MessagePattern("auth.register")
  register(@Payload() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
~~~

- En el auth-ms/service tengo la lógica

~~~js
import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RpcException } from "@nestjs/microservices";

import { PrismaClient } from "@prisma/client";

import * as bcrypt from "bcrypt";

import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  private hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(12);

    return bcrypt.hashSync(password, salt);
  }

  private verifyPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  private validateUserEmail(email: string) {
    return this.user.findUnique({
      where: {
        email,
      },
    });
  }

  private signToken(payload: { id: string; email: string }) {
    return this.jwtService.sign({
      ...payload,
    });
  }

async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const storedUser = await this.validateUserEmail(email);

    if (!storedUser || !this.verifyPassword(password, storedUser.password))
      throw new RpcException("Email or password is invalid");

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password: _,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      active: __,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updatedAt: ___,
      ...user
    } = storedUser;

    return {
      ...user,     //método privado
      token: this.signToken({
        id: user.id,
        email,
      }),
    };
  }
}
~~~
- En auth-ms/src/auth/auth.module tengo registrado el módulo de Jwt en imports

~~~js
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.register({
      secret: process.env.JWTSecret,
      signOptions: { expiresIn: "1h" },
    }),
  ],
})
export class AuthModule {}
~~~

- En auth-ms/src/auth/main.ts tengo registrado el microservicio

~~~js
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { AppModule } from "./app.module";
import { QueuesEnum } from "./enums/queue.enum";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RMQ_URL],
        queue: QueuesEnum.AuthQueue,
        queueOptions: {
          durable: true,
        },
        noAck: true,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();
}
bootstrap();
~~~

- Es en el gql-client/src/auth/auth.module donde registro el Ciente

~~~js
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";

import { envs } from "../config/envs";
import { QueuesEnum, ServicesTokens } from "../enums";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesTokens.AUTH_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [envs.rmqUrl],
          queue: QueuesEnum.AuthQueue,
          queueOptions: {
            durable: true,
          },
          noAck: true,
        },
      },
    ]),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
~~~

- Cliente que usaré desde el client-gql/src/auth/auth.service.ts para comunicarme con el controlador de auth-ms con el auth-ms/auth.service inyectado
- Uso firstValueFrom para trabajar con promesas y async await y no observables

~~~js
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { firstValueFrom } from "rxjs";
import { ServicesTokens } from "../enums";
import { LoginInput } from "./dto/login.input";
import { RegisterInput } from "./dto/register.input";
import { Auth } from "./entities/auth.entity";
import { Token } from "./entities/token.entity";

@Injectable()
export class AuthService {
  constructor(
    @Inject(ServicesTokens.AUTH_SERVICE)
    private readonly authService: ClientProxy,
  ) {}

  async login(loginInput: LoginInput): Promise<Auth> {
    const {
      id,
      token,
      email,
      username: name,
    } = await firstValueFrom(
      this.authService.send("auth.login", { ...loginInput }),
    );

    return {
      id,
      email,
      name,
      token,
    };
  }

  async register(registerInput: RegisterInput): Promise<Auth> {
    const {
      id,
      token,
      email,
      username: name,
    } = await firstValueFrom(
      this.authService.send("auth.register", { ...registerInput }),
    );

    return {
      id,
      email,
      name,
      token,
    };
  }

  //la verificacion se hace a través del decorador
  verifyToken({ token, user }: Token): Token {
    return { token, user };
  }
}
~~~

- En el cliente-gateway/auth.resolver

~~~js
@Query(() => Token, { name: "verifyJWT" })
@UseGuards(AuthGuard)
verifyToken(@GetAuthenticatedUserByToken() user: Token) { //uso el decorador
  return this.authService.verifyToken(user);
}
~~~

- cliente-gql/decorators Para extraer el token de la Request

~~~js
import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { Token } from "../auth/entities/token.entity";

export const GetAuthenticatedUserByToken = createParamDecorator(
  (data, context: ExecutionContext): Token => {
    let request = context.switchToHttp().getRequest();

    if (!request) {  //si no puedo extraer el context lo hago de esta otra manera
      const ctx = GqlExecutionContext.create(context); 
      request = ctx.getContext().req;
    }

    return { token: request.token, user: request.user };
  },
);
~~~

En el cliente-gql/auth.service

~~~js
                //desestructuro el token y el user
  verifyToken({ token, user }: Token): Token {
    return { token, user };
  }
~~~

- En Apollo Server obtengo el token con el register

~~~gql
mutation Register($registerInput: RegisterInput!){
  register(registerInput: $registerInput){
    id
    email
    token
  }
}
~~~

- Con @UseGuard(AuthGuard) le paso el token

~~~gql
query Query(){
  verifyToken
}

## VARIABLES
Headers/Authorization/Bearer jdhsudhskjdhskjdhskjdh
---------

## Otros archivos
~~~

- Si no le paso el token en las variables me dice Unauthorized
- Por eso uso el decorador, para captar el token

- Fuera de auth, en src tengo config/envs.ts


~~~js
import "dotenv/config";

import * as joi from "joi";

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    RMQ_URL: joi.string().required(),
  })
  .unknown(true); //dejo el unknown en true para el resto de variables de node

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

interface Env {
  PORT: number;
  RMQ_URL: string;
}

const envVars: Env = value;

export const envs = {
  port: envVars.PORT as number,
  rmqUrl: envVars.RMQ_URL as string,
};

~~~

- Tengo también enums
- /queues

~~~js
export enum QueuesEnum {
  AuthQueue = "AuthQueue",
  CoursesQueue = "CoursesQueue",
}
~~~

- /services

~~~js
export enum ServicesTokens {
  COURSE_SERVICE = "COURSE_SERVICE",
  AUTH_SERVICE = "AUTH_SERVICE",
}
~~~
-----

## Courses


- El client-gql/src/courses/courses.module

~~~js
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { envs } from "../config/envs";
import { QueuesEnum, ServicesTokens } from "../enums";
import { CoursesResolver } from "./courses.resolver";
import { CoursesService } from "./courses.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesTokens.AUTH_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [envs.rmqUrl],
          queue: QueuesEnum.AuthQueue,
          queueOptions: {
            durable: true,
          },
          noAck: true,
        },
      },
      {
        name: ServicesTokens.COURSE_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [envs.rmqUrl],
          queue: QueuesEnum.CoursesQueue,
          queueOptions: {
            durable: true,
          },
          noAck: true,
        },
      },
    ]),
  ],
  providers: [CoursesResolver, CoursesService],
})
export class CoursesModule {}
~~~

- El resolver

~~~js
import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Token } from "../auth/entities/token.entity";
import { AuthGuard } from "../auth/guards/auth.guard";
import { GetAuthenticatedUserByToken } from "../decorators/getUserByToken.decorator";
import { CoursesService } from "./courses.service";
import { CreateCourseInput } from "./dto/create-course.input";
import { PaginationInput } from "./dto/pagination.input";
import { UpdateCourseInput } from "./dto/update-course.input";
import { Course } from "./entities/course.entity";

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  @Query(() => [Course], { name: "getAllCourses" })
  @UseGuards(AuthGuard)
  findAll(@Args("paginationInput") paginationInput: PaginationInput) {
    return this.coursesService.findAll(paginationInput);
  }

  @Query(() => Course, { name: "getCourseById", nullable: true })
  @UseGuards(AuthGuard)
  findOne(@Args("id", { type: () => String }) id: string) {
    return this.coursesService.findOne(id);
  }

  @Mutation(() => Course)
  @UseGuards(AuthGuard)
  createCourse(
    @Args("createCourseInput") createCourseInput: CreateCourseInput,
    @GetAuthenticatedUserByToken() { user }: Token,
  ) {
    createCourseInput.author_id = user.id;

    return this.coursesService.create(createCourseInput);
  }

  @Mutation(() => Course)
  @UseGuards(AuthGuard)
  updateCourse(
    @Args("updateCourseInput") updateCourseInput: UpdateCourseInput,
  ) {
    return this.coursesService.update(updateCourseInput);
  }

  @Mutation(() => Course, { name: "deleteCourse" })
  @UseGuards(AuthGuard)
  removeCourse(@Args("id", { type: () => String }) id: string) {
    return this.coursesService.remove(id);
  }
}
~~~

- La entidad de Course en src/entities/course.entity.ts

~~~js
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Course {
  @Field(() => String, { description: "ID by course" })
  id: string;

  @Field(() => String, { description: "title by course" })
  title: string;

  @Field(() => String, { description: "description by course" })
  description: string;

  @Field(() => String, { description: "Author ID by course" })
  author_id: string;
}

~~~

- En el service me comunico con el microservicio

~~~js
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ServicesTokens } from "../enums";
import { CreateCourseInput } from "./dto/create-course.input";
import { PaginationInput } from "./dto/pagination.input";
import { UpdateCourseInput } from "./dto/update-course.input";

@Injectable()
export class CoursesService {
  constructor(
    @Inject(ServicesTokens.COURSE_SERVICE)
    private readonly courseService: ClientProxy,
  ) {}

  findAll(paginationInput: PaginationInput) {
    return this.courseService.send(
      { cmd: "get_all_courses" },
      { ...paginationInput },
    );
  }

  findOne(id: string) {
    return this.courseService.send({ cmd: "get_course" }, { id });
  }

  create(createCourseInput: CreateCourseInput) {
    return this.courseService.send(
      { cmd: "create_course" },
      { ...createCourseInput },
    );
  }

  update(updateCourseInput: UpdateCourseInput) {
    return this.courseService.send(
      { cmd: "update_course" },
      { ...updateCourseInput },
    );
  }

  remove(id: string) {
    return this.courseService.send({ cmd: "delete_course" }, { id });
  }
}
~~~

- En los dtos de course dentro de client-gql
- create-course.input.ts

~~~js
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateCourseInput {
  @Field(() => String, { description: "Course title" })
  title: string;

  @Field(() => String, { description: "Course description" })
  description: string;

  @Field(() => String, { description: "Course Author ID", nullable: true })
  author_id?: string;
}
~~~

- pagination.input.ts

~~~js
import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true, description: "Page number" })
  page?: number;

  @Field(() => Int, { nullable: true, description: "Limit results" })
  limit?: number;
}
~~~

- update-course.input.ts

~~~js
import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateCourseInput } from "./create-course.input";

@InputType()
export class UpdateCourseInput extends PartialType(CreateCourseInput) {
  @Field(() => String)
  id: string;
}
~~~