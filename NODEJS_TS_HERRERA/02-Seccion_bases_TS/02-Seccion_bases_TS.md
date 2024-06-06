# 02 Sección bases NODE_TS 

## Configuración logger Winston y Typescript en Node

### Node Logger - Winston

- Tengo nodemon instalado globalemnte
- Hago el npm init -y para tener el package.json
- Instalo el paquete y copio la configuración de Winston en un archivo, en la carpeta plugins/logger.plugin.js
- A través de una Factory Function que llamo buildLogger implemento el patrón adaptador para el logger

~~~js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
 // defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = function buildLogger(service){

    return{
        log: (message)=>{
            logger.log('info', {message, service})
        },
        error: (message)=>{
            logger.error('error', {message, service})
        }
    }
}
~~~

- En app.js

~~~js
const buildLogger = require('./plugins/logger.plugin')

const logger = buildLogger('app.js')

logger.log("hola mundo")
logger.error("Esto es un error")
~~~

- Esto me crea automáticamente el combined.log y el error.log
- En el combined.log puedo ver esto

```

```

- En el error.log esto

```
{"level":"error","message":"info Esto es un error","service":"app.js"}
```

- Puedo añadir este código para ver el mensaje en consola. En producción no conviene

~~~js
logger.add(new winston.transports.Console({
    format: winston.format.simple()
}))
~~~

- Más adelante cuando configuremos las variables de entorno habrá una configuración adicional
- Si puede impactar una DB con Winston, pero también se pueden usar estos archivos .log
- Me interesa la fecha y la hora del evento
- Bien podría crearlo en el objeto

~~~js
error: (message)=>{
    logger.error('error', {
        message,
        service,
        at: new Date().toISOString()
    })
}
~~~

- Pero Winston tiene su manera de hacerlo
- Para combinar el formato json y que me agregue el timestamp. Desestructuro json, combine y timestamp de winston.format
- En lugar de usar winston.format.json() uso el combine para combinar varios formatos

~~~js
const winston = require('winston');
const {combine, timestamp, json} = winston.format

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

{...code}
~~~

- Los archivos .log no se suben a git
- En .gitignore

```
node_modules/

*.log
```
-----

## Typescript (proyecto básico)

> npm init -y

- Creo src/app.js
- Código fácil

~~~js
const heroes=[
    {
        id: 1,
        name: "Spiderman",
        owner: "Marvel"
    },
    {
        id: 2,
        name: "Batman",
        owner: "DC"
    },
    {
        id: 3,
        name: "Superman",
        owner: "DC"
    }
]

const findHeroById= (id)=>{
    return heroes.find(heroe=> heroe.id == id)
}

const hero = findHeroById(2)

console.log(hero)
~~~

- Hasta aqui vscode puede inferir en que el tipo puede ser undefined si no encuentra el heroe
- Pero si coloco un console.log de hero.name salta un error porque no puede leer las propiedades de undefined
- Puedo usar **null operator**

~~~js
console.log(hero?.name ?? "Hero not found")
~~~

- Integremos este código con Typescript
-----

## Configuración Typescript en Node

> npm i -D typescript @types/node

- Especifico que la trasnpilación vaya a la carpeta dist/ y que esté pendiente de src
- Se puede configurar directamente en el tsconfig manualmente

> npx tsc --init --outDir dist/ --rootDir src
> npm i -D ts-node

- Cambio app.js por app.ts (desaparece el error de tsconfig porque el transpilador no encontraba ninún archivo ts)
- Le indico que el id es un número

~~~js
const findHeroById= (id: number)=>{
    return heroes.find(heroe=> heroe.id == id)
}
~~~

- Puedo usar npx tsc --watch (crea la carpeta dist/)
- Para ejecutar nodemon con **npx nodemon dist/app**
- Creemos los scripts mejor 
- Crear archivo de configuración nodemon.json en la raíz

~~~json
{
    "watch": ["src"],
    "ext": ".ts, .js",
    "ignore": [],
    "exec": "npx ts-node ./src/app.ts"
}
~~~

- En el package.json

~~~json
{
    "dev": "nodemon",

}
~~~

- Para producción instalar con npm  i -D rimraf
- Añadir estos script

~~~json
{
    "build": "rimraf ./dist && tsc",
    "start": "npm run build && node dist/app.js
}
~~~

- Creo una carpeta src/data/heroes.ts
- Traslado el arreglo de heroes a heroes.ts, lo exporto, creo una interfaz y tipo el arreglo

~~~js
interface Heroe{
    id: number,
    name: string,
    owner: string
}

export const heroes: Heroe[]=[
    {
        id: 1,
        name: "Spiderman",
        owner: "Marvel"
    },
    {
        id: 2,
        name: "Batman",
        owner: "DC"
    },
    {
        id: 3,
        name: "Superman",
        owner: "DC"
    }
]
~~~

- Creo un nuevo directorio /src/services/hero.service.ts

~~~js
import {heroes} from '../data/heroes'

export const findHeroById= (id: number)=>{
    return heroes.find(heroe=> heroe.id == id)
}
~~~

- Importo en app.ts en findHeroById

