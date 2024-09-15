# 03 NODE-REACT MICROSERVICES FULL STACK
## Api Gateway

- Se rechazarán todas las peticiones que no vengan del api-gateway
- Todos los request del cliente pasarán por el gateway
- Será por conexiones con websockets
- La API Gateway se comunicará por API REst PERO LOS MS SERÁ CON EL PATRÓN EVENT DRIVEN

![diagrama_api](API_GATEWAY.png)

- COmo se puede apreciar, el cliente no se comunicará directamente con los ms
- Lo hará con socket.io a través del gateway
- Tanto el cliente como la API gateay se comunicarán con elasticsearch/kibana
- En esta lección no se hará la implementación completa del API GATEWAY
- Será solo el setup inicial
- notification-ms no tiene comunicación (no necesita ninguna request)
- Creo el folder de api-gateway

> npm init
> tsc --init

- Copio todo lo que hay en en la raíz del notification-ms
- .dockerignore
~~~
node_modules
.git/
Dockerfile
.dockerignore
coverage/
~~~

.npmrc

~~~
@uzochukwueddie:registry=https://npm.pkg.github.com/uzochukwueddie
//npm.pkg.github.com/:_authToken=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
~~~

- Dockerfile.dev

~~~Dockerfile
FROM node:21-alpine3.18

WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY .npmrc ./
COPY src ./src
RUN ls -a
RUN npm install && npm install -g nodemon

EXPOSE 4000

CMD [ "npm", "run", "dev" ]
~~~

- Dockerfile, usaremnos el puerto 4000

~~~Dockerfile
FROM node:21-alpine3.18 as builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc ./
COPY src ./src
RUN npm install -g npm@latest
RUN npm ci && npm run build

FROM node:21-alpine3.18

WORKDIR /app
RUN apk add --no-cache curl
COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc ./
RUN npm install -g pm2 npm@latest
RUN npm ci --production
COPY --from=builder /app/build ./build

EXPOSE 4000 

CMD [ "npm", "run", "start" ]
~~~

- jest.config.ts
- En moduleNameMapper cambio notification por gateway

~~~js
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: 'coverage',
  collectCoverage: true,
  testPathIgnorePatterns: ['/node_modules'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testMatch: ['<rootDir>/src/**/test/*.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/test/*.ts?(x)', '!**/node_modules/**'],
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1
    }
  },
  coverageReporters: ['text-summary', 'lcov'],
  moduleNameMapper: {
    //AQUI!!
    '@gateway/(.*)': ['<rootDir>/src/$1']
  }
};

export default config;
~~~

- package.json (solo copio los scripts y hago las instalaciones que aqui aparecen)
- Cambio el name, el main será app.js
- Las instalaciones serán
  - @elastic/elasticsearch
  - @uzoeddie/jobber-helpers
  - axios
  - bcrypt
  - compression
  - cookie-session
  - cors
  - dotenv
  - express
  - helmet
  - hpp
  - http-status-codes
  - jsonwebtoken
  - pino-pretty
  - typescript
  - typescript-transform-paths
  - winston
- Más las dependencias con npm i -D
  - @jest/types
  - @types/compression
  - @types/cookie-session
  - @types/cors
  - @types/express
  - @types/hpp
  - @types/jest
  - @types/jsonwebtoken
  - @typescript-eslint/eslint-plugin
  - @typescript-eslint/parser
  - eslint
  - eslint-config-prettier
  - eslint-plugin-import
  - jest
  - prettier
  - ts-jest
  - ts-node
  - tsc-alias
  - tsconfig-paths

~~~json
{
  "name": "jobber-gateway",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "start": "pm2 start ./build/src/app.js -i 5 --attach --watch | pino-pretty -c",
    "stop": "pm2 stop all",
    "delete": "pm2 delete all",
    "dev": "nodemon -r tsconfig-paths/register src/app.ts | pino-pretty -c",
    "lint:check": "eslint 'src/**/*.ts'",
    "lint:fix": "eslint 'src/**/*.ts' --fix",
    "prettier:check": "prettier --check 'src/**/*.{ts,json}'",
    "prettier:fix": "prettier --write 'src/**/*.{ts,json}'",
    "build": "tsc --project tsconfig.json && tsc-alias -p tsconfig.json",
    "test": "jest --coverage=true -w=1 --forceExit --detectOpenHandles --watchAll=false"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@elastic/elasticsearch": "^8.10.0",
    "@socket.io/redis-adapter": "^8.2.1",
    "axios": "^1.6.0",
    "bcrypt": "^5.1.1",
    "compression": "^1.7.4",
    "cookie-session": "^2.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "elastic-apm-node": "^4.1.0",
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "helmet": "^7.0.0",
    "hpp": "^0.2.3",
    "http-status-codes": "^2.3.0",
    "jsonwebtoken": "^9.0.2",
    "pino-pretty": "^10.2.3",
    "redis": "^4.6.10",
    "socket.io": "^4.7.2",
    "socket.io-client": "^4.7.2",
    "typescript": "^5.2.2",
    "typescript-transform-paths": "^3.4.6",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@jest/types": "^29.6.3",
    "@types/compression": "^1.7.4",
    "@types/cookie-session": "^2.0.46",
    "@types/cors": "^2.8.15",
    "@types/express": "^4.17.20",
    "@types/hpp": "^0.2.4",
    "@types/jest": "^29.5.7",
    "@types/jsonwebtoken": "^9.0.4",
    "@typescript-eslint/eslint-plugin": "^6.9.1",
    "@typescript-eslint/parser": "^6.9.1",
    "eslint": "^8.52.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-import": "^2.29.0",
    "jest": "^29.7.0",
    "prettier": "^3.0.3",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.1",
    "tsc-alias": "^1.8.8",
    "tsconfig-paths": "^4.2.0"
  }
}
~~~

- ts.config.ts

~~~js
{
  "compilerOptions": {
    "target": "ES2015",
    "lib": ["dom", "ES2015"],
    "module": "commonjs",
    "baseUrl": ".",
    "outDir": "./build",
    "rootDir": ".",
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "sourceMap": true,
    "alwaysStrict": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "pretty": true,
    "resolveJsonModule": true,
    "plugins": [
      { "transform": "typescript-transform-paths" },
      { "transform": "typescript-transform-paths", "afterDeclarations": true },
    ],
    "paths": {
      "@gateway/*": ["src/*"]
    }
  }
}
~~~

- **NOTA:** Falta el jenkins, el .editorconfig y los archivos de eslint y prettier
- En notification-ms codificamos bajo el paradigma de la programación funcional
- En la api-Gateway usaremos POO
- 
