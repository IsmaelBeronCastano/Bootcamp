# NODE TS NOC TESTING

- El servicio de correo tiene tres dependencias ocultas
  - Cuando se instancia la clase pareciera que no las necesita, por eso eson dependencias ocultas
  - Deben evitarse
  - Se deben mostrar explicitamente
- Siguiendo patrones de arquitectura se facilita el testing
----

## Configurar Testing

- Incluye esto al inicio del tsconfig

~~~json
{
     "include": ["src/**/*"],
  "exclude":  ["node_modules", "**/*/spec.ts", "**/*/test.ts"],
  "compilerOptions":{}
}
~~~

- Instalaciones

> npm i -D jest @types/jest ts-jest supertest
> npx jest --init

- En jest.config.ts descomento preset: 'ts-jest', testEnvironment: 'jest-environment-node' y setupFiles: ['dotenv/config']
- en el package.json

~~~json
{
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
}
~~~
-----

## Montar bases de datos y envs de testing

- El entorno de testing es distinto al de desarrollo
- Creo .env.test y copio las variables modificadas
- Creo un archivo de docker-compose diferente

~~~yaml
version: '3.8'


services:

  mongo-db:
    image: mongo:6.0.6
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASS}
    volumes:
      - ./mongo-test:/data/db
    ports:
      - 27018:27017

  postgres-db:
    image: postgres
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - ./postgres-test:/var/lib/postgresql/data
    ports:
      - 5431:5432
~~~

- Sería mucho más fácil con una db en la nube jeje
- En el package.json

~~~json
{

  "scripts": {
      "docker:test": "docker compose -f docker-compose.test.yaml --env-file .env.test up -d",
      "test": "npm run docker:test && jest",
      "test:watch": "npm run docker:test && jest --watch",
      "test:coverage": "npm run docker:test && jest --coverage",
      "dev": "tsnd --respawn src/app.ts",
      "build": "rimraf ./dist && tsc",
      "start": "npm run build && node dist/app.js"
    }
}
~~~
-----

## Pruebas env

- Se puede crear un directorio de test y reproducir la estructura de archivos o escribir el archivo de test al lado de cada archivo
- De momento lo haré poniendo el archivo de test al lado, veremos si luego cambio ;_
- Voy a plugins/envs.plugin.test.ts
- Quiero asegurarme que las variables estén definidas, etc
- Hago un console.log de las envs

~~~js
import { envs } from "./envs.plugin"

describe("envs.plugin.ts test", ()=>{


    test("should return env options",()=>{
        envs
        console.log(envs)
    })
})
~~~

- En el objeto que devuelve el console.log veo que no está cogiendo las envs de env.test si no las de desarrollo
- Creo en la raíz del proyecto un script de configuración (por convención se llama setupTest)

~~~js
import {config} from 'dotenv'

config({
    path: '.env.test'
})
~~~

- Debo a decirle a jest (en el jest.config) que cuando se levante lea este archivo

~~~js
setupFiles: ["<rootDir>/setupTest.ts"]
~~~

- Puedo copiar el objeto que devuelve el console.log y hacer un .toEqual con ese objeto

~~~js
import { envs } from "./envs.plugin"

describe("envs.plugin.ts test", ()=>{


    test("should return env options",()=>{
        expect(envs).toEqual( {
            PORT: 3000,
            MAILER_EMAIL: 'ismael@gmail.com',
            MAILER_SERVICE: 'gmail',
            MAILER_SECRET_KEY: '12341234',
            PROD: false,
            MONGO_STRING: 'mongodb://localhost:27017',
            MONGO_DB: 'NOC_TEST'
          })
    
    })
})
~~~

- Podemos testear que devuelva un error si no encuentra env

~~~js
test("should return error if not found env", async()=>{
        jest.resetModules() //reseteo para asegurarme
        process.env.PORT = "ABC" //pongo otro puerto como un string

        try {
            await import('./envs.plugin') //cargo nuevamente el archivo
            expect(true).toBe(false)

            
        } catch (error) {
          console.log(error) //env-var: "PORT" should be a valid integer 
        }
    })
~~~

- Uso el error que devuelve el console.log
- Le paso el error como string en un template literal
- Uso .toContain para euipararlo al contenido del error (EnvVarError)

~~~js
test("should return error if not found env", async()=>{
        jest.resetModules() //reseteo
        process.env.PORT = "ABC" //pongo otro puerto

        try {
            await import('./envs.plugin')
            expect(true).toBe(false)

            
        } catch (error) {
          expect(`${error}`).toContain('env-var: "PORT" should be a valid integer') //le paso el error como string en un template literal
        }
    })
~~~
------

## Pruebas en la conexión de MongoDB

- 