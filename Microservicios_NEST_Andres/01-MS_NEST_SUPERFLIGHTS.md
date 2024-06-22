# 01 NEST MICROSERVICIOS - SUPERFLIGHT

- En la carpeta api-gateway creo el proyecyo con **nest new superflights**
- Instalo **@nestjs/config** con npm
- Configuro para usar variables de entono en imports de **app.module con ConfigModule**

~~~js
ConfigModule.forRoot({
    envFilePath:['.env'],
    isGlobal: true
})
~~~
-----

## Filtro Global

- Para configurar el **filtro global para las excepciones** creo en la carpeta **src/common/filters/http-exception-filter.ts**
- Creo la clase AllExceptionFilter que implementa ExceptionFilter de @nestjs/common
- Le añado el decorador @Catch, con ctrl+click implemento la interfaz
- Creo el logger con new Logger() y le paso el nombre con AllExceptionFilter.name
- Creo el contexto, extraigo la Response y la Request
- Creo la constante status y evalúo si es una instancia de HttpException para obtener el status, si no devuelvo un server error
- Creo el mensaje
- Al logger le paso el status y el error
- Creo la Response pasándole la fecha, el path de la url y el message

~~~js
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger} from '@nestjs/common'
@Catch()
export class AllExceptionFilter implements ExceptionFilter{
    private readonly logger = new Logger(AllExceptionFIlter.name)

    catch(exception: ant, host: ArgumentsHost){
        const ctx = host.switchHttp()
        const res = ctx.getResponse() 
        const req = ctx.getRequest()
        
        const status = exception instanceof HttpException
                                            ? exception.getStatus()
                                            : HttpStatus.INTERNAL_SERVER_ERROR
        const msg = exception instanceof HttpException ? exception.getResponse(): exception

        this.logger.error(`Status ${status} Error: ${JSON.stringify(msg)}`)

        res.status(status).json({
            timestamps: new Date().toIOString(),
            path: req.url,
            error: msg
        })


    }
}
~~~

- Configuro en el main el uso global de filtros

~~~js
app.useGlobalFilters(new AllExceptionFilter())
~~~
-----

## Interceptor Global

- Creo en la carpeta **src/common/interceptors/timeOut.interceptor.ts**
- La clase implementa NestInterceptor
- Le coloco el decorador @Injectable
- La interfaz me obliga a implementar el método intercept

~~~js
imports {CallHandler, ExecutionCOntext, Injectable, NestInterceptor} from '@nestjs/common'
import {Observable} from 'rxjs'
import {timeout} from 'rxjs/operator'

@Injectable()
export class TimeOutInterceptor implements NestInterceptor{
    intercept(context:ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>>{
        return next.handle().pipe(timeout(120000)) //120 segundos
    }
}
~~~

- En el main seteo el uso de interceptores globales

~~~js
app.useGlobalInterceptors(new TimeOutInterceptor())
~~~
-----

## Instalacion de dependencias

- api-gateway nos hará de proxy
- Para RabbitMQ es amqplib

> npm i amqplib amqp-connection-manager class-validator class-transfromer @nestjs/microservices

- En api/gateway creo el módulo y el controlador con **nest g mo user** y **nest g co user**
- Creo la carpeta dto
- @ApiProperty es de swagger
~~~js
export class UserDTO{

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly: name: string
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly: userName: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly: email: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly: password: string

}
~~~
----

## Configuración de RabbitMQ

- Creamos un módulo de proxy
- En el guardaremos la configuración de la conexión a RabbitMQ
- Creo en src/common/proxy/client-proxy.ts y proxy.module.ts
- En client-proxy

~~~js
import {Injectable} from '@nestjs/common'
import {ConfigServcie} from '@nestjs/config'
import {ClientProxy, ClientProxyFactory, Transport} from '@nestjs/microservices'

@Injectable()
export class ClientProxySuperFilghts{
    constructor(private readonly config: ConfigService){}

    clientProxyUsers(): ClientProxy{
        return ClientProxy.create({
            transport: Transport.RMQ,
            option:{
                urls: this.config.get('AMQP_URL'), //hay que crear esta variable de entorno en .env
                queue: 'users' //el nombre de la cola con la que vamos a manejar usuarios, usaré RabbitMQ.UserQueue 
            }
        })
    }
}
~~~

- Creo en src/common/constants.ts un enum donde guardaré las colas (queue)

~~~js
export enum RabbitMQ{
    UserQueue = 'users'
}
~~~

- En proxy.module exporto el ClientProxy

~~~js
@Module({
    providers: [ClientProxySuperFlights],
    exports: [ClientProxySuperFlights]
})
export class ProxyModule{}
~~~

- En users.module importo el ProxyModule en imports para tenerlo disponible
- Configuro la variable de entorno AMQP_URL que añadí en la consexión
- Creo una nueva instancia gratuita de cloudamqp.com (RabbitMQ as a Service)
- En Details, AMQP URL tengo la url que colocaré en mi variable de entorno

~~~
AMQP_URL=amqp://aljshalsjlaksjlaksj
~~~

- Si ingreso en RabbitMQManager (boton verde arriba a la izquierda) puedo ver las conexiones, las queues
- Debo configurar en el main el microservicio
------

## Controlador Usuario

- En el constructor inyectaremos el ClientProxy
- En el método POST, cómo estoy trabajando con microservicios obtendré de la respuesta un Observable de tipo IUser
- IUser es una interfaz que he creado

~~~js
@Controller('api/v2/user')
export class UsersController{
    constructor(private readonly clientProxy: ClientProxySuperFlights){}

    private clientProxyUser = this.clientProxy.ClientProxyUsers()
    
    @Post()
    create(@Body() userDto: UserDTO): Observable<IUser>{
        return this.clientProxyUser.send()
    }

}
~~~

- IUser

~~~js
export interface IUser{
    name: string
    username: string
    email: string
    password: string
}
~~~

- También tengo las interfaces de IFlight, Ipassenger, ILocation e IWeather
- Creo en constants.ts el enum para el CRUD de mi aplicación

~~~js
export enum UserMSG{
    CREATE = 'CREATE_USER',
    FIND_ALL = 'FIND_USERS',
    FIND_ONE= 'FIND_USER',
    UPDATE = 'UPDATE_USER',
    DELETE='DELETE_USER',
    VALID_USER = 'VALID_USER'
}
~~~

- Ahora en el .send le mando UserMSG.CREATE y el dto

~~~js
@Post()
create(@Body() userDto: UserDTO): Observable<IUser>{
    return this.clientProxyUser.send(UserMSG.CREATE, userDTo)
}
~~~

- Hago lo mismo con el resto de CRUD

~~~js
@Controller('api/v2/user')
export class UsersController{
    constructor(private readonly clientProxy: ClientProxySuperFlights){}

    private clientProxyUser = this.clientProxy.ClientProxyUsers()
    
    @Post()
    create(@Body() userDto: UserDTO): Observable<IUser>{
        return this.clientProxyUser.send()
    }

    @Get()
    findAll(): Observable<IUSer[]>{
9        return this.clientProxyUser.send(UserMSG.findAll, '')
    }

    @Get(':id')
    findOne(@Param('id') id: String): Observable<IUser>{
        return this.clientProxy.send(UserMSG.findOne, id)
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() userDto: UserDTO) : Observable<IUser>{
        return this.clientProxy.send(UserMSG.UPDATE, {id, userDto})
    }

    @Delete(':id')
    delete(@Param('id') id: string) : Observable <IUser>{
        return thisclientProxy.send(UserMSG.DELETE, id)
    }

}
~~~
-----

## Estructura de módulo

- Creo el módulo con nest g mo passenger y el controlador con nest g co passenger
- Creo en passenger/dto/passenger.dto
- Para configurar la conexión de RabbitMQ, en constants creo la cola de pasajeros

~~~js
export enum RabbitMQ{
    UserQueue = 'users',
    PassengerQueue = 'passengers'
}
~~~

- En ClientProxySuperFlights creo la conexión de Passengers

~~~js
import {Injectable} from '@nestjs/common'
import {ConfigServcie} from '@nestjs/config'
import {ClientProxy, ClientProxyFactory, Transport} from '@nestjs/microservices'

@Injectable()
export class ClientProxySuperFilghts{
    constructor(private readonly config: ConfigService){}

    clientProxyUsers(): ClientProxy{
        return ClientProxy.create({
            transport: Transport.RMQ,
            option:{
                urls: this.config.get('AMQP_URL'), //hay que crear esta variable de entorno en .env
                queue: 'users' //el nombre de la cola con la que vamos a manejar usuarios, usaré RabbitMQ.UserQueue 
            }
        })
    }

    clientProxyPasenngers(): ClientProxy{
        return ClientProxy.create({
            transport: Transport.RMQ,
            option:{
                urls: this.config.get('AMQP_URL'),
                queue: RabbitMQ.PassengerQueue
            }
        })
    }
}
~~~

- Debo importar el ProxyModule en imports de PassengerModule
- Inyecto el clientProxy en PassengerController y hago el CRUD completo
- Cada método me devuelve un Observable de tipo IPassenger
- En constants.ts creo el enum de PassengerMSG con los métodos del CRUD
- Hacemos lo mismo con el módulo de Weather
- El main de api-gateway queda asi

~~~js
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('SuperFlight API')
    .setDescription('Scheduled Flights App')
    .setVersion('2.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/api/docs', app, document, {
    swaggerOptions: {
      filter: true,
    },
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
~~~

- Y el app.module así

~~~js
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
~~~



