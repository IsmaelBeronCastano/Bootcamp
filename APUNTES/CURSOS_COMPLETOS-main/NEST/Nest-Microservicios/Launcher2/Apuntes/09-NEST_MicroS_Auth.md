# NEST MICROSERVICIOS - AUTH

- Creo el módulo de auth con nest new auth-ms (lo haremos asi de momento luego lo corregimos)
- En el main configuro el NATS

~~~js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();
}
bootstrap();

~~~

- En auth creo con **nest g res auth --no spec** Microservice (non-HTTP)
- Voy a client-gateway y creo con **nest g  res auth** el módulo de auth
- Ins
- Instalo dotenv y joi
- Configuro las variables de entorno

~~~
PORT=3004

# NATS_SERVERS="nats://localhost:4222,nats://localhost:4223"
NATS_SERVERS="nats://localhost:4222"


AUTH_DATABASE_URL=mongodb+srv://***:*****@auth-microservice-db.8bpm1ia.mongodb.net/AuthDB


JWT_SECRET=OtroStringSeguroIriaAQUI
~~~

- Configurar variables de entorno de auth-ms/src/config/envs.ts

~~~js
import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  
  NATS_SERVERS: string[];

  JWT_SECRET: string;
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  
  NATS_SERVERS: joi.array().items( joi.string() ).required(),
  JWT_SECRET: joi.string().required(),
})
.unknown(true);

const { error, value } = envsSchema.validate({ 
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
});


if ( error ) {
  throw new Error(`Config validation error: ${ error.message }`);
}

const envVars:EnvVars = value;


export const envs = {
  port: envVars.PORT,

  natsServers: envVars.NATS_SERVERS,

  jwtSecret: envVars.JWT_SECRET,
};
~~~

- En el docker-compose conecto solo el auth

~~~yml
version: '3'


services:

  
  nats-server:
    image: nats:latest
    ports:
      - "8222:8222"
    

  client-gateway:
    build: ./client-gateway
    ports:
      - ${CLIENT_GATEWAY_PORT}:3000
    volumes:
      - ./client-gateway/src:/usr/src/app/src
    command: npm run start:dev
    environment:
      - PORT=3000
      - NATS_SERVERS=nats://nats-server:4222

  auth-ms:
    build: ./auth-ms
    volumes:
      - ./auth-ms/src:/usr/src/app/src
    command: npm run start:dev
    environment:
      - PORT=3004
      - NATS_SERVERS=nats://nats-server:4222
      - DATABASE_URL=${AUTH_DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}

#   products-ms:
#     build: ./products-ms
#     volumes:
#       - ./products-ms/src:/usr/src/app/src
#     command: npm run start:dev
#     environment:
#       - PORT=3001
#       - NATS_SERVERS=nats://nats-server:4222
#       - DATABASE_URL=file:./dev.db

  
#   # Orders MS
#   orders-ms:
#     depends_on:
#       - orders-db
#     build: ./orders-ms
#     volumes:
#       - ./orders-ms/src:/usr/src/app/src
#     command: npm run start:dev
#     environment:
#       - PORT=3002
#       - DATABASE_URL=postgresql://postgres:123456@orders-db:5432/ordersdb?schema=public
#       - NATS_SERVERS=nats://nats-server:4222



#   # Orders DB
#   orders-db:
#     container_name: orders_database
#     image: postgres:16.2
#     restart: always
#     volumes:
#       - ./orders-ms/postgres:/var/lib/postgresql/data
#     ports:
#       - 5432:5432
#     environment:
#       - POSTGRES_USER=postgres
#       - POSTGRES_PASSWORD=123456
#       - POSTGRES_DB=ordersdb

# # ======================
# # Payments Microservice
# # ======================
#   payments-ms:
#     container_name: payments-ms
#     build: ./payments-ms
#     volumes:
#       - ./payments-ms/src:/usr/src/app/src
#     command: npm run start:dev
#     ports:
#       - ${PAYMENTS_MS_PORT}:${PAYMENTS_MS_PORT}
#     environment:
#       - PORT=${PAYMENTS_MS_PORT}
#       - NATS_SERVERS=nats://nats-server:4222
#       - STRIPE_SECRET=${STRIPE_SECRET}
#       - STRIPE_SUCCESS_URL=${STRIPE_SUCCESS_URL}
#       - STRIPE_CANCEL_URL=${STRIPE_CANCEL_URL}
#       - STRIPE_ENDPOINT_SECRET=${STRIPE_ENDPOINT_SECRET}
      
~~~

- Desde auth-ms.controller

~~~js
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /*
    foo.* matches foo.bar, foo.baz, and so on, but not foo.bar.baz
    foo.*.bar matches foo.baz.bar, foo.qux.bar, and so on, but not foo.bar or foo.bar.baz
    foo.> matches foo.bar, foo.bar.baz, and so on
  */
  @MessagePattern('auth.register.user')
  registerUser(@Payload() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @MessagePattern('auth.login.user')
  loginUser(@Payload() loginUserDto: LoginUserDto) {
    return this.authService.loginUser( loginUserDto );
  }

  @MessagePattern('auth.verify.user')
  verifyToken( @Payload() token: string ) {
    return this.authService.verifyToken(token)
  }
}
~~~

- En el auth.module de NATS (client-gateway) coloco el módulo de auth en auth.controller

~~~js
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [AuthController],
  imports: [NatsModule],
})
export class AuthModule {}
~~~
------

## Login y register DTOS

- Auth-ms va a dictar lo que necesita y el client se tendrá que adaptar
- El login-user.dto y register-user.dto estarán en auth-ms y en el client

~~~js
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';


export class LoginUserDto {

  @IsString()
  @IsEmail()
  email:string;


  @IsString()
  @IsStrongPassword()
  password: string;


}
~~~

- register-user.dto

~~~js
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';


export class RegisterUserDto {

  @IsString()
  name: string;


  @IsString()
  @IsEmail()
  email:string;


  @IsString()
  @IsStrongPassword()
  password: string;

}
~~~
------


- Tengo el endpoint  localhost:3000/api/auth/register
- Lo mismo con login
- En el main de auth-ms tengo configurado el useGlobalPipes

~~~js
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';


export class RegisterUserDto {

  @IsString()
  name: string;


  @IsString()
  @IsEmail()
  email:string;


  @IsString()
  @IsStrongPassword()
  password: string;


}
~~~
----

## Aprovisionar MongoDB

- Este es el string de conexion de mongoDB atlas

~~~
mongodb+srv://meikaku:123456abc@microservices.husof8a.mongodb.net/
~~~
------

## Conectar prisma con Mongo

- En auth-ms instalo prisma
- Creo el schema
- Instalo prisma (es de desarrollo, pongo -D) y genero el cliente

> npx prisma init

> npx prisma generate 

~~~js
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id       String @id @default(auto()) @map("_id") @db.ObjectId
  email    String @unique
  name     String
  password String
}
~~~

- Los scripts
~~~json
 "start:dev": "npm run prisma:docker && nest start --watch",
 "start:debug": "nest start --debug --watch",
~~~

- En el service

~~~js
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcrypt';

import { LoginUserDto, RegisterUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { envs } from 'src/config';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('AuthService');

  constructor(private readonly jwtService: JwtService) {
    super();
  }

  onModuleInit() {
    this.$connect();
    this.logger.log('MongoDB connected');
  }

  async signJWT(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string) {
    try {
      
      const { sub, iat, exp, ...user } = this.jwtService.verify(token, {
        secret: envs.jwtSecret,
      });

      return {
        user: user,
        token: await this.signJWT(user),
      }

    } catch (error) {
      console.log(error);
      throw new RpcException({
        status: 401,
        message: 'Invalid token'
      })
    }

  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, name, password } = registerUserDto;

    try {
      const user = await this.user.findUnique({
        where: {
          email,
        },
      });

      if (user) {
        throw new RpcException({
          status: 400,
          message: 'User already exists',
        });
      }

      const newUser = await this.user.create({
        data: {
          email: email,
          password: bcrypt.hashSync(password, 10), // TODO: encriptar / hash
          name: name,
        },
      });

      const { password: __, ...rest } = newUser;

      return {
        user: rest,
        token: await this.signJWT(rest),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    try {
      const user = await this.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new RpcException({
          status: 400,
          message: 'User/Password not valid',
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        throw new RpcException({
          status: 400,
          message: 'User/Password not valid',
        });
      }

      const { password: __, ...rest } = user;

      return {
        user: rest,
        token: await this.signJWT(rest),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
~~~
----

## Schema con prisma

- Instalo prisma (es de desarrollo, pongo -D) y genero el cliente

> npx prisma init

> npx prisma generate 

~~~js
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id       String @id @default(auto()) @map("_id") @db.ObjectId
  email    String @unique
  name     String
  password String
}
~~~

- En el json creo prisma:docker

~~~json
"prisma:docker": "npx prisma generate",
"start:dev": "npm run prisma:docker && nest start --watch",
~~~
------


