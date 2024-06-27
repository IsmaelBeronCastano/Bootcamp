# 01 NEST SERVER REPORTS

# Cascarón

- Creación del docker-compose.yml
- Tabla de empleados
- Conectar Prisma con Nest
- Creo el proyecto

> nest new reports-server

- Docker, Postgres y PgAdmin
- Creo en la raíz del proyecto el docker-compose.yml
- docker-compose.yml

~~~yml
services:
  db:
    container_name: postgres_database
    image: postgres:16.3
    volumes:
      - ./postgres:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=123456
    restart: always
    ports:
      - "5432:5432"

  pgAdmin:
    depends_on:
      - db
    image: dpage/pgadmin4:8.6
    volumes:
      - ./pgadmin:/var/lib/pgadmin
    ports:
      - "8080:80"
    environment:
      - PGADMIN_DEFAULT_PASSWORD=123456
      - PGADMIN_DEFAULT_EMAIL=superman@google.com
    restart: always
~~~

> docker compose up -d

- Voy a localhost:8080 puedo acceder a pgAdmin
  - Coloco mi usuario superman@google.com y el password 123456
- Configuro el servidor. Clico en servers/new Server
  - En la conexión tomo el nombre del contenedor postgres_database
  - Port 5432
  - Username postgres
  - Password 123456
- Ya tengo configurado pgAdmin con PostgreSQL
- Aquí tengo el archivo employees.sql para crear la db

~~~sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    work_time TIME NOT NULL,
    hours_per_day INT NOT NULL,
    work_schedule VARCHAR(50) NOT NULL
);

INSERT INTO employees (name, position, start_date, work_time, hours_per_day, work_schedule)
VALUES
('Juan Pérez', 'Desarrollador', '2021-01-15', '09:00', 8, 'Lunes a Viernes, 9am - 5pm'),
('Ana Gómez', 'Diseñadora', '2020-03-22', '10:00', 6, 'Lunes a Viernes, 10am - 4pm'),
('Carlos Sánchez', 'Gerente', '2018-11-05', '08:00', 9, 'Lunes a Viernes, 8am - 5pm'),
('María López', 'Analista', '2019-07-11', '09:30', 7, 'Lunes a Viernes, 9:30am - 4:30pm'),
('Pedro Rodríguez', 'Programador', '2021-09-14', '11:00', 6, 'Lunes a Viernes, 11am - 5pm'),
('Lucía Fernández', 'Administrativa', '2020-12-01', '08:30', 8, 'Lunes a Viernes, 8:30am - 4:30pm'),
('José Martínez', 'Contador', '2017-05-19', '09:00', 8, 'Lunes a Viernes, 9am - 5pm'),
('Laura Ramírez', 'Desarrolladora', '2018-06-07', '10:00', 7, 'Lunes a Viernes, 10am - 5pm'),
('Miguel Torres', 'Soporte Técnico', '2021-03-16', '09:00', 8, 'Lunes a Viernes, 9am - 5pm'),
('Sara Morales', 'Recursos Humanos', '2019-09-23', '08:00', 7, 'Lunes a Viernes, 8am - 3pm'),
('David Vega', 'Desarrollador', '2022-02-14', '09:30', 7, 'Lunes a Viernes, 9:30am - 4:30pm'),
('Elena Ortiz', 'Diseñadora', '2021-11-10', '10:30', 6, 'Lunes a Viernes, 10:30am - 4:30pm'),
('Jorge Herrera', 'Gerente', '2016-04-18', '08:00', 9, 'Lunes a Viernes, 8am - 5pm'),
('Isabel Domínguez', 'Analista', '2019-02-05', '09:00', 8, 'Lunes a Viernes, 9am - 5pm'),
('Ricardo Ruiz', 'Programador', '2020-10-22', '10:00', 7, 'Lunes a Viernes, 10am - 5pm'),
('Patricia Flores', 'Administrativa', '2018-08-30', '08:30', 8, 'Lunes a Viernes, 8:30am - 4:30pm'),
('Roberto Castillo', 'Contador', '2017-12-12', '09:00', 8, 'Lunes a Viernes, 9am - 5pm'),
('Adriana Reyes', 'Desarrolladora', '2021-06-25', '09:30', 7, 'Lunes a Viernes, 9:30am - 4:30pm'),
('Santiago García', 'Soporte Técnico', '2020-01-13', '08:00', 8, 'Lunes a Viernes, 8am - 4pm'),
('Verónica Ríos', 'Recursos Humanos', '2019-04-17', '09:00', 7, 'Lunes a Viernes, 9am - 4pm');
~~~

- Creo la carpeta de queries fuera de src para ir almacenándolos
- En pgAdmin, clico el botón de Quey Tool
- Debo estar en postgres/postgres@Reports database
- Pego el código y le doy alk play para ejecutar
- Si en Tables clico refresh veré la tabla de empleados
- Si en el query coloco

~~~sql
select * from employees
~~~

- Obtengo toda la data
--------

## Conectar Nest con prisma

- Instalo prisma

> npm i prisma

- o puedo usar el CLI

> npx prisma init 

- Configuro la .env para la DB

~~~
DATABASE_URL="postgresql://postgres:123456@localhost:5432/postgres"
~~~

- Instalo el cliente

> npm i @prisma/client

- Genero un proyecto dentro de nest-report-server sin los endpoints del CRUD

> nest g res basic-reports --no-spec

- Hago la conexión en el service

~~~js
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BasicReportsService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    // console.log('Connected to the database');
  }

  async hello() {
    return this.employees.findFirst();
  }
}
~~~

- Ejecuto **npx prisma db pull**
- Esto genera un schema basado en lo que hay en mi db a través del string de conexión
- En el schema obtengo esto

~~~prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model employees {
  id            Int      @id @default(autoincrement())
  name          String   @db.VarChar(100)
  position      String   @db.VarChar(50)
  start_date    DateTime @db.Date
  work_time     DateTime @db.Time(6)
  hours_per_day Int
  work_schedule String   @db.VarChar(50)
}
~~~

- Genero el cliente con **npx prisma generate**
- Levanto el server

> npm run start:dev

- Creamos el README

~~~md
# Ejecutar en Dev

1. Clonar el repositorio
2. Instalar dependencias `npm install`
3. Clonar `env.template` y renombrar a `.env` y completar las variables de entorno en .env
4. Levantar la base de datos `docker compose up -d`
5. Generar el Prisma client `npx prisma generate`
6. Ejecutar proyecto `npm run start:dev`
~~~