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
      - 27017:27017

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
      - 5432:5432
~~~
