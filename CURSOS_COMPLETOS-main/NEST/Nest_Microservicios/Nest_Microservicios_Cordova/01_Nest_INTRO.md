# 01 NEST MICROSERVICIOS (INTRO)

- Genero mi nueva aplicación con **nest new monolito**
- app.controller y app.service a la papelera
- Instalo class-validator y class-transformer y lo configuro en el main con **.useGlobalPipes**
- main.ts

~~~js
app.useGlobalPipes(new ValidationPipe())
~~~

## ExceptionFilter

- Veamos como **manejar el uso de excepciones** con un **filtro global**
- Creo una carpeta **common/filters** dentro de src con el archivo **http-exception.filter.ts** 
- Creamos la clase **AllExceptionFilter** e implementamos **ExceptionFilter**
  - Esto me exije un método llamado **catch**, uso el autocompletado **situando el cursor sobre el error** (corrección rápida->implementar la interfaz ExceptionFilter)
- Para esta clase usaremos un decorador **@Catch**
- Creamos el **logger** (fuera del catch) con **new Logger** y le pasamos la clase con **.name** para capturar el nombre de la clase en el logger y se muestre
- Dentro del catch realizaremos el manejo de las excepciones
  - Creamos el **context**
  - Creamos el **response** con el context que ya tenemos
  - También el **request**
- Crearemos dos constantes para validar si estamos recibiendo el estado y lo mostraremos, de lo contrario retornaremos uno por defecto 
    - Creamos una constante **status**
    - Evaluamos con un ternario si el parametro exception que recibe el catch es una instancia de HttpException
    - Si lo es, retornamos el status
    - Si no, devolvemos un INTERNAL_SERVER_ERROR
- Ya tenemos el **status**, ahora falta el **mensaje**
  - Usamos un ternario nuevamente para recoger el mensaje con **getResponse**, si no devolvemos la exception tal cual
- Usamos el **logger.error** para que se muestre en rojo, y usamos un template string para colocar el status y el mensaje
  - Uso JSON.stringify para mostrar el mensaje
- Con todo esto construimos un response con **response.status** y le pasamos el estado, y en un json capturamos la fecha y hora, mostramos el path con **request.url** y el error con el **msg** que hemos capturado

~~~js
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class AllExceptionFilter implements ExceptionFilter{
   
   private readonly logger = new Logger(AllExceptionFilter.name)
   
    catch(exception: any, host: ArgumentsHost) {
        const ctx= host.switchToHttp() 
        const response = ctx.getResponse()
        const request = ctx.getRequest()

        const status = exception instanceof HttpException ?
                                    exception.getStatus()
                                    : HttpStatus.INTERNAL_SERVER_ERROR;

        const msg = exception instanceof HttpException ?
                                    exception.getResponse()
                                    : exception;
        this.logger.error(`Status: ${status} Error: ${JSON.stringify(msg)}`)
        
        response.status(status).json({
            time: new Date().toISOString(),
            path: request.url,
            error: msg
        })
    }   
}
~~~

- Para que esto funcione lo configuramos en el main para hacer el filtro de forma global con **useGlobalFilters**
- main.ts

~~~js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './common/filters/htttp-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new AllExceptionFilter())
  await app.listen(3000);
}
bootstrap();
~~~

- Puedo crear un controlador para comprobar que funciona ( debo añadirlo en controllers de app.module)

~~~js
import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";

@Controller('api/v1/test')
export class TestController{

    @Post()
    create(@Body() body: string){
        throw new HttpException('Error en la petición', HttpStatus.BAD_REQUEST)
    }
}
~~~

- Desde POSTMAN o ThunderClient hago la petición al endpoint me devuelve esto

~~~json
{
  "time": "2023-12-18T20:22:59.618Z",
  "path": "/api/v1/test",
  "error": "Error en la petición"
}
~~~

- Y en la consola veo como capta el nombre de la clase con .name (lo muestra entre corchetes)

~~~
[Nest] 19976  - 18/12/2023, 21:22:59   ERROR [AllExceptionFilter] Status: 400 Error: "Error en la petición"
~~~
--------

## Interceptor

- Ahora vamos a crear un **Interceptor**
- Podemos simular con un timeout que una petición tarda más de lo debido para lanzar una excepción
- Uso el mismo método POST para simularlo con una promesa
  - Le coloco el **resolve** y el **reject** en el callback, uso el reject en el setTimeout para mostrar el error en 5 segundos

~~~js
@Post()
create(@Body() body: string){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>reject("Algo fue mal"), 5000)
    })
}
~~~

- Vamos a **simular que vamos a interceptar el tiempo de ejecución de la petición y si hubo un error dar una respuesta antes de esperar el tiempo de resolución**. Le pongo de tiempo de espera en el setTimeout 15 segundos (15000)
- Creo la carpeta **common/interceptors** con el archivo **timeout.interceptor.ts**
- Es una clase inyectable por lo que uso **@Injectable**
- Implementa la interfaz **NestInterceptor**. Uso el mismo método que anteriormente para autocompletar
- Vemos que implementa un método **intercept** con un *context* de tipo **ExecutionContext** y un *next* de tipo **CallHandler** de tipo any
- Este método devuelve o un **Observable** de tipo any **o una promesa de tipo Observable** de tipo any
- Retorno el **next.handle** y uso **pipe** para indicar con **timeout** (lo importamos de *rxjs/operators*) el tiempo

~~~js
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable} from "rxjs";
import {timeout} from "rxjs/operators";

@Injectable()
export class TimeoutInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(timeout(3000))
    }
}
~~~

- Para que esto funcione hay que instanciarlo en el main!
- main.ts

~~~js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './common/filters/htttp-exception.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new AllExceptionFilter())
  app.useGlobalInterceptors(new TimeoutInterceptor())
  await app.listen(3000);
}
bootstrap();
~~~

- Ahora, si apunto al endpoint con un método POST no tarda los 15 segundos del timeout si no los 3 segundos que le he indicado en el interceptor
------

