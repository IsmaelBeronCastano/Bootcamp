# 01 Node Patrón Repositorio

- El patrón repositorio lo que facilita es desligar tu conocimiento de cómo accedes a la DB
- Desacopla la complejidad del acceso a datos. Nos ofrece una API de acceso
- Es indiferente si tu DB es SQL, Mongo, Posgres, etc
- En lugar de usar queries se usa inyección de dependencias (llamado a la API)
- Las consultas SQL van a estar encapsuladas en métodos
- Con un CRUD completo ( + start de la DB ) deberíamos resolver la mayoría de los casos
- Ventajas:
  - Facilita la manipulación de la capa de datos
  - Reutiliza lógica
  - Facilita cambiar de proveedor de datos
  - Facilita las pruebas unitarias
- Desventajas:
  - Perdemos la facilidad de escribir queries
    - Mal usado podemos tener problemas de performance
        - Cosas que una sola consulta con un query podemos obtener la info, aqui quizá necesitemos dos consultas
        - Hay que evaluar costes y beneficios ( si vale la pena o no aplicar el patrón repositorio)
------

## Creación del proyecto API.Wallet

- Esta app se va a encargar de gestionar los movimientos de entrada y salida de nuestro dinero
- Creo dos carpetas: APIauth y APIwallet
- En APIwallet inicializo con npm init -y
- Creo la carpeta src con common(lo común, que se puede compartir, reutilizable, clases, librerias), controllers y services
- Agrego ts-node-dev con npm i -D ts-node-dev
- Configuro ESLint ( si ESLint manda errores es que el código no está para producción)

> npm i -D eslint

- Inicializo eslint

> npx eslint --init

- Le tengo que decir al archivo .eslint dónde escuchar
- En el package.json, es scripts

> "lint": "eslint src/*"

- De esta manera si ejecuto npm run lint me indica los errores y warnings en consola
- Puedo añadirle --fix para que solucione por mi los problemas
- En el archivo de configuración de eslint puedo agregar que siempre coloque un ;
    - En rules

> semi: [2, "always"]

- Agregando Express con npm i express
- Para levantar la aplicación creo en /src el archivo server.ts y app.ts(donde definiré el comportamiento).
- Importo los tipos de express

> npm i -D @types/express

- Ahora tengo el tipado y autocompletado. Si escribo express. me salen todas las opciones
- Contruyo un servidor básico
- app.ts

~~~js
import express from 'express'

export const app: express.Application = express()
~~~
- En server levanto el servidor

~~~js
import { app } from "./app";


app.listen(3000, ()=>{
    console.log("Servidor corriendo en puerto 3000")
})
~~~
- Para usar módulos hay que poner a true el  esModuleInterop del archivo tsconfig.json
- Para generar tsconfig escribir tsc --init

~~~json
{
  "compilerOptions": {
    "esModuleInterop": true,
  }
}
~~~

- **NOTA**: para desarrollo puedo usar nodemon-ts

>  "start": "nodemon --exec ts-node src/server.ts --project ./tsconfig.json" //OPCIONAL

- Escribo en el script

> "start": "ts-node-dev src/server.ts"

- No debería dar ningún problema
- Quiero mostrar un mensaje en el navegador en el puerto 3000, para ello uso app.get('/', (req,res)=> res.send('Running...))
- 
- Para que ts-node-dev escuche los cambios

> "start": "ts-node-dev --respawn --transpile-only src/server.ts"
----------

## Variables de entorno y de proceso

- Son variables seteados en la memoria que estan disponibles según el entrono de ejecución
  - Development: entorno local
  - Stagging: pre-producción. Copia de producción para pruebas
  - Production: producción
- No vamos a compartir la misma base de datos en los tres entornos. Sería una locura!!
- Entonces vamos a tener una cadena de conexión en base a una variable de entorno
- Luego están las variables de proceso. Son variables de nuestro runtime
  - NODE_ENV: puedo setearlo a dos valores, development y production
  - APP_ENV : para definir en que entrono estoy trabajando. Esta variable no existe, yo la creo.
    - Esta ligada a mi aplicación. Aquí definiré si está en development, stagging o production
    - Según lo que esté seteado aquí leerá las variables de development, stagging o production
- Creo una carpeta config con tres archivos: development.env, stagging.env, production.env
- En cada archivo coloco una variable APP_FOO=development en development.env, APP_FOO=production en production.env, etc
- En app.ts que  es dónde defino el comportamiento, antes de ejecutar el listen coloco
- Instalo dotenv con npm i dotenv
- Si está definido como NODE_ENV o APP_ENV que se quede como está, si no que lo asigne a development

~~~js
import express from 'express'
import dotenv from 'dotenv'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.APP_ENV = process.env.APP_ENV || 'development'

export const app: express.Application = express()

app.get('/', (req,res)=>{
    res.send("Running...")
})
~~~

- Para que no de error de typescript en el siguiente código para obtener el __dirname cambiar en el tsconfig
- "module": "commonJS"
- "moduleResolution": "node"
- "target": "ESNext" 
- "esModuleInterop": true 

~~~js
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'


process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.APP_ENV = process.env.APP_ENV || 'development'



dotenv.config({
    path: `${__dirname}/../config/${process.env.APP_ENV}.env`
})

console.log(process.env.APP_FOO)

export const app: express.Application = express()

app.get('/', (req,res)=>{
    res.send("Running...")
})
~~~

- Ahora si hago un console.log(process.envAPP_FOO) me devuelve development (porque así lo definí en development.env)
-----

## IOC Container

- Patrón de inyección de dependencias
  - Se busca eliminar el acoplamiento entre clases
  - Por ejemplo lo que no debe hacer una clase es instanciar otra clase, eso sería un fuerte acoplamiento
    - Esto impide también el testing
- El IOC Container es un contenedor de dependencias con las que voy a trabajar
- Instalo con npm i awilix
- Creo un archivo en la /src/container.ts
- Creo mi primer servicio en /src/services/test.service.ts

~~~js
export class TestService{

    get(): Date{
        return new Date
    }
}
~~~

- Importo la clase en el contenedor
- container.ts

~~~js
import { TestService } from "./services/test.service";
import {createContainer, asClass} from 'awilix'


const container = createContainer()

//aquí registro mis dependencias. Uso asClass para indicarle que es una clase. Uso .scoped() al final
container.register({
    testService: asClass(TestService).scoped()
})

export{
    container
}
~~~

- En app.ts

~~~js
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { container } from './container'
import { TestService } from './services/test.service'


process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.APP_ENV = process.env.APP_ENV || 'development'

dotenv.config({
    path: `${__dirname}/../config/${process.env.APP_ENV}.env`
})



export const app: express.Application = express()

app.get('/', (req,res)=>{
    res.send("Running...")
})

                    //Le digo de que tipo es la propiedad y le paso el nombre de la propiedad del container
const testService = container.resolve<TestService>('testService')

//Pruebo que me devuelva la fecha
console.log(testService.get())
~~~
-----

## Controladores y enrutamiento

- Los controladores son los encargados de interceptar los requests y atender a los responses
- Encargados de definir el enrutamiento, implementan acciones
- Por ejemplo para usuarios lo llamaré UserController, que va a ser una clase
- Otro ejemplo sería ProductoController para producto
- Creo un controlador de prueba default.controller.ts

~~~js
export class DefaultController{
    public index(){
        
    }
}
~~~

- Instalo awilix-express con npm
- Permite trabajar el enrutamiento con decoradores
- Habilito en el tsconfig experimental decorators y MetaData

> "experimentalDecorators": true, "emitDecoratorMetadata": true,  

- Uso el decorador GET para indicar que es una petición GET
- Tipo el Request y la Response patra obtener el completado
- Usaré el método index para que retorne en qué entorno está

~~~js
import {route, GET} from 'awilix-express'
import { Request, Response } from 'express'

@route('/')
export class DefaultController{
    
    @GET()
    public index(req: Request, res:Response): void{
        res.send({
            NODE_ENV: process.env.NODE_ENV,
            APP_ENV: process.env.APP_ENV
        })
    }
}
~~~

- En app.ts importo loadController de awilix-express

~~~js
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { container } from './container'
import { TestService } from './services/test.service'
import { loadControllers } from 'awilix-express/lib/controller'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.APP_ENV = process.env.APP_ENV || 'development'

dotenv.config({
    path: `${__dirname}/../config/${process.env.APP_ENV}.env`
})



export const app: express.Application = express()

//para usar los controladores
app.use(loadControllers(
    
    'controllers/*.ts', //indico la ruta 
    {cwd: __dirname} //le indico en un objeto cual es la ruta donde debe empezar a buscar
))                   //dirname siempre retorna la carpeta actual, src/
~~~

- Para que awilix-express funcione hay que presentar una dependencia al menos
- Hago un refactor en container.ts y hago que el export default retorne una función
- importo expres
- Meto el código dentro de la función
- Debo indicarle a express el contenedor

~~~js
import express from 'express'
import { TestService } from "./services/test.service";
import {createContainer, asClass} from 'awilix'
import { scopePerRequest } from 'awilix-express/lib/scope-per-request';


export default (app: express.Application)=>{
    
    const container = createContainer()
    
    //aquí registro mis dependencias. Uso asClass para indicarle que es una clase. Uso .scoped() al final
    container.register({
        testService: asClass(TestService).scoped()
    })

    //Asocio el contenedro a express
    app.use(scopePerRequest(container))

}
~~~

- Voy a app.ts y lo importo, puedo llamarlo como quiera, lo llamo loadContainer
- Ejecuto la función con la instancia de app

~~~js
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import loadContainer  from './container'
import { TestService } from './services/test.service'
import { loadControllers } from 'awilix-express'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.APP_ENV = process.env.APP_ENV || 'development'

dotenv.config({
    path: `${__dirname}/../config/${process.env.APP_ENV}.env`
})



export const app: express.Application = express()
    
//con esto hago que las dependencias que vaya registrando estén disponibles
loadContainer(app)

//para usar los controladores
app.use(loadControllers(
    'controllers/*.ts', 
    {cwd: __dirname} //le indico en el objeto cual es la ruta donde debe empezar a buscar, es decirle /src
))
~~~

- En el defaultController inyecto en el constructor la dependencia que me interesa

~~~js
import {route, GET} from 'awilix-express'
import { Request, Response } from 'express'
import { TestService } from '../services/test.service'

@route('/')
export class DefaultController{
    constructor(private readonly testService: TestService){

    }
    @GET()
    public index(req: Request, res:Response): void{
        res.send({
            NODE_ENV: process.env.NODE_ENV,
            APP_ENV: process.env.APP_ENV
        })
    }


}
~~~

- **NOTA:** Tengo que pasarle un parámetro en la creación del container **para usar las dependencias**, le indico que es de tipo CLASSIC

~~~js
import express from 'express'
import { TestService } from "./services/test.service";
import {createContainer, asClass} from 'awilix'
import { scopePerRequest } from 'awilix-express';


export default (app: express.Application)=>{
    
    const container = createContainer({
        injectionMode: 'CLASSIC'
    })
    
    //aquí registro mis dependencias. Uso asClass para indicarle que es una clase. Uso .scoped() al final
    container.register({
        testService: asClass(TestService).scoped()
    })

    //Asocio el contenedro a express
    app.use(scopePerRequest(container))

}
~~~

- Ahora puedo crear el método test inyectándole testService usando su método get que me devuelve una fecha
- No uso el slash en la ruta porque es la ruta principal y da **ERROR**. En el resto de rutas de otras clases **SI** uso el slash, es solo para el ejemplo
~~~js
import {route, GET} from 'awilix-express'
import { Request, Response } from 'express'
import { TestService } from '../services/test.service'

@route('/')
export class DefaultController{
    constructor(private readonly testService: TestService){

    }
    @GET()
    public index(req: Request, res:Response): void{
        res.send({
            NODE_ENV: process.env.NODE_ENV,
            APP_ENV: process.env.APP_ENV
        })
    }
    @route('test') //lo coloco sin el slash, solo para el ejemplo, NO TIENE SENTIDO OTRO GET EN LA RUTA PRINCIPAL
    @GET()
    public test(req: Request, res:Response): void{ 
        res.send(
            this.testService.get()
        )
    }
}
~~~

- Creo un nuevo controlador en la ruta /check con este mismo código, en el default.controller dejo solo un mensaje de 'Running'
- default.controller.ts

~~~js
import {route, GET} from 'awilix-express'
import { Request, Response } from 'express'
import { TestService } from '../services/test.service'

@route('/')
export class DefaultController{
    constructor(private readonly testService: TestService){

    }
    @GET()
    public index(req: Request, res:Response): void{
        res.send('Running...')
    }
}
~~~

- check.controller.ts

~~~js
import {route, GET} from 'awilix-express'
import { Request, Response } from 'express'
import { TestService } from '../services/test.service'

@route('/check')
export class CheckController{
    constructor(private readonly testService: TestService){

    }
    @GET()
    public index(req: Request, res:Response): void{
        res.send({
            NODE_ENV: process.env.NODE_ENV,
            APP_ENV: process.env.APP_ENV
        })
    }

    @route('/test')
    @GET()
    public test(req: Request, res:Response): void{
        res.send(this.testService.get())
    }

}
~~~

                   


