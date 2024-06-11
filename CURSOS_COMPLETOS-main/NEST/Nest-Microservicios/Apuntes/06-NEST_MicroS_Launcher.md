# NEST MICROSERVICIOS - LAUNCHER (DOCKER)

- Un comando para levantar todo y tenerlo todo en una terminal
- Es bastante común trabajar con monorepos que contienen referencias a otros repositorios
----

## Crear red y levantar todo con un solo comando

- En mi código no habrá la relación con los submódulos para conectar con los microservicios, pero si dejaré la documentación aquí
- Creo el docker-compose.yml en la raíz del launcher

~~~yml
version: '3'


services:

  # levanto el nats
  nats-server:
    image: nats:latest # descargo la última verisión de la imagen de nats
    ports:
      - "8222:8222" # el 8222 es el puerto por defecto junto al 4222, mirar la docu
                    # exponer estos puertos es para que el mundo exterior pueda llegar a NATS, no la red interna
                    # 8222 me ofrece el servicio de poder monitorear quien se conecta, etc
                    # por lo que estaría exponiendo el puerto en la zona externa entre el cliente y el gateway
                    # en la vida real podría quitarlo, no necesito exponerlo

  client-gateway: #nombro mi servicio, necesito crear una imagen para montarla en un contenedor
    build: ./client-gateway # vendrá a esta ruta a buscar el dockerfile
    ports:
      - ${CLIENT_GATEWAY_PORT}:3000 #comunico el puerto de mi computadora con el del contenedor
    volumes:
      - ./client-gateway/src:/usr/src/app/src #puedo enfocarme solo en el src, lo mapeo a usr/src/app/src (node tiene este path)
    command: npm run start:dev
    environment: # definimos las variables de entorno (es como tener mi .env aqui, las validaciones que hice aplican aqui)
      - PORT=3000 
      - NATS_SERVERS=nats://nats-server:4222 # coloco nats-server en lugar de localhost porque asi se llama el servicio y le pone nombre al contenedor

  products-ms: # este es el nombre del server(imagen de Docker)
    build: ./products-ms
    volumes:
      - ./products-ms/src:/usr/src/app/src # mapeo el src
    command: npm run start:dev
    environment:
      - PORT=3001
      - NATS_SERVERS=nats://nats-server:4222
      - DATABASE_URL=file:./dev.db # products está en el filesystem porque uso SQLite

  
  # Orders MS
  orders-ms:
    depends_on:
      - orders-db #este microservicio no se debe levantar hasta que orders-db se levante (levantar, no construir)
    build: ./orders-ms
    volumes:
      - ./orders-ms/src:/usr/src/app/src
    command: npm run start:dev
    environment:
      - PORT=3002                                  # apuntando a docker, no tengo localhost, tego orders-db (así llamé al servicio)
      - DATABASE_URL=postgresql://postgres:123456@orders-db:5432/ordersdb?schema=public # lo conecto al puerto de la imagen
      - NATS_SERVERS=nats://nats-server:4222



  # Orders DB     también descargoi la imagen de postgres!!
  orders-db:
    container_name: orders_database
    image: postgres:16.2
    restart: always
    volumes:
      - ./orders-ms/postgres:/var/lib/postgresql/data
    ports:
      - 5434:5432
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=123456
      - POSTGRES_DB=ordersdb

~~~
- No se recomienda usar el tag :latest porque luego se despliega y se hacen versiones incompatibles. No hacer en producción (se suben manualmente)
- NATS ya está dentro de la red, detrás del Gateway que comunica con el exterior
- La idea de exponer los puertos 4222, 8222 es para que el mundo exterior pueda llegar a ellos, no la red interna
- El puerto que me interesa es el 8222 porque me facilita el servicio para la monitorización de NATS desde el navegador
- El nombre del servidor es exactamente igual al nombre del servicio donde levanto la imagen de NATS en el archivo de docker
- En lugar de localhost en el string de conexión, pondré nats-server, lo mismo en las variables de entorno del .ym en environment
- Para la DATABASE_URL En el caso de products coloco el archivo del filesystem de la carpeta de prisma
- Para postgres la dirección de la imagen de Docker
- Empezando por el client-gateway, voy a necesitar configurar el dockerfile en la raíz

~~~dockerfile
FROM node:20-alpine3.19 /*tomo la imagen de NODE*/

WORKDIR /usr/src/app    /*desde aqui trabajaremos, es donde colocaremos la app*/

COPY package.json ./    /*copiamos el json*/
COPY package-lock.json ./


RUN npm install          /*instalamos las dependencias porque en mi maquina tengo un linux, no son las mismas*/

COPY . .                 /*copiamos todo lo que no está ignorado en el dockerignore*/

EXPOSE 3000              /*expongo el puerto de client-gateway*/
~~~

- Creo el .dockerignore ( es el mismo para prodcuts y orders)

~~~
dist/

node_modules/

.env

.vscode/
~~~

- Debo crear el dockerfile en products y orders
- En products dockerfile llamo **npx prisma generate**, pero esto no va a funcionar en la vida real
- Aqui funciona porque uso SQLite y tengo la Db en el fileSystem ya creada, en la vida real usaría postgres o mongo
- Si no tenemos la db ni las migraciones, lo que tengo en mi Schema debería ser suficiente para crear mi db
- Pero desde el dockerfile estamos construyendo la imagen
- Mi Schema lo ocupo para ejecutarlo
- npx prisma generate solo es útil **si la DB YA EXISTE** por lo que con products si va a funcionar, pero con postgres no
- Si no existiera crear con **npx prisma migrate dev --name init**
- Me aseguro de tener data en la DB
- products dockerfile

~~~dockerfile
FROM node:20-alpine3.19

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./


RUN npm install

COPY . .

RUN npx prisma generate 


EXPOSE 3001
~~~

- Para solucionar este problema en products y en orders creo un nuevo script en el json y lo coloco en el start:dev
- No hace falta usar npx porque ya hemos creado el cliente desde el dockerfile products-ms  

~~~json
{
  "docker:start":"prisma migrate dev && prisma generate",
  "start:dev":"npm run docker:start && nest start --watch"
}
~~~

- orders dockerfile

~~~dockerfile
FROM node:20-alpine3.19

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./


RUN npm install

COPY . .

EXPOSE 3002
~~~

- En las .envs de orders-microservice coloco el string de conexión

~~~
PORT=3002


PRODUCTS_MICROSERVICE_HOST=localhost
PRODUCTS_MICROSERVICE_PORT=3001

DATABASE_URL="postgresql://postgres:123456@orders-db:5432/ordersdb?schema=public"

# NATS_SERVERS="nats://localhost:4222,nats://localhost:4223"
NATS_SERVERS="nats://localhost:4222"
~~~

- Si observamos en Docker, nos podemos conectar a orders-db porque estamos mapeando los puertos
- En la vida real esto no sería necesario, exponer la db de esta manera con 5432:5432
- Si lo quito del docker-compose sigue funcionando igual pero tengo un error en TablePlus porque ya no tengo el puerto 
- Es genial, porque vamos a crear **una red encapsulada** para que los servicios puedan comunicarse entre si basado en los nombres de los servidores
- **ESTO ES INCREIBLE**
- Vamos a dejar el puerto porque me interesa seguir trabajando con TablePlus 
------

## Expandir nuestro Custom Exception Filter

- Cuando un microservicio no se levanta nos manda un error de Empty response. There are no subscribers listening to that message "string del message pattern"
- Para centralizar las excepciones en client-gateway/src/exception/custom-esception.filter
- En este momento, si voy al client-gateway.orders.controller **no estoy disparando el exceptionFilter**
- Si todo lo estoy manejando mediante un try y un catch, lo coherente es usarlo también en findAll

~~~js
@Get()
findAll( @Query() orderPaginationDto: OrderPaginationDto ) {
  try{
    const orders = await this.client.send('findAllOrders', orderPaginationDto);
    return orders
  }catch(error){
    throw new RpcException(error)
  }
}
~~~


- No hay muchas opciones para manejar el error. exception.name devuelve 'Error' y getError().toString tampoco resuelve mucho
- Tengo una manera usando el .includes con el string que devuelve el error del microservicio no conectado "Empty response etc" 
- client-gateway.microservice/common/exceptions/rpc-custom-exception.filter.ts

~~~js
import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();

    if(rpcError.toString().includes('Empty response')){
      return response.status(500).json({
        status: 500,
        //no me interesa mandar el string del messagePattern en el manejo de la excepción. Es info valiosa
        //uso toSubstring para quedarme con el error desde el principio hasta el paréntesis (donde aparece el string del controlador del microservicio) y le resto 1 para que no incluya el paréntesis
        message: rpcError.toString().substring(0, rpcError.toString().indexOf('(', -1))
      })
    }

    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const status = isNaN(+rpcError.status) ? 400 :+rpcError.status;
      return response.status(status).json(rpcError);
    }

    response.status(400).json({
      status: 400,
      message: rpcError,
    });
  }
}
~~~
-----

## Monorepo o no monorepo

- Para usar submódulos paso el README

~~~md
## Dev

1. Clonar el repositorio
2. Crear un .env basado en el .env.template
3. Ejecutar el comando `git submodule update --init --recursive` para reconstruir los sub-módulos
4. Ejecutar el comando `docker compose up --build`


### Pasos para crear los Git Submodules

1. Crear un nuevo repositorio en GitHub
2. Clonar el repositorio en la máquina local
3. Añadir el submodule, donde `repository_url` es la url del repositorio y `directory_name` es el nombre de la carpeta donde quieres que se guarde el sub-módulo (no debe de existir en el proyecto)
```
git submodule add <repository_url> <directory_name>
```
4. Añadir los cambios al repositorio (git add, git commit, git push)
Ej:
```
git add .
git commit -m "Add submodule"
git push
```
5. Inicializar y actualizar Sub-módulos, cuando alguien clona el repositorio por primera vez, debe de ejecutar el siguiente comando para inicializar y actualizar los sub-módulos
```
git submodule update --init --recursive
```
6. Para actualizar las referencias de los sub-módulos
```
git submodule update --remote
```


## Importante
Si se trabaja en el repositorio que tiene los sub-módulos, **primero actualizar y hacer push** en el sub-módulo y **después** en el repositorio principal. 

Si se hace al revés, se perderán las referencias de los sub-módulos en el repositorio principal y tendremos que resolver conflictos.
~~~

- En la raíz del Launcher que alberga orders, products, etc coloco el .gitmodules con las direcciones de los repos (en este caso de Herrera)

-.gitmodules
~~~
[submodule "client-gateway"]
	path = client-gateway
	url = https://github.com/Nest-Microservices-DevTalles/client-gateway.git
[submodule "products-ms"]
	path = products-ms
	url = https://github.com/Nest-Microservices-DevTalles/products-microservice.git
[submodule "orders-ms"]
	path = orders-ms
	url = https://github.com/Nest-Microservices-DevTalles/orders-microservice.git
~~~

## Trabajar basado en el Launcher

- Aquí fernando ha dado seguimiento a los archivos fuera de los microservicios como el docker-compose.yml y demás, y en submodulos los microservicios y el client-gateway
- Puedo borrar el launcher de Docker y volverlo a levantar sin problemas
- Si quiero trabajar solo con products-ms puedo comentar el orders-ms y la db en el docker-compose.yml