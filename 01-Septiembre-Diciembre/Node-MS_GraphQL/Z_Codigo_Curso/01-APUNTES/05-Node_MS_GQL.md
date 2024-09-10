# NODE MICROSERVICIOS - 05 REST API con Nest

- Uso el CLI para crear el primer microservicio

> nest new courses-ms

- Primero haremos una API, luego la pasaremos a microservicio
- Tengo un CRUD COMPLETO
- Conexion a **Prisma**
- Hay que instalar Prisma como dependencia de desarrollo 

> npm i -D prisma
> npx prisma init

- También pueso usar npx prisma generate
- Esto crea la carpeta prisma y el archivo .env con una URL de deb (la borro, es de postgres)
- Puedo usar la db que he puesto a mano en mongoCompass

> npx prisma db push

- Para que no de problema de conexión por autorización añado a la variable de entorno donde he colocado la URL de la db

> DATABASE_URL=mongodb://user:password/authdb?retryWrites=true&=majority **&authSource=admin**


- Aquí tengo el schema (para autocompletado instalar extension Prisma)

~~~js
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}


model Course {
  id String @default(uuid()) @id //debo remarcar con @id que es un id para que no de error
  title String
  description String
  author_id String
  active Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([author_id, active])
} 
~~~

- Si no quiero usar uuid puedo usar *id String @default(autoincrement()) @id*
- Con @@index indico los campos que quiero indexar
- Estos indices van a hacer unas copias en el disco para acceder más rápido
- La URL de conexión en el artchivo creado por prisma será (SQLite)

> file:./course.db

- Hago la migración 
> npx prisma migrate dev --name init
-----

## Insertar datos

- Para sqlite puedo usar TablePlus para poder visualizar (en el curso al principio usa sqlite)
- Puedo aplicar cambios desde la linea de comandos (por ejemplo usar un integer en lugar de uuid)
- Debo usar *id String @default(autoincrement()) @id* entonces

> npx prisma migrate dev --name change uuid to int in id field

- Puedo insertar datos desde TablePlus
-----
## Microservicios


- El courses-ms/src/main.ts

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
        queue: QueuesEnum.CoursesQueue,
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

- courses/src/app.module

~~~js
import { Module } from "@nestjs/common";
import { CourseModule } from "./course/course.module";

@Module({
  imports: [CourseModule],
})
export class AppModule {}
~~~

- courses-ms/src/course/course.module.ts

~~~js
import { Module } from "@nestjs/common";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";

@Module({
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
~~~

- En el controller usamos MessagePattern y Payload (ya no hay decoradores como @Body() o @Params())
- courses-ms/src/course.controller.ts


~~~js
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

import { CourseService } from "./course.service";
import { PaginationDto } from "./dto/pagination.dto";

@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @MessagePattern({ cmd: "healt_course" })
  healt() {
    return { healt: true };
  }

  @MessagePattern({ cmd: "get_all_courses" })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.courseService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: "get_course" })
  findOne(@Payload("id") id: string) {
    return this.courseService.findOne(id);
  }

  @MessagePattern({ cmd: "create_course" })
  create(@Payload() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @MessagePattern({ cmd: "update_course" })
  update(@Payload() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(updateCourseDto);
  }

  @MessagePattern({ cmd: "delete_course" })
  remove(@Payload("id") id: string) {
    return this.courseService.remove(id);
  }

  @MessagePattern({ cmd: "hard_delete_course" })
  removeHard(@Payload("id") id: string) {
    return this.courseService.removeHard(id);
  }
}
~~~

- En el servicio usamos el cliente de Prisma para comunicarnos con la db
- extiende de PrimsaClient e implementa onModuleInit
- hago la conexión con onModuleInit y await this.$connect()
- No hace falta inyectar nada
- Es this.course porque lo llamamos Course en el Schema


~~~js
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

import { RpcException } from "@nestjs/microservices";
import { CreateCourseDto } from "./dto/create-course.dto";
import { PaginationDto } from "./dto/pagination.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Injectable()
export class CourseService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger("Course Service");

  async onModuleInit() {
    await this.$connect();
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const currentPage = paginationDto.page - 1;
      const limit = paginationDto.limit;

      const courses = await this.course.findMany({
        where: {
          active: true,
        },
        take: limit,
        skip: currentPage * limit,
      });

      return courses;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  findOne(id: string) {
    return this.course.findUnique({
      where: {
        id,
        active: true,
      },
    });
  }

  async create(createCourseDto: CreateCourseDto) {
    try {
      const course = await this.course.create({
        data: createCourseDto,
      });

      return course;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  update(updateCourseDto: UpdateCourseDto) {
    return this.course.update({
      data: updateCourseDto,
      where: {
        id: updateCourseDto.id,
      },
    });
  }

  remove(id: string) {
    // soft delete => Eliminación suave o eliminación lógica
    return this.course.update({
      data: {
        active: false,
      },
      where: {
        id,
      },
    });
  }

  removeHard(id: string) {
    // hard delete => Eliminación fisica
    return this.course.delete({
      where: {
        id,
      },
    });
  }
}
~~~

- Cargo con Docker la imagen de mysql en la raíz (fuera de src)

~~~yml
version: "3.1"
services:
  db:
    image: mysql
    command: --default-authentication-plugin=mysql_native_password
    restart: always
    ports:
      - 3306:3306
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_DATABASE: courses
~~~

- .env course-ms

~~~
DATABASE_URL="file:./course.db
PORT=3001
~~~
-----

## APi-Gateway 

- Crearemos el cliente
- Nos permitirá comunicarnos desde fuera con el microservicio

> nest new api-gateway

- Correrá en el puerto 3000 (variable de entorno PORT)
- Me quedo solo con el **main.ts** y el **app.module**
- Creo el resource de course dentro de api-gateway/src

> nest g res course

- 
- Dejo solo el .module, .controller y el main.ts
- Necesitamos registrar el módulo para crear el cliente
- Debo tener instalado @nestjs/microservices (usar npm)
- En api-gateway/src/course/course.module,ts

~~~js
import { Module } from "@nestjs/common";

import { ClientsModule, Transport } from "@nestjs/microservices";

import { CourseController } from "./course.controller";

import { QueuesEnum, ServicesTokens } from "../enums";

import { envs } from "../config/envs";

@Module({
  controllers: [CourseController],
  providers: [],
  imports: [
          {
        name: ServicesTokens.COURSE_SERVICE,//le paso el token de inyección
        transport: Transport.RMQ, 
        options: {
          urls: [envs.rmqUrl], //conecto a RabbitMQ
          queue: QueuesEnum.CoursesQueue,
          queueOptions: {
            durable: true,
          },
          noAck: true,
        },
      },

  ],
})
export class CourseModule {}
~~~

. Creo un api-gateway/src/enum/services.enum.ts para manejar los tokens de inyección

~~~js
export enum ServicesTokens {
  COURSE_SERVICE = "COURSE_SERVICE",
  AUTH_SERVICE = "AUTH_SERVICE",
}
~~~

- Puedo crear un archivo index dentro de enums para mejorar las importaciones

~~~js
export * from "./queues.enum";
export * from "./services.enum";
~~~

- En el main de api-gateway debo configurarlo como una API REST, no es un microservicio
- main de api-gateway

~~~js
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

import { envs } from "./config/envs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(envs.port);
}
bootstrap();
~~~

- En el api-gateway/src/course/course.controller.ts uso @inject para inyectar el token que tengo en enums
- Uso CLientProxy que se comunicará con el módulo que he registrado gracias al token de inyección
- Uso .send porque **me importa la respuesta**, si no me importara usaría emit
- Para comunicarme uso el patrón que le pasé a courses-ms/src/courses.controller.ts
- Debe ser idéntico, si le pasé un objeto, coloco un objeto.
- El tema de** UseGuards(AuthGuard) se verá más adelante**
- Para trabajar con los Payloads usaremos **Pipes** para transformar la data
- api-gateway/src/course/course.controller.ts

~~~js
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";

import { ClientProxy } from "@nestjs/microservices";

import { AuthGuard } from "../auth/guards/auth.guard";
import { ServicesTokens } from "../enums";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Controller("course")
export class CourseController {
  private readonly logger = new Logger("Course Controller");

  constructor(
    @Inject(ServicesTokens.COURSE_SERVICE)
    private readonly courseService: ClientProxy,
  ) {}

  @Get("healt")
  healt() {
    return this.courseService.send({ cmd: "healt_course" }, {}); //si no envio data envío un objeto vacío
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(          //Uso un pipe para pasar de string a número los query
    @Query("limit", ParseIntPipe) limit: number = 5,
    @Query("page", ParseIntPipe) page = 1,
  ) {
    return this.courseService.send({ cmd: "get_all_courses" }, { limit, page });
  }

  @UseGuards(AuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.courseService.send({ cmd: "get_course" }, { id });
  }

  @UseGuards(AuthGuard)
  @Post()                                            //obtengo la request, veremos porqué 
  create(@Body() createCourseDto: CreateCourseDto, @Request() request) {
    createCourseDto.author_id = request.user.id; //me pide el author_id

    return this.courseService.send(
      { cmd: "create_course" },
      { ...createCourseDto }, //uso el spread para crear una copia
    );
  }

  @UseGuards(AuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.send(
      { cmd: "update_course" },
      { ...updateCourseDto, id },
    );
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.courseService.send({ cmd: "delete_course" }, { id });
  }

  @UseGuards(AuthGuard)
  @Delete("hard/:id")
  removeHard(@Param("id") id: string) {
    return this.courseService.send({ cmd: "hard_delete_course" }, { id });
  }
}
~~~

- En **courses-ms** es donde tengo los patrones cmd con los que me comunico y el servicio (de courses-ms) inyectado
- courses/src/course/course.controller.ts

~~~js
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

import { CourseService } from "./course.service";
import { PaginationDto } from "./dto/pagination.dto";

@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @MessagePattern({ cmd: "healt_course" })
  healt() {
    return { healt: true };
  }

  @MessagePattern({ cmd: "get_all_courses" })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.courseService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: "get_course" })
  findOne(@Payload("id") id: string) {
    return this.courseService.findOne(id);
  }

  @MessagePattern({ cmd: "create_course" })
  create(@Payload() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @MessagePattern({ cmd: "update_course" })
  update(@Payload() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(updateCourseDto);
  }

  @MessagePattern({ cmd: "delete_course" })
  remove(@Payload("id") id: string) {
    return this.courseService.remove(id);
  }

  @MessagePattern({ cmd: "hard_delete_course" })
  removeHard(@Payload("id") id: string) {
    return this.courseService.removeHard(id);
  }
}
~~~

- En el **service**de course-ms/src/course/course.service.ts es donde conecto con Prisma para interactuar con la db

~~~js
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

import { RpcException } from "@nestjs/microservices";
import { CreateCourseDto } from "./dto/create-course.dto";
import { PaginationDto } from "./dto/pagination.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Injectable()
export class CourseService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger("Course Service");

  async onModuleInit() {
    await this.$connect();
  }

  async findAll(paginationDto: PaginationDto) {
    try {         
      const currentPage = paginationDto.page - 1;
      const limit = paginationDto.limit;

      const courses = await this.course.findMany({
        where: {
          active: true,
        },
        take: limit, //paginación con Prisma
        skip: currentPage * limit,
      });

      return courses;
    } catch (error) {
      throw new RpcException(error.message); //se verá mas adelante
    }
  }

  findOne(id: string) {
    return this.course.findUnique({
      where: {
        id,
        active: true,
      },
    });
  }

  async create(createCourseDto: CreateCourseDto) {
    try {
      const course = await this.course.create({
        data: createCourseDto,
      });

      return course;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  update(updateCourseDto: UpdateCourseDto) {
    return this.course.update({
      data: updateCourseDto,
      where: {
        id: updateCourseDto.id,
      },
    });
  }

  remove(id: string) {
    // soft delete => Eliminación suave o eliminación lógica
    return this.course.update({
      data: {
        active: false,
      },
      where: {
        id,
      },
    });
  }

  removeHard(id: string) {
    // hard delete => Eliminación fisica
    return this.course.delete({
      where: {
        id,
      },
    });
  }
}
~~~

- Al usar microservicios, lo que me devuelve el findAll es un Observable de tipo any
- Puedo colocar el observable como valor de retorno

~~~js
@UseGuards(AuthGuard)
@Get(":id")
findOne(@Param("id") id: string) : Observable<any> {
  return this.courseService.send({ cmd: "get_course" }, { id });
}
~~~

- Debo copiar los dto de courses-ms a api-gateway/src/courses/dtos

~~~js
import { IsOptional, IsString } from "class-validator";

// DTO => Data Transfer Object

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  author_id: string;
}
~~~

- ESTOY APUNTANDO AL PUERTO 3000 DE LOCALHOST +  ENDPOINT del controller
-----

## AUTH: Microservicios híbridos con REST


- El microservicio puede comunicarse por http y por comunicación interna de microservicios con la que se añade una capa de seguridad
- Son híbridos porque usan ambos protocolos
- Este microservicio usará su propia db (con mongo)
- Generaremos un AuthGuard, que usaremos para autorizar conexiones
- El gateway es el que se conecta y decide si puede seguir al siguiente ms o no 
- Usaremos TCP de entrada pero al final cambiaremos a RabbitMQ y asignaremos RMQ a este auth-ms

### Iniciando ms

- Creo un nuevo ms agnóstico fuera de api-gateway

> nest new auth-ms

-
- Usaremos RabbitMQ para comunicar la api-gateway con el ms
- El main de auth-ms es así
- auth-ms/src/main.ts

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

La variable de entorno de RMQ es algo asi
- auth-ms/.env

~~~
~~~

- El queues.enum es así
- auth-ms/src/enums/queue.enum.ts

~~~js
export enum QueuesEnum {
  AuthQueue = "AuthQueue",
}
~~~

- El app.module queda tal cual
- auth-ms/src/app.module

~~~js
import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
~~~

- Dentro de auth-ms creamos el módulo de auth, el controller y el service el auth.module queda así

> nest g mo auth
> nest g co auth
> nest g s auth

- Importo el módulo de JWT de @nestjs/jwt y uso el método register al que le paso la variable de la SECRET_KEY
- Le digo que el token expire en 1 hora
- En auth-ms/src/auth/auth.module.ts

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

- El Schema de Prisma queda así
- auth/prisma/schema.prisma

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
  id String @map("_id") @id @default(auto()) @db.ObjectId
  
  email String @unique
  password String
  username String
  
  active Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
~~~

- Dentro de auth-ms/src/auth/controller

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

- Veamos el servicio!
- auth-ms/src/auth/auth.service.ts

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

  async register(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;

    if (await this.validateUserEmail(email))
      throw new RpcException("Email already exists");

    createUserDto.password = this.hashPassword(password);

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password: _,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      active: __,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updatedAt: ___,
      ...user
    } = await this.user.create({
      data: createUserDto,
    });

    return {
      ...user,
      token: this.signToken({
        id: user.id,
        email,
      }),
    };
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
      ...user,
      token: this.signToken({
        id: user.id,
        email,
      }),
    };
  }

  verifyToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWTSecret,
    });

    if (!payload) throw new UnauthorizedException();

    return {
      token: this.signToken({ id: payload.id, email: payload.email }),
      user: {
        id: payload.id,
        email: payload.email,
      },
    };
  }
}
~~~

- El dto de createUser (en auth-ms)

~~~js
import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @IsString()
  username: string;
}
~~~

- El dto del login

~~~js
import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class LoginUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
~~~

- Para usar mongo uso docker
- docker.compose.yml

~~~yml
version: "3.1"
services:
  mongo:
    image: mongo
    container_name: mongo_auth
    restart: always
    ports:
      - 27017:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: yirsis
      MONGO_INITDB_ROOT_PASSWORD: BbYa0C2fOtR6
~~~

- Conectando el microservicio al gateway
- En el api-gateway/arc/auth/auth.module.ts

~~~js
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { AuthController } from "./auth.controller";

import { QueuesEnum, ServicesTokens } from "../enums";

import { envs } from "../config/envs";

@Module({
  controllers: [AuthController],
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
})
export class AuthModule {}
~~~

- En el controller le inyecto el token usando CLientProxy
- api-gateway/src/auth/auth.controller

~~~js
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { ServicesTokens } from "../enums";

import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";
import { AuthGuard } from "./guards/auth.guard";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(ServicesTokens.AUTH_SERVICE)
    private readonly authService: ClientProxy,
  ) {}

  @Get()
  healt() {
    return this.authService.send("auth.healt", {});
  }

  @UseGuards(AuthGuard)
  @Get("verify-token")
  verifyToken(@Request() request: any) {
    return { token: request.token, user: request.user };
  }

  @Post("login")
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.send("auth.login", { ...loginUserDto });
  }

  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.send("auth.register", { ...createUserDto });
  }
}
~~~

- En api-gateway/src/auth/guards/auth.guard.ts

~~~js
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { ClientProxy } from "@nestjs/microservices";
import { Request } from "express";
import { firstValueFrom } from "rxjs";
import { ServicesTokens } from "../../enums";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(ServicesTokens.AUTH_SERVICE) //inyecto AUTH_SERVICE
    private readonly authService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); //obtengoi la request
    const token = this.extractTokenFromHeader(request); //desestructuro el token

    if (!token) throw new UnauthorizedException();

    const { token: renewToken, user } = await firstValueFrom( //renombro token a renewToken
      this.authService.send("auth.verify.token", { token }), //mando el token al ms
    );

    request["token"] = renewToken; //guardo el nuevo token en la request
    request["user"] = user; //guardo el user en la request

    return renewToken;
  }
                          //helper para extraer el token
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
~~~

- En api-gateway/src/auth/config/envs hago la validación de las variables de entorno con **joi**

~~~js
import "dotenv/config";

import * as joi from "joi";

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    RMQ_URL: joi.string().required(),
  })
  .unknown(true); //dejo el unknown en true para el resto de variables de Node

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

- **RESUMEN**

- En el main del ms creo el microservicio

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

  await app.listen(); //le quito el puerto para que no marque errores
}
bootstrap();
~~~

- Si trabajara con la capa de transporte TCP pondría Transport.TCP y en un objeto oprions el port: 3001, por ejemplo

- Lo comunico con el api-gateway resgistrándolo en el api-gateway/src/auth/auth.module

~~~js
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { AuthController } from "./auth.controller";

import { QueuesEnum, ServicesTokens } from "../enums";

import { envs } from "../config/envs";

@Module({
  controllers: [AuthController],
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
})
export class AuthModule {}
~~~

- Desde el controller del api-gateway me comunico con el controller del ms
- El api-gateway es lo que expongo al exterior
- Luego me comunico internamente a través del ClientProxy con el controller del auth-ms usando el token de inyección y el decorador @Inject de @nestjs/common (!)
- El spread operator es importante!
- api-gateway/src/auth/auth.controller

~~~js
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { ServicesTokens } from "../enums";

import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";
import { AuthGuard } from "./guards/auth.guard";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(ServicesTokens.AUTH_SERVICE)
    private readonly authService: ClientProxy,
  ) {}

  @Get()
  healt() {
    return this.authService.send("auth.healt", {});
  }

  @UseGuards(AuthGuard)
  @Get("verify-token")
  verifyToken(@Request() request: any) {
    return { token: request.token, user: request.user };
  }

  @Post("login")
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.send("auth.login", { ...loginUserDto }); //usar el spread operattor!!
  }

  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.send("auth.register", { ...createUserDto });
  }
}
~~~

- El .send está llamado al controlador del auth-ms, desde donde me comunico con el authService

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

- El authService (solo hay uno y está en auth-ms)

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

  async register(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;

    if (await this.validateUserEmail(email))
      throw new RpcException("Email already exists");

    createUserDto.password = this.hashPassword(password);

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password: _,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      active: __,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updatedAt: ___,
      ...user
    } = await this.user.create({
      data: createUserDto,
    });

    return {
      ...user,
      token: this.signToken({
        id: user.id,
        email,
      }),
    };
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
      ...user,
      token: this.signToken({
        id: user.id,
        email,
      }),
    };
  }

  verifyToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWTSecret,
    });

    if (!payload) throw new UnauthorizedException();

    return {
      token: this.signToken({ id: payload.id, email: payload.email }),
      user: {
        id: payload.id,
        email: payload.email,
      },
    };
  }
}
~~~

- En el course.module del api-gateway también debo registrar el microservicio de auth y el de course, claro!

~~~js
import { Module } from "@nestjs/common";

import { ClientsModule, Transport } from "@nestjs/microservices";

import { CourseController } from "./course.controller";

import { QueuesEnum, ServicesTokens } from "../enums";

import { envs } from "../config/envs";

@Module({
  controllers: [CourseController],
  providers: [],
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
})
export class CourseModule {}
~~~

- Tengo dos enums en la carpeta api-gateway/src/enums
- El services.enum

~~~js
export enum ServicesTokens {
  COURSE_SERVICE = "COURSE_SERVICE",
  AUTH_SERVICE = "AUTH_SERVICE",
}
~~~

- Y el queues enum

~~~js
export enum QueuesEnum {
  AuthQueue = "AuthQueue",
  CoursesQueue = "CoursesQueue",
}
~~~

- Por ahora tengo dos microservicios (auth y courses) y un API REST que es el cliente api-gateway

# Cuando no envío nada en el .send, solo el objeto con cmd:lo.que.sea, debo mandar un objeto vacío a continuación, representando la data del payload

~~~js
  @Get()
  healt() {
    return this.authService.send("auth.healt", {});
  }
~~~

- Necesito los dtos tanto en el ms como en el api-gateway
- En el api-gateway tengo el auth.module, que es donde registro el microservicio

~~~js
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { AuthController } from "./auth.controller";

import { QueuesEnum, ServicesTokens } from "../enums";

import { envs } from "../config/envs";

@Module({
  controllers: [AuthController],
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
})
export class AuthModule {}
~~~

- En el controller tengo los métodos Get, Post, y todos los decoradores
- Direcciono al microservicio usando el mismo cmd
- Es importante usar el spread operator en el envío de la data para que no de error
- api-gateway/src/auth/auth.controller
~~~js
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { ServicesTokens } from "../enums";

import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";
import { AuthGuard } from "./guards/auth.guard";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(ServicesTokens.AUTH_SERVICE)
    private readonly authService: ClientProxy,
  ) {}

  @Get()
  healt() {
    return this.authService.send("auth.healt", {});
  }

  @UseGuards(AuthGuard)
  @Get("verify-token")
  verifyToken(@Request() request: any) {
    return { token: request.token, user: request.user };
  }

  @Post("login")
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.send("auth.login", { ...loginUserDto }); //usar spread operator!!
  }

  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.send("auth.register", { ...createUserDto });
  }
}
~~~

- En api-gateway/src/auth/guards tengo mi versión del AuthGuard

~~~js
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { ClientProxy } from "@nestjs/microservices";
import { Request } from "express";
import { firstValueFrom } from "rxjs";
import { ServicesTokens } from "../../enums";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(ServicesTokens.AUTH_SERVICE)
    private readonly authService: ClientProxy,   //Inyecto el AUTH_SERVICE como ClientProxy
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); //extraigo la request
    const token = this.extractTokenFromHeader(request); //extraigo el token con este método 

    if (!token) throw new UnauthorizedException(); //lanzo un error si no hay token

    const { token: renewToken, user } = await firstValueFrom(
      this.authService.send("auth.verify.token", { token }),
    );

    request["token"] = renewToken; //le paso el token a la request
    request["user"] = user; //y el user también

    return renewToken;
  }
                          //método para extraer el token
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
~~~

- Es en el servicio de auth-ms donde está toda la mandanga, como verificar el token, etc
--------










