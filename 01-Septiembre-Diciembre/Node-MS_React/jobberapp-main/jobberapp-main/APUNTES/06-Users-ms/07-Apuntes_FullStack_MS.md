# 07 APUNTES FULLSTACK MICROSERVICES - Users Service


- El users-ms consiste en compradores y vendedores
- No será tan complicado
- Los compradores no tendrán muchas features
- Tendremos varios GET para buyers 
- Del frontend al API-GATEWAY -->http(s)://api-gateway-host:port/api/v1/gateway/buyer
- Del API-Gateway al Users-ms--> http(s)://users-service-host:/port/api/v1/buyer
  - Buyer by Email --> /email GET
  - Buyer by Current Username --> /username GET
  - Buyer by User Name ---> /:username GET
- Los vendedores tendrán algunos endpoints más
- Del frontend al API-GATEWAY -->http(s)://api-gateway-host:port/api/v1/gateway/seller
- Del API-Gateway al Users-ms--> http(s)://users-service-host:/port/api/v1/seller
    - Seller by Id--> /id:sellerId  GET
    - Seller by Username--> /username/:username GET
    - Random Sellers--> /random GET
    - Create Sellers--> /create POST
    - Update Seller-->/:sellerId PUT
    - Seeding Seller--> /seed/:count PUT
- Cuando alguien se registra automáticamente se convierte en un comprador
- Se publica un evento con la data del comprador desde el auth-ms a users-ms
- Entonces, desde el users-ms envioamos la data a la DB
- Tiene más sentido hacer compradores y vendedores por separado en una aplicación real
- Buyers tendrá un servicio, sellers otro
- Una vez verificado el email pueden crear una cuenta como vendedores
- Los vendedores también pueden comprar gigs a otros vendedores 
-----

## Users service setup

- Copio el json de auth-ms
- Copio todos los archivos de raiz (Dockerfile, .env) de auth-ms y lo pego
- Cambio el puerto del Dockerfile y le pongo el 4003
- En el Jest.config.ts cambio el moduleNameWrapper

~~~ts
{    
coverageReporters: ['text-summary', 'lcov'],
moduleNameMapper: {
    '@users/(.*)': ['<rootDir>/src/$1']
}
  
~~~

- Cambio el nombre del package.json

~~~json
{
  "name": "jobber-users",
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
    "@faker-js/faker": "^8.2.0",
    "amqplib": "^0.10.3",
    "cloudinary": "^1.41.0",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "elastic-apm-node": "^4.1.0",
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "helmet": "^7.0.0",
    "hpp": "^0.2.3",
    "http-status-codes": "^2.3.0",
    "joi": "^17.11.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.0",
    "pino-pretty": "^10.2.3",
    "typescript": "^5.2.2",
    "typescript-transform-paths": "^3.4.6",
    "uuid": "^9.0.1",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@jest/types": "^29.6.3",
    "@types/amqplib": "^0.10.3",
    "@types/compression": "^1.7.4",
    "@types/cors": "^2.8.15",
    "@types/express": "^4.17.20",
    "@types/hpp": "^0.2.4",
    "@types/jest": "^29.5.7",
    "@types/jsonwebtoken": "^9.0.4",
    "@types/lodash": "^4.14.200",
    "@types/uuid": "^9.0.6",
    "@typescript-eslint/eslint-plugin": "^6.9.1",
    "@typescript-eslint/parser": "^6.9.1",
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
-----

## Database Connection