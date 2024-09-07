# NODE MICROSERVICIOS - REST API con Nest

- Uso el CLI para crear el primer microservicio

> nest new courses-ms

- Primero haremos una API, luego la pasaremos a microservicio
- Tengo un CRUD COMPLETO
- Conexion a **Prisma**
- Hay que instalar Prisma como dependencia de desarrollo 

> npm i -D prisma
> npx prisma init

- Esto crea la carpeta prisma y el archivo .env con una URL de deb (la borro, es de postgres)
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
- 

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
-----

## APi-Gateway 

- Crearemos el cliente
- Nos permitirá comunicarnos desde fuera con el microservicio

> nest new api-gateway


