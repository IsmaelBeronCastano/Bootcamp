# 03 NODE-REACT MICROSERVICES FULL STACK
## Notification-ms

- Vamos a conectar el notification-ms a elasticSerach y Kibana
- También crearemos RabbitMQ queues y usaremos Ethereal para crear los templates de las notificaciones
- Solo usaremos notificaciones a través de email
- Primero habrá un email de verificación
- Si el email no esta verificado no se podrá abrir una cuenta como vendedor o comprador
- Tendremos también el email de renovar el password en caso de olvido
- El email del password reseteado
- Otro email para las ofertas (cuando vendedor y comprador establecen contacto por chat y el vendedor envía una oferta al comprador)
- Otro email será el de orden de compra cuando se acepta
- Otro email para el recibo de la orden
- Otro por extensión request en el que el vendedor necesita enviar más información sobre la compra
- Otro para la aprovación o no (extension approval)
- Otro para la entrega (como entregado)
-----

## Notification Server Setup

- Hacemos las instalaciones necesarias

> npm init

- El package.json
- **NOTA**: fijarse en los scripts!!
- pino-pretty hace mas bonitos los logs

>"dev": "nodemon -r tsconfig-paths/register src/app.ts | pino-pretty -c"

- package.json

~~~json
{
  "name": "jobber-notifications",
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
    "build": "tsc --project tsconfig.json && tsc-alias -p tsconfig.json && ts-node tools/copyAssets.ts",
    "test": "jest --coverage=true -w=1 --forceExit --detectOpenHandles --watchAll=false"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@jest/types": "^29.6.3",
    "@types/amqplib": "^0.10.3",
    "@types/email-templates": "^10.0.3",
    "@types/express": "^4.17.20",
    "@types/jest": "^29.5.7",
    "@types/nodemailer": "^6.4.13",
    "@types/shelljs": "^0.8.15",
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
  },
  "dependencies": {
    "@elastic/elasticsearch": "^8.10.0",
    "amqplib": "^0.10.3",
    "dotenv": "^16.3.1",
    "ejs": "^3.1.9",
    "elastic-apm-node": "^4.1.0",
    "email-templates": "^11.1.1",
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "http-status-codes": "^2.3.0",
    "nodemailer": "^6.9.7",
    "pino-pretty": "^10.2.3",
    "shelljs": "^0.8.5",
    "typescript": "^5.2.2",
    "typescript-transform-paths": "^3.4.6",
    "winston": "^3.11.0"
  }
}
~~~

- El ts.config

~~~json
{
  "compilerOptions": {
    "target": "ES2015",
    "lib": ["dom", "ES2015"],//ES2015 util para la extensión .ts
    "module": "commonjs", //con esto no necesito type:module en el package.json
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
      "@notifications/*": ["src/*"]
    }
  }
}

~~~

- El .editorconfig

~~~js
# EditorConfig is awesome: https://EditorConfig.org

root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{ts,js}]
quote_type = single

[*.md]
max_line_length = off
trim_trailing_whitespace = false
~~~

- Para configurar prettier y eslint

~~~
npm i -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-import prettier eslint
~~~

- En la raíz .eslintrc.json

~~~json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  "parserOptions":  {
    "ecmaVersion":  2020,  // Allows for the parsing of modern ECMAScript features
    "sourceType":  "module"  // Allows for the use of imports
  },
  "rules": {
    "no-multiple-empty-lines": [2, { "max": 2 }],
    "semi": [2, "always"],
    "curly": ["warn"],
    "prefer-template": ["warn"],
    "space-before-function-paren": [0, {"anonymous": "always", "named": "always"}],
    "camelcase": 0,
    "no-return-assign": 0,
    "quotes": ["error", "single"],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "import/no-unresolved": 0,
    "import/order": [
      "warn", {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "type", "object"],
        "newlines-between": "always"
      }
    ]
  }
}
~~~

- .eslintignore

~~~
# Created by https://www.toptal.com/developers/gitignore/api/node
# Edit at https://www.toptal.com/developers/gitignore?templates=node

### Node ###
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
# Comment in the public line in if your project uses Gatsby and not Next.js
# https://nextjs.org/blog/next-9-1#public-directory-support
# public

# vuepress build output
.vuepress/dist

# vuepress v2.x temp and cache directory
.temp

# Docusaurus cache and generated files
.docusaurus

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

### Node Patch ###
# Serverless Webpack directories
.webpack/

# Optional stylelint cache

# SvelteKit build / generate output
.svelte-kit

# End of https://www.toptal.com/developers/gitignore/api/node

Dockerfile
Dockerfile.dev
.dockerignore
.npmrc
Jenkinsfile
~~~

- Para el .gitignore uedo crearlo en la página gitignore.io ponieno Node
- .gitignore

~~~
# Created by https://www.toptal.com/developers/gitignore/api/node
# Edit at https://www.toptal.com/developers/gitignore?templates=node

### Node ###
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

build

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
# Comment in the public line in if your project uses Gatsby and not Next.js
# https://nextjs.org/blog/next-9-1#public-directory-support
# public

# vuepress build output
.vuepress/dist

# vuepress v2.x temp and cache directory
.temp

# Docusaurus cache and generated files
.docusaurus

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

### Node Patch ###
# Serverless Webpack directories
.webpack/

# Optional stylelint cache

# SvelteKit build / generate output
.svelte-kit

.DS_Store

# End of https://www.toptal.com/developers/gitignore/api/node
~~~

- .prettierrc.json

~~~json
{
  "trailingComma": "none",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "bracketSpacing": true,
  "printWidth": 140
}
~~~

-.npmrc. Aquí debo colocar mi propio token de autenticación


~~~
@uzochukwueddie:registry=https://npm.pkg.github.com/uzochukwueddie
//npm.pkg.github.com/:_authToken=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
~~~

- En el .npmrc lo tengo como variable de entorno (en jobber-shared)

~~~
@uzochukwueddie:registry=https://npm.pkg.github.com/uzochukwueddie
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
~~~
- Hay que instalar un paquete @uzochukwueddie/jobber-shared@0.0.l
- Necesita este archivo .npmrc para funcionar (creo que es para jenkins)
 --------

## Notification Service config

- Estaremos en microservices/02-notification-service
- APM es Application Performance Monitoring (para usar con Elastic)


- .env
~~~
ENABLE_APM=0
NODE_ENV=development
CLIENT_URL=http://localhost:3000
RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@localhost:5672
SENDER_EMAIL=
SENDER_EMAIL_PASSWORD=
ELASTIC_SEARCH_URL=http://elastic:admin1234@localhost:9200
ELASTIC_APM_SERVER_URL=http://localhost:8200
ELASTIC_APM_SECRET_TOKEN=
~~~

- En el docker-compose.yaml coloco estas variables

~~~yaml
# docker compose up -d redis mongodb mysql postgres rabbitmq elasticsearch kibana
version: '3.9'
services:
  redis:
    container_name: redis_container
    image: redis:alpine
    restart: always
    ports:
      - '6379:6379'
    command: redis-server --loglevel warning
    volumes:
      - ./docker-volumes/cache:/data
  
  redis-commander:
    container_name: redis-commander
    image: ghcr.io/joeferner/redis-commander:latest
    restart: always
    ports:
      - '8081:8081'
    environment:
    - REDIS_HOSTS=local:redis_container:6379
  
  mongodb:
    container_name: mongodb_container
    image: mongo:latest
    restart: always
    ports:
      - 27017:27017
    volumes:
      - ./docker-volumes/data:/data/db
  
  mysql:
    container_name: mysql_container
    image: mysql
    command: --default-authentication-plugin=mysql_native_password
    restart: always
    environment:
      - MYSQL_USER=jobber
      - MYSQL_DATABASE=jobber_auth
      - MYSQL_ROOT_PASSWORD=api
      - MYSQL_PASSWORD=api
    ports:
      - '3306:3306'
    volumes:
      - ./docker-volumes/mysql:/var/lib/mysql
  
  postgres:
    container_name: postgres_container
    image: postgres
    restart: always
    environment:
      - POSTGRES_USER=jobber
      - POSTGRES_PASSWORD=api
      - POSTGRES_DB=jobber_reviews
    ports:
      - '5432:5432'
    volumes:
      - ./docker-volumes/postgres:/var/lib/postgresql
  
  rabbitmq:
    container_name: rabbitmq_container
    image: rabbitmq:3.13-rc-management-alpine
    restart: always
    environment:
      - RABBITMQ_DEFAULT_USER=jobber
      - RABBITMQ_DEFAULT_PASS=jobberpass
    ports:
      # AMQP protocol port
      - '5672:5672'
      # Management UI
      - '15672:15672'

  elasticsearch:
    container_name: elasticsearch_container
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.2
    restart: always
    environment:
      ES_JAVA_OPTS: -Xmx1g -Xms1g
      bootstrap.memory_lock: "true"
      discovery.type: single-node
      network.host: 0.0.0.0
      transport.host: 127.0.0.1
      http.host: 0.0.0.0
      xpack.security.enabled: "true"
      xpack.security.authc.api_key.enabled: "true"
      xpack.monitoring.collection.enabled: "true"
      xpack.security.enrollment.enabled: "true"
      xpack.security.authc.token.enabled: "true"
      ELASTIC_PASSWORD: admin1234
    ports:
      - 9300:9300
      - 9200:9200
    volumes:
      - ./docker-volumes/elasticsearch-data:/usr/share/elasticsearch/data
    networks:
      - elastic
  
  kibana:
    container_name: kibana_container
    image: docker.elastic.co/kibana/kibana:8.12.2
    restart: always
    environment:
      - ELASTICSEARCH_HOSTS=["http://elasticsearch_container:9200"]
      - ELASTICSEARCH_USERNAME=kibana_system
      - ELASTICSEARCH_PASSWORD=kibana
      - ELASTICSEARCH_SERVICEACCOUNT_TOKEN=AAEAAWVsYXN0aWMva2liYW5hL2pvYmJlci1raWJhbmE6N3BWZ0ItZWxSY21wMEJ0Y3ZKNTlHZw
      - XPACK_FLEET_AGENTS_ELASTICSEARCH_HOSTS=["http://elasticsearch_container:9200"]
    ports:
      - 5601:5601
    networks:
      - elastic
    volumes:
      - ./kibana.yml/:/usr/share/kibana/config/kibana.yml:ro
    depends_on: 
      - elasticsearch

  apmServer:
    image: docker.elastic.co/apm/apm-server:8.12.2
    container_name: apm_server_container
    ports:
      - 8200:8200
    volumes:
      - ./apm-server.yml:/usr/share/apm-server/apm-server.yml:ro
    networks:
      - elastic
    command: >
      apm-server -e
        -E apm-server.rum.enabled=true
        -E setup.kibana.host=kibana_container:5601
        -E setup.template.settings.index.number_of_replicas=0
        -E apm-server.kibana.enabled=true
        -E apm-server.kibana.host=kibana_container:5601
        -E apm-server.kibana.protocol=http
        -E strict.perms=false
        -E apm-server.auth.anonymous.enabled=true
  
  metricbeat:
    container_name: metricbeat_container
    image: docker.elastic.co/beats/metricbeat:8.12.2
    user: root
    ports:
      - 5066:5066
    networks:
      - elastic
    volumes:
      - ./metricbeat.yml/:/usr/share/metricbeat/metricbeat.yml:ro
      # docker module
      - /var/run/docker.sock:/var/run/docker.sock:ro
      # system module
      - /sys/fs/cgroup:/hostfs/sys/fs/cgroup:ro
      - /proc:/hostfs/proc:ro
      - /:/hostfs:ro
    command: ["--strict.perms=false", "-system.hostfs=/hostfs"]
    depends_on: 
      - elasticsearch

  heartbeat:
    container_name: heartbeat_container
    image: docker.elastic.co/beats/heartbeat:8.12.2
    user: root
    hostname: heartbeat
    cap_add:
      - NET_RAW
    networks:
      - elastic
    command: ["--strict.perms=false"]
    volumes:
      - ./heartbeat.yml:/usr/share/heartbeat/heartbeat.yml:ro
    depends_on: 
      - elasticsearch
  
  gateway:
    container_name: gateway_container
    build:
      context: ../server/1-gateway-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4000:4000
    env_file: ../server/1-gateway-service/.env
    environment:
        - ENABLE_APM=1
        - GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
        - JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
        - NODE_ENV=development
        - SECRET_KEY_ONE=032c5c3cfc37938ae6dd43d3a3ec7834
        - SECRET_KEY_TWO=d66e377018c0bc0b5772bbc9b131e6d9
        - CLIENT_URL=http://localhost:3000
        - AUTH_BASE_URL=http://auth_container:4002
        - USERS_BASE_URL=http://localhost:4003
        - GIG_BASE_URL=http://localhost:4004
        - MESSAGE_BASE_URL=http://localhost:4005
        - ORDER_BASE_URL=http://localhost:4006
        - REVIEW_BASE_URL=http://localhost:4007
        - REDIS_HOST=redis://redis_container:6379
        - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
        - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
        - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
  
  notifications:
    container_name: notification_container
    build:
      context: ../server/2-notification-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4001:4001
    env_file: ../server/2-notification-service/.env
    environment:
      - ENABLE_APM=1
      - NODE_ENV=development
      - CLIENT_URL=http://localhost:3000
      - RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@rabbitmq_container:5672
      - SENDER_EMAIL=lysanne.rutherford88@ethereal.email
      - SENDER_EMAIL_PASSWORD=ad8y45AkfebKmW8rCV
      - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
      - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
      - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
  
  auth:
    container_name: auth_container
    build:
      context: ../server/3-auth-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4002:4002
    env_file: ../server/3-auth-service/.env
    environment:
      - ENABLE_APM=1
      - GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
      - JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
      - NODE_ENV=development
      - AP_GATEWAY_URL=http://gateway_container:4000
      - CLIENT_URL=http://localhost:3000
      - RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@rabbitmq_container:5672
      - MYSQL_DB=mysql://jobber:api@mysql_container:3306/jobber_auth
      - CLOUD_NAME=dyamr9ym3
      - CLOUD_API_KEY=385269193982147
      - CLOUD_API_SECRET=-h9hU43QMy68AcIaMyP0ULKbibI
      - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
      - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
      - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
      - mysql
  
  users:
    container_name: users_container
    build:
      context: ../server/4-users-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4003:4003
    env_file: ../server/4-users-service/.env
    environment:
      - ENABLE_APM=1
      - DATABASE_URL=mongodb://mongodb_container:27017/jobber-users
      - GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
      - JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
      - NODE_ENV=development
      - AP_GATEWAY_URL=http://gateway_container:4000
      - RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@rabbitmq_container:5672
      - CLOUD_NAME=dyamr9ym3
      - CLOUD_API_KEY=385269193982147
      - CLOUD_API_SECRET=-h9hU43QMy68AcIaMyP0ULKbibI
      - REDIS_HOST=redis://redis_container:6379
      - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
      - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
      - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
      - mongodb
  
  gig:
    container_name: gig_container
    build:
      context: ../server/5-gig-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4004:4004
    env_file: ../server/5-gig-service/.env
    environment:
      - ENABLE_APM=1
      - DATABASE_URL=mongodb://mongodb_container:27017/jobber-gig
      - GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
      - JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
      - NODE_ENV=development
      - AP_GATEWAY_URL=http://gateway_container:4000
      - RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@rabbitmq_container:5672
      - CLOUD_NAME=dyamr9ym3
      - CLOUD_API_KEY=385269193982147
      - CLOUD_API_SECRET=-h9hU43QMy68AcIaMyP0ULKbibI
      - REDIS_HOST=redis://redis_container:6379
      - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
      - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
      - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
      - mongodb
  
  chat:
    container_name: chat_container
    build:
      context: ../server/6-chat-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4005:4005
    env_file: ../server/6-chat-service/.env
    environment:
      - ENABLE_APM=1
      - DATABASE_URL=mongodb://mongodb_container:27017/jobber-chat
      - GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
      - JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
      - NODE_ENV=development
      - AP_GATEWAY_URL=http://gateway_container:4000
      - RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@rabbitmq_container:5672
      - CLOUD_NAME=dyamr9ym3
      - CLOUD_API_KEY=385269193982147
      - CLOUD_API_SECRET=-h9hU43QMy68AcIaMyP0ULKbibI
      - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
      - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
      - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
      - mongodb
  
  order:
    container_name: order_container
    build:
      context: ../server/7-order-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4006:4006
    env_file: ../server/7-order-service/.env
    environment:
      - ENABLE_APM=1
      - DATABASE_URL=mongodb://mongodb_container:27017/jobber-chat
      - GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
      - JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
      - NODE_ENV=development
      - AP_GATEWAY_URL=http://gateway_container:4000
      - CLIENT_URL=http://localhost:3000
      - RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@rabbitmq_container:5672
      - STRIPE_API_KEY=sk_test_51OAXs6DTglvMeJPrlX1Lp9Mw7aXwlBbFJOLQdlkFv5mRKPkQdFrxvYN68xZ54wBr6VbP44khSM5UpPtfaixlMgcW00CIZEpmn5
      - CLOUD_NAME=dyamr9ym3
      - CLOUD_API_KEY=385269193982147
      - CLOUD_API_SECRET=-h9hU43QMy68AcIaMyP0ULKbibI
      - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
      - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
      - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
      - mongodb
  
  review:
    container_name: order_container
    build:
      context: ../server/8-review-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4007:4007
    env_file: ../server/8-review-service/.env
    environment:
      - ENABLE_APM=1
      - DATABASE_HOST=192.168.0.42
      - DATABASE_USER=jobber
      - DATABASE_PASSWORD=api
      - DATABASE_NAME=jobber_reviews
      - GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
      - JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
      - NODE_ENV=development
      - AP_GATEWAY_URL=http://gateway_container:4000
      - RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@rabbitmq_container:5672
      - CLOUD_NAME=dyamr9ym3
      - CLOUD_API_KEY=385269193982147
      - CLOUD_API_SECRET=-h9hU43QMy68AcIaMyP0ULKbibI
      - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
      - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
      - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
      - postgres

  jenkins:
    container_name: jenkins_container
    image: jenkins/jenkins:lts
    privileged: true
    user: root
    ports:
      - 8080:8080
      - 50000:50000
    volumes:
      - ./docker-volumes/jenkins_compose/jenkins_configuration:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock

  jenkins-agent:
    container_name: jenkins_agent_container
    image: jenkins/ssh-agent:jdk11
    privileged: true
    user: root
    expose:
      - 22
    environment:
      - JENKINS_AGENT_SSH_PUBKEY=

networks:
  elastic:
    name: elastic
~~~

- En src/config.ts importo dotenv
- Creo la clase Config y le paso las variables en el constructor después de declararlas
- src/config

~~~js
import dotenv from 'dotenv';

dotenv.config({}); //solo hay que llamarlo una vez

// if (process.env.ENABLE_APM === '1') {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   require('elastic-apm-node').start({
//     serviceName: 'jobber-notification',
//     serverUrl: process.env.ELASTIC_APM_SERVER_URL,
//     secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
//     environment: process.env.NODE_ENV,
//     active: true,
//     captureBody: 'all',
//     errorOnAbortedRequests: true,
//     captureErrorLogStackTraces: 'always'
//   });
// }

class Config {
  public NODE_ENV: string | undefined;
  public CLIENT_URL: string | undefined;
  public SENDER_EMAIL: string | undefined;
  public SENDER_EMAIL_PASSWORD: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.SENDER_EMAIL = process.env.SENDER_EMAIL || '';
    this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
  }
}

export const config: Config = new Config();
~~~

- Ahora si queremos usar estas variables solo tengo que llamar a esta clase
------

## Server


- src/server.ts
- Importo la interface Logger de Winston
- Uso la funcion winstonLogger  de la librería, el servicio será notificationServer y por defecto el nivel de debug
- Siempre que una función es async retorna una promesa (de tipo void si no devuelve nada o el tipo que sea)
- app será de tipo Application ( de Express)
- httpServer será de http.Server
- Uso log.info para informar, log.log para notificaciones

~~~js
import 'express-async-errors';
import http from 'http';

import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export function start(app: Application): void {
  startServer(app);
  app.use('', healthRoutes()); //Router que crearemos después
  //startQueues();
  //startElasticSearch();
}


// async function startQueues(): Promise<void> {
//   const emailChannel: Channel = await createConnection() as Channel;
//   await consumeAuthEmailMessages(emailChannel);
//   await consumeOrderEmailMessages(emailChannel);
// }

// function startElasticSearch(): void {
//   checkConnection();
// }

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started`);

    //pongo el server a escuchar
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error); //primero le paso el level y luego el mensaje
  }
}
~~~

- La función WinstonLogger es esta 
- jobber-shared/src/logger.ts

~~~js
import winston, { Logger } from 'winston';
import { ElasticsearchTransformer, ElasticsearchTransport, LogData, TransformedData } from 'winston-elasticsearch';

const esTransformer = (logData: LogData): TransformedData => {
  return ElasticsearchTransformer(logData);
}

export const winstonLogger = (elasticsearchNode: string, name: string, level: string): Logger => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true
    },
    elasticsearch: {
      level,
      transformer: esTransformer,
      clientOpts: {
        node: elasticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false
      }
    }
  };
  const esTransport: ElasticsearchTransport = new ElasticsearchTransport(options.elasticsearch);
  const logger: Logger = winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [new winston.transports.Console(options.console), esTransport]
  });
  return logger;
}
~~~
------

## healthRoute

- Iremos de abajo a arriba, creando el server, routes, helper, elasticsearch y UP!
- El Router será de tipo Router (de Express)
- Usaré la librería StatusCodes para devolver el 200
- Uso .send para devolver el string del mensaje en pantalla
- src/routes.ts

~~~js
import express, { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const router: Router = express.Router();

export function healthRoutes(): Router {
  router.get('/notification-health', (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).send('Notification service is healthy and OK.');
  });
  return router;
}
~~~

- Este routes no viene de api-gateway (api/v1/gateway), accederemos directamente
-----

## Elasticsearch connection

- Para ello debo instalar @elastic/elasticsearch con npm i
- En la web elasticsearch Clients (web) está la doc. 
- Elegir Javascript client /connecting to elasticsearch / connecting
- Básicamente importar el cliente y cerar una nueva instancia, autenticarme con auth (útil para el cloud)
- Por ahora estaremos en localhost, pero cuando iniciemos con kubernetes necesitaremos la autenticación
- Creo una instancia del logger el logger
- Creo una instancia del cliente, le paso la variable de entorno
- Mientras isConnected esté en true uso un try catch
- Creo un Cluster tipo health mientras isConnected siga en true
- Será para controlar la conexión con Elasticsearch
- Uso log.log para la notificación y log.error para el error
- src/elasticsearch.ts

~~~js
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@notifications/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}` //http://elastic:admin1234@localhost:9200
});

export async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) { 
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`NotificationService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.log('error', 'NotificationService checkConnection() method:', error);
    }
  }
}
~~~
-----

## Start Notification Service

- Creamos una instancia de elasticsearch Client en notificaction-ms/src/elasticsearch.ts
- Creamos checkConnection que es llamado en el server con startElasticSearch llamado en el start quedando así

~~~js
import 'express-async-errors';
import http from 'http';

import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export function start(app: Application): void {
  startServer(app);
  app.use('', healthRoutes());
  //startQueues();
  startElasticSearch();
}

// async function startQueues(): Promise<void> {
//   const emailChannel: Channel = await createConnection() as Channel;
//   await consumeAuthEmailMessages(emailChannel);
//   await consumeOrderEmailMessages(emailChannel);
// }

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error);
  }
}
~~~

- A start debo pasarle una instancia de app
- Importo el método en app.ts, creo el método initialize y lo invoco.
- Podría usarse una función autoinvocada también
- Creo un nuevo logger para notificationApp
- En src/app.ts

~~~js
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import express, { Express } from 'express';
import { start } from '@notifications/server';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationApp', 'debug');

function initialize(): void {
  const app: Express = express();
  start(app);
  log.info('Notification Service Initialized');
}
initialize();
~~~

- Para el logger importo desde la librería de helpers de jobber-shared/logger.ts

~~~js
import winston, { Logger } from 'winston';
import { ElasticsearchTransformer, ElasticsearchTransport, LogData, TransformedData } from 'winston-elasticsearch';

const esTransformer = (logData: LogData): TransformedData => {
  return ElasticsearchTransformer(logData);
}

export const winstonLogger = (elasticsearchNode: string, name: string, level: string): Logger => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true
    },
    elasticsearch: {
      level,
      transformer: esTransformer,
      clientOpts: {
        node: elasticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false
      }
    }
  };
  const esTransport: ElasticsearchTransport = new ElasticsearchTransport(options.elasticsearch);
  const logger: Logger = winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [new winston.transports.Console(options.console), esTransport]
  });
  return logger;
}
~~~

- Puedo ponder en marcha el microservicio con

> npm run dev

- La imagen de elastic search debe corre en Docker
- Paso el docker-compose.yaml completo que esta en la raiz de jobber (fuera de los ms)
- Recuerda que la jerarquía es 
  - jobber
    - jobber-client (react)
    - jobber-k8s (kubernetes)
    - microservices (ms)
    - volumes (storage)

~~~yaml
# docker compose up -d redis mongodb mysql postgres rabbitmq elasticsearch kibana
version: '3.9'
services:
  redis:
    container_name: redis_container
    image: redis:alpine
    restart: always
    ports:
      - '6379:6379'
    command: redis-server --loglevel warning
    volumes:
      - ./docker-volumes/cache:/data
  
  redis-commander:
    container_name: redis-commander
    image: ghcr.io/joeferner/redis-commander:latest
    restart: always
    ports:
      - '8081:8081'
    environment:
    - REDIS_HOSTS=local:redis_container:6379
  
  mongodb:
    container_name: mongodb_container
    image: mongo:latest
    restart: always
    ports:
      - 27017:27017
    volumes:
      - ./docker-volumes/data:/data/db
  
  mysql:
    container_name: mysql_container
    image: mysql
    command: --default-authentication-plugin=mysql_native_password
    restart: always
    environment:
      - MYSQL_USER=jobber
      - MYSQL_DATABASE=jobber_auth
      - MYSQL_ROOT_PASSWORD=api
      - MYSQL_PASSWORD=api
    ports:
      - '3306:3306'
    volumes:
      - ./docker-volumes/mysql:/var/lib/mysql
  
  postgres:
    container_name: postgres_container
    image: postgres
    restart: always
    environment:
      - POSTGRES_USER=jobber
      - POSTGRES_PASSWORD=api
      - POSTGRES_DB=jobber_reviews
    ports:
      - '5432:5432'
    volumes:
      - ./docker-volumes/postgres:/var/lib/postgresql
  
  rabbitmq:
    container_name: rabbitmq_container
    image: rabbitmq:3.13-rc-management-alpine
    restart: always
    environment:
      - RABBITMQ_DEFAULT_USER=jobber
      - RABBITMQ_DEFAULT_PASS=jobberpass
    ports:
      # AMQP protocol port
      - '5672:5672'
      # Management UI
      - '15672:15672'

  elasticsearch:
    container_name: elasticsearch_container
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.2
    restart: always
    environment:
      ES_JAVA_OPTS: -Xmx1g -Xms1g
      bootstrap.memory_lock: "true"
      discovery.type: single-node
      network.host: 0.0.0.0
      transport.host: 127.0.0.1
      http.host: 0.0.0.0
      xpack.security.enabled: "true"
      xpack.security.authc.api_key.enabled: "true"
      xpack.monitoring.collection.enabled: "true"
      xpack.security.enrollment.enabled: "true"
      xpack.security.authc.token.enabled: "true"
      ELASTIC_PASSWORD: admin1234
    ports:
      - 9300:9300
      - 9200:9200
    volumes:
      - ./docker-volumes/elasticsearch-data:/usr/share/elasticsearch/data
    networks:
      - elastic
  
  kibana:
    container_name: kibana_container
    image: docker.elastic.co/kibana/kibana:8.12.2
    restart: always
    environment:
      - ELASTICSEARCH_HOSTS=["http://elasticsearch_container:9200"]
      - ELASTICSEARCH_USERNAME=kibana_system
      - ELASTICSEARCH_PASSWORD=kibana
      - ELASTICSEARCH_SERVICEACCOUNT_TOKEN=AAEAAWVsYXN0aWMva2liYW5hL2pvYmJlci1raWJhbmE6N3BWZ0ItZWxSY21wMEJ0Y3ZKNTlHZw
      - XPACK_FLEET_AGENTS_ELASTICSEARCH_HOSTS=["http://elasticsearch_container:9200"]
    ports:
      - 5601:5601
    networks:
      - elastic
    volumes:
      - ./kibana.yml/:/usr/share/kibana/config/kibana.yml:ro
    depends_on: 
      - elasticsearch

  apmServer:
    image: docker.elastic.co/apm/apm-server:8.12.2
    container_name: apm_server_container
    ports:
      - 8200:8200
    volumes:
      - ./apm-server.yml:/usr/share/apm-server/apm-server.yml:ro
    networks:
      - elastic
    command: >
      apm-server -e
        -E apm-server.rum.enabled=true
        -E setup.kibana.host=kibana_container:5601
        -E setup.template.settings.index.number_of_replicas=0
        -E apm-server.kibana.enabled=true
        -E apm-server.kibana.host=kibana_container:5601
        -E apm-server.kibana.protocol=http
        -E strict.perms=false
        -E apm-server.auth.anonymous.enabled=true
  
  metricbeat:
    container_name: metricbeat_container
    image: docker.elastic.co/beats/metricbeat:8.12.2
    user: root
    ports:
      - 5066:5066
    networks:
      - elastic
    volumes:
      - ./metricbeat.yml/:/usr/share/metricbeat/metricbeat.yml:ro
      # docker module
      - /var/run/docker.sock:/var/run/docker.sock:ro
      # system module
      - /sys/fs/cgroup:/hostfs/sys/fs/cgroup:ro
      - /proc:/hostfs/proc:ro
      - /:/hostfs:ro
    command: ["--strict.perms=false", "-system.hostfs=/hostfs"]
    depends_on: 
      - elasticsearch

  heartbeat:
    container_name: heartbeat_container
    image: docker.elastic.co/beats/heartbeat:8.12.2
    user: root
    hostname: heartbeat
    cap_add:
      - NET_RAW
    networks:
      - elastic
    command: ["--strict.perms=false"]
    volumes:
      - ./heartbeat.yml:/usr/share/heartbeat/heartbeat.yml:ro
    depends_on: 
      - elasticsearch
  
  gateway:
    container_name: gateway_container
    build:
      context: ../server/1-gateway-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4000:4000
    env_file: ../server/1-gateway-service/.env
    environment:
        - ENABLE_APM=1
        - GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
        - JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
        - NODE_ENV=development
        - SECRET_KEY_ONE=032c5c3cfc37938ae6dd43d3a3ec7834
        - SECRET_KEY_TWO=d66e377018c0bc0b5772bbc9b131e6d9
        - CLIENT_URL=http://localhost:3000
        - AUTH_BASE_URL=http://auth_container:4002
        - USERS_BASE_URL=http://localhost:4003
        - GIG_BASE_URL=http://localhost:4004
        - MESSAGE_BASE_URL=http://localhost:4005
        - ORDER_BASE_URL=http://localhost:4006
        - REVIEW_BASE_URL=http://localhost:4007
        - REDIS_HOST=redis://redis_container:6379
        - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
        - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
        - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
  
  notifications:
    container_name: notification_container
    build:
      context: ../server/2-notification-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4001:4001
    env_file: ../server/2-notification-service/.env
    environment:
      - ENABLE_APM=1
      - NODE_ENV=development
      - CLIENT_URL=http://localhost:3000
      - RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@rabbitmq_container:5672
      - SENDER_EMAIL=lysanne.rutherford88@ethereal.email
      - SENDER_EMAIL_PASSWORD=ad8y45AkfebKmW8rCV
      - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
      - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
      - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
  
  auth:
    container_name: auth_container
    build:
      context: ../server/3-auth-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4002:4002
    env_file: ../server/3-auth-service/.env
    environment:
      - ENABLE_APM=1
      - GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
      - JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
      - NODE_ENV=development
      - AP_GATEWAY_URL=http://gateway_container:4000
      - CLIENT_URL=http://localhost:3000
      - RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@rabbitmq_container:5672
      - MYSQL_DB=mysql://jobber:api@mysql_container:3306/jobber_auth
      - CLOUD_NAME=dyamr9ym3
      - CLOUD_API_KEY=385269193982147
      - CLOUD_API_SECRET=-h9hU43QMy68AcIaMyP0ULKbibI
      - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
      - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
      - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
      - mysql
  
  users:
    container_name: users_container
    build:
      context: ../server/4-users-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4003:4003
    env_file: ../server/4-users-service/.env
    environment:
      - ENABLE_APM=1
      - DATABASE_URL=mongodb://mongodb_container:27017/jobber-users
      - GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
      - JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
      - NODE_ENV=development
      - AP_GATEWAY_URL=http://gateway_container:4000
      - RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@rabbitmq_container:5672
      - CLOUD_NAME=dyamr9ym3
      - CLOUD_API_KEY=385269193982147
      - CLOUD_API_SECRET=-h9hU43QMy68AcIaMyP0ULKbibI
      - REDIS_HOST=redis://redis_container:6379
      - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
      - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
      - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
      - mongodb
  
  gig:
    container_name: gig_container
    build:
      context: ../server/5-gig-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4004:4004
    env_file: ../server/5-gig-service/.env
    environment:
      - ENABLE_APM=1
      - DATABASE_URL=mongodb://mongodb_container:27017/jobber-gig
      - GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
      - JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
      - NODE_ENV=development
      - AP_GATEWAY_URL=http://gateway_container:4000
      - RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@rabbitmq_container:5672
      - CLOUD_NAME=dyamr9ym3
      - CLOUD_API_KEY=385269193982147
      - CLOUD_API_SECRET=-h9hU43QMy68AcIaMyP0ULKbibI
      - REDIS_HOST=redis://redis_container:6379
      - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
      - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
      - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
      - mongodb
  
  chat:
    container_name: chat_container
    build:
      context: ../server/6-chat-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4005:4005
    env_file: ../server/6-chat-service/.env
    environment:
      - ENABLE_APM=1
      - DATABASE_URL=mongodb://mongodb_container:27017/jobber-chat
      - GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
      - JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
      - NODE_ENV=development
      - AP_GATEWAY_URL=http://gateway_container:4000
      - RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@rabbitmq_container:5672
      - CLOUD_NAME=dyamr9ym3
      - CLOUD_API_KEY=385269193982147
      - CLOUD_API_SECRET=-h9hU43QMy68AcIaMyP0ULKbibI
      - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
      - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
      - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
      - mongodb
  
  order:
    container_name: order_container
    build:
      context: ../server/7-order-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4006:4006
    env_file: ../server/7-order-service/.env
    environment:
      - ENABLE_APM=1
      - DATABASE_URL=mongodb://mongodb_container:27017/jobber-chat
      - GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
      - JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
      - NODE_ENV=development
      - AP_GATEWAY_URL=http://gateway_container:4000
      - CLIENT_URL=http://localhost:3000
      - RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@rabbitmq_container:5672
      - STRIPE_API_KEY=sk_test_51OAXs6DTglvMeJPrlX1Lp9Mw7aXwlBbFJOLQdlkFv5mRKPkQdFrxvYN68xZ54wBr6VbP44khSM5UpPtfaixlMgcW00CIZEpmn5
      - CLOUD_NAME=dyamr9ym3
      - CLOUD_API_KEY=385269193982147
      - CLOUD_API_SECRET=-h9hU43QMy68AcIaMyP0ULKbibI
      - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
      - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
      - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
      - mongodb
  
  review:
    container_name: order_container
    build:
      context: ../server/8-review-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4007:4007
    env_file: ../server/8-review-service/.env
    environment:
      - ENABLE_APM=1
      - DATABASE_HOST=192.168.0.42
      - DATABASE_USER=jobber
      - DATABASE_PASSWORD=api
      - DATABASE_NAME=jobber_reviews
      - GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
      - JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
      - NODE_ENV=development
      - AP_GATEWAY_URL=http://gateway_container:4000
      - RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@rabbitmq_container:5672
      - CLOUD_NAME=dyamr9ym3
      - CLOUD_API_KEY=385269193982147
      - CLOUD_API_SECRET=-h9hU43QMy68AcIaMyP0ULKbibI
      - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
      - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
      - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
      - postgres

  jenkins:
    container_name: jenkins_container
    image: jenkins/jenkins:lts
    privileged: true
    user: root
    ports:
      - 8080:8080
      - 50000:50000
    volumes:
      - ./docker-volumes/jenkins_compose/jenkins_configuration:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock

  jenkins-agent:
    container_name: jenkins_agent_container
    image: jenkins/ssh-agent:jdk11
    privileged: true
    user: root
    expose:
      - 22
    environment:
      - JENKINS_AGENT_SSH_PUBKEY=

networks:
  elastic:
    name: elastic
~~~

- Creo en la carpeta de notification-ms/src/queues/**connection.ts**
- También creo **email.consumer.ts** y **mail.transport.ts**
- Para la conexión necesitaré amqplib 0.9 (la instalé con npm)
- Debo crear **una conexión con el cliente y con esta crear un canal**
- Para ello usaré client, Channel y Connection
- La función de la conexión es async por lo que devuelve una promesa de tipo Channel o undefined
- Con un **try catch**, si todo sale bien devuelvo el **channel** 
- En caso de error retorno un **undefined**
- Utilizaremos promesas con async await
- connection.ts

~~~js
import { config } from '@notifications/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationQueueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {

  try {                                           //amqp://jobber:jobberpass@localhost:5672
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Notification server connected to queue successfully...');
    closeConnection(channel, connection); //cerramos la conexión
    return channel;
  } catch (error) {
    log.log('error', 'NotificationService error createConnection() method:', error);
    return undefined;
  }
}

//usamos process.once, es como un addListener
//primero cerramos el canal, luego la conexión
function closeConnection(channel: Channel, connection: Connection): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}

export { createConnection } ;
~~~

- Cuando hagamos el consumer haremos uso de este channel
- Llamamos a la conexión en el server.ts

~~~js
import 'express-async-errors';
import http from 'http';

import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export function start(app: Application): void {
  startServer(app);
  app.use('', healthRoutes());
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  const emailChannel: Channel = await createConnection() as Channel;
  //await consumeAuthEmailMessages(emailChannel);
  //await consumeOrderEmailMessages(emailChannel);
}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error);
  }
}
~~~

-------

## RabbitMQ intro

- Se puede usar como un message broker o como un administrador de colas (queues)
- Envia mensajes al consumidor apropiado
- En este proyecto solo consumiremos mensajes, no los produciremos
- Los mensajes pueden ser strings, objetos.
- Si no son strings, hay que stringuizarlos
- Puede ser OneToOne o OneToMany
- Usaremos una aproximación **event driven async**
- Usaremos un mensaje y esperaremos la respuesta
- Dentro del CloudAMQP tengo el Exchange (broker), el Routes, y las Queue
  - De la app va al Producer (produce mensajes), este envía el mensaje al broker y el routes lo direcciona a la queue (la que guarda el mensaje) correcta
  - El producer no sabe a que queue va o consumer. Solo envia mensajes al exchange
  - El exchange esta dentro del message broker
  - El consumer escucha la queue especifica
  - El mensaje es lo que enviamos en forma de string (si no se usa stringify)
  - Un channel es una conexión virtual dentro de la conexión

![diagrama RabbitMQ](RabbitMQ.png)

  - El exchange tiene varias maneras de funcionar
    - Direct: directa a a la queue que escucha
    - Topic: se suscribe, por ejemplo a Seller
    - Fanout: a todas las queues
    - Headers
  - Haremos uso de Direct y Fanout
- Docs: cloudamqp.com
----

## RabbitMQ channel methods

![foto channels](Intel-process.png)

- Hay varios métodos
- Usaremos los siguientes
- **channel.publish**: publica un mensaje al exchange, que usará el router para enviarlo al queue respectivo
  - Pasamos el nombre del exchange, el router_key y el mensaje (la data)
- **channel.assertExchange**: afirma la existencia de un intercambio. Chequea que el exchange existe, si existe buscará la router_key y enviará la data a la queue apropiada
  - Le paso el nombre del exchange, el tipo (direct exchange, fanout, etc)
- **channel.assertQueue**: chequea que la queue existe. Si no existe crea una nueva queue
- **channel.bindQueue**: chequea el routing path de un exchange a una queue
- **channel.consume**: configura un consumer con un callback que será invocado con cada mensaje. Método comunmente usado en el consumer
- **channel.ack**: reconoce el mensaje dado. Si consumimos el mensaje por el consumer y no usamos este ack, el mensaje permanecera en la queue
  - Siq uieres borrar vtodos los mensajes de las queues puedes usar **ackAll**
- Hay más métodos, pero estos son los que usaremos (mirar documentación)
----

## Auth email consumer method

- Ya hemos creado la conexión y el channel, ahora usaremos el **.consume** que contiene un callback que se le pasa la queue y el message
- En la misma carpeta queues donde tengo connection.ts con la conexión y el channel
- Necesito un exchange, una routingKey y una queue para que cuando publiquemos con **channel.publish** un mensaje podérselo pasar
- Si el channel no existe lo creo
- Afirmo/**creo el exchange** con assertExchange y le paso el nombre y el tipo direct
- Afirmo/**creo la queue**, le paso el nombre y la hago persistente con durable y autodelete. Por defecto durable está en false y autoDelete en true
  - La guardo en jobberQueue
- Con **.bindQueue** aúno la queue, el exchangeName, y la routingKey (hago un bind para trabajar en el mismo contexto)
- Cada vez que envie un mensaje **con el exchangeName usando la routingKey, el mesaje irá a la queueName**
  - Todo consumer asignado a esta queue consumirá el mensaje enviado
- Hago un console.log del msg
- Para consumir el queue y borrarlo de las queues uso channel.ack(msg!)
- Primero habría que enviar el mail usando un transport y luego hacer el ack
- notification-ms/src/queues/email.consumer.ts

~~~js
import { config } from '@notifications/config';
import { IEmailLocals, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@notifications/queues/connection';
import { sendEmail } from '@notifications/queues/mail.transport';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug');

async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = await createConnection() as Channel;
    }

    const exchangeName = 'jobber-email-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';//puedo poner el nombre que quiera

    //afirmo/creo el exchange con assertExchange y le paso el nombre y el tipo direct
    await channel.assertExchange(exchangeName, 'direct');

    //afirmo/creo la queue, le paso el nombre y la hago persistente con durable y autodelete
    //lo guardo en jobberQueue
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    
    //aúno queue, exchange y routingKey 
    //creo el path entre la queue y el exchange usando la routingKey
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

                                                  //ConsumeMessage de amqplib
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {

      console.log(JSON.parse(msg!.content.toString()))//console.log!!!!

      //channel.ack(msg!)  //con esto consumo la queue y se queda en 0 en el dashboard

    
    });
  } catch (error) {
    log.log('error', 'NotificationService EmailConsumer consumeAuthEmailMessages() method error:', error);
  }
}

export { consumeAuthEmailMessages};
~~~

- La interfaz de IEmailLocals

~~~js
export interface IEmailLocals {
  sender?: string;
  appLink: string;
  appIcon: string;
  offerLink?: string;
  amount?: string;
  buyerUsername?: string;
  sellerUsername?: string;
  title?: string;
  description?: string;
  deliveryDays?: string;
  orderId?: string;
  orderDue?: string;
  requirements?: string;
  orderUrl?: string;
  originalDate?: string;
  newDate?: string;
  reason?: string;
  subject?: string;
  header?: string;
  type?: string;
  message?: string;
  serviceFee?: string;
  total?: string;
  username?: string;
  verifyLink?: string;
  resetLink?: string;
  otp?: string;
}
~~~

- El winstonLogger viene desde la carpeta joober-shared/src/logger
- logger.ts

~~~js
import winston, { Logger } from 'winston';
import { ElasticsearchTransformer, ElasticsearchTransport, LogData, TransformedData } from 'winston-elasticsearch';

const esTransformer = (logData: LogData): TransformedData => {
  return ElasticsearchTransformer(logData);
}

export const winstonLogger = (elasticsearchNode: string, name: string, level: string): Logger => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true
    },
    elasticsearch: {
      level,
      transformer: esTransformer,
      clientOpts: {
        node: elasticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false
      }
    }
  };
  const esTransport: ElasticsearchTransport = new ElasticsearchTransport(options.elasticsearch);
  const logger: Logger = winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [new winston.transports.Console(options.console), esTransport]
  });
  return logger;
}
~~~

- Tambien uso el config para las variables de entorno
- notification-ms/src/config.ts

~~~js
import dotenv from 'dotenv';

dotenv.config({});

if (process.env.ENABLE_APM === '1') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('elastic-apm-node').start({
    serviceName: 'jobber-notification',
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
    environment: process.env.NODE_ENV,
    active: true,
    captureBody: 'all',
    errorOnAbortedRequests: true,
    captureErrorLogStackTraces: 'always'
  });
}

class Config {
  public NODE_ENV: string | undefined;
  public CLIENT_URL: string | undefined;
  public SENDER_EMAIL: string | undefined;
  public SENDER_EMAIL_PASSWORD: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.SENDER_EMAIL = process.env.SENDER_EMAIL || '';
    this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
  }
}

export const config: Config = new Config();
~~~

- **NOTA:** Ambos archivos (logger y config) **no se volverán a mostrar**
------

## Use auth email consumer method

- consumeAuthEmailMessages requiere un channel como parámetro y al ser async y no retornar nada, de valort de retorno tiene una Promesa de tipo void
- Lo tipo como Channel de amqplib
- Vamos al notification-ms/src/server.ts

~~~js
import 'express-async-errors';
import http from 'http';

import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export function start(app: Application): void {
  startServer(app);
  app.use('', healthRoutes());
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {

  //creo el channel
  const emailChannel: Channel = await createConnection() as Channel;
  await consumeAuthEmailMessages(emailChannel);
}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error);
  }
}
~~~

- El createConnection lo tengo en notification-ms/src/queues/connection (donde también esta email.consumer)
- Devuelve un channel

~~~js
import { config } from '@notifications/config';
import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationQueueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Notification server connected to queue successfully...');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'NotificationService error createConnection() method:', error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: Connection): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}

export { createConnection } ;
~~~

- En el archivo volumes/docker-compose.yaml compruebo las variables y el puerto de RabbitMQ

~~~yaml
rabbitmq:
  container_name: rabbitmq_container
  image: rabbitmq:3.13-rc-management-alpine
  restart: always
  environment:
    - RABBITMQ_DEFAULT_USER=jobber
    - RABBITMQ_DEFAULT_PASS=jobberpass
  ports:
    # AMQP protocol port
    - '5672:5672'
    # Management UI dashboard
    - '15672:15672'
~~~

- En las variables de entorno de notification-ms tengo el user y el password de RabbitMQ que he creado

~~~
ENABLE_APM=0
NODE_ENV=development
CLIENT_URL=http://localhost:3000
RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@localhost:5672
SENDER_EMAIL=
SENDER_EMAIL_PASSWORD=
ELASTIC_SEARCH_URL=http://elastic:admin1234@localhost:9200
ELASTIC_APM_SERVER_URL=http://localhost:8200
ELASTIC_APM_SECRET_TOKEN=
~~~

- En la UI, la primera pantalla (con Docker corriendo) puedo ver lo que ocupa la imagen de RabbitMQ
- Si voy a conexiones puedo ver la conexión
- En channels tengo mi ip asociada al puerto xxxxx, en el archivo conection.ts llamé a **.createChannel**
- En exchanges veo los diferentes tipos (direct, fanout...)
  - Puedo ver al final el que yo he creado como jobber-email-notification
  - Si clico encima puedo ver la routing_key
- En la pestaña de Queues and streams tengo solo una, la que creé (auth-email-queue)
- Para probar que todo funciona, lo hago en el notification-ms/src/server.ts
- Uso assertExchange. Puesto que ya existe lo asignará, le paso el tipo (direct)
- publish **necesita el exchangeName y la routing_key**,  no hace falta pasarle la queue porque **está asignada con el metodo bind** en email.consumer
  - Y le paso el mensaje. Si situo el cursor encima me dirá que el content es de tipo Buffer
- notification-ms/src/server.ts
~~~js
async function startQueues(): Promise<void> {

  //creo el channel
  const emailChannel: Channel = await createConnection() as Channel;
  await consumeAuthEmailMessages(emailChannel);

  await emailChannel.assertExchange('jobber-email-notification', direct)

  const message = JSON.stringify({name: 'Guanajuato', service: 'VIVA!'})
  emailChannel.publish('jobber-email-notification', 'auth-email', Buffer.from(message) )
}
~~~

- Como coloqué un console.log del msg en consumeAuthEmailMessages de notification-ms/src/email.consumer.ts puedo ver en consola el objeto con name y service
- Si voy al dashboard de RabbitMQ en localhost:15672 puedo ver en queues que en auth-email-queue tengo una queue en Unacked y Total
- Para consumir el mensaje uso el puerto que especifiqué en el docker-compose de AMQP que es el 5672
----

## Order email consumer method

- notification-ms no produce ningún mensaje, solo consume
- En el caso anterior será desde auth-ms
- Ahora haremos el de consumo de order-ms
- Es practicamente el mismo código, solo cambio el exchangeName, routingKey y queueName
- Desde notification-ms/src/email.consumer

~~~js
async function consumeOrderEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = await createConnection() as Channel;
    }
    const exchangeName = 'jobber-order-notification';
    const routingKey = 'order-email';
    const queueName = 'order-email-queue';

    await channel.assertExchange(exchangeName, 'direct');

    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });

    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
     console.log(JSON.parse(msg!.toString()))

      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'NotificationService EmailConsumer consumeOrderEmailMessages() method error:', error);
  }
}

export { consumeAuthEmailMessages, consumeOrderEmailMessages };
~~~

- Lo uso en el server.ts de notification-ms

~~~js
async function startQueues(): Promise<void> {
  const emailChannel: Channel = await createConnection() as Channel;

  await consumeAuthEmailMessages(emailChannel);
  await consumeOrderEmailMessages(emailChannel);

   const emailMessage = JSON.stringify({name: 'Guanajuato', service: 'VIVA!'})
  emailChannel.publish('jobber-email-notification', 'auth-email', Buffer.from(emailMessage) )

    const orderMessage = JSON.stringify({name: 'Guanajuato', service: 'VIVA!'})
  emailChannel.publish('jobber-order-notification', 'order-email', Buffer.from(orderMessage) )
}
~~~

- Ahora tengo dos queues creadas que puedo ver desde la UI de RabbitMQ
- También los dos exchanges
---- 

## Mail transport method

- Para ello instalamos en notification-ms email-templates , nodemailer y le generador de templates ejs
- LLamo a emailTemplates
- En notification-ms/src/queue/email.tranport.ts

~~~js
import { config } from '@notifications/config';
import { emailTemplates } from '@notifications/helpers';
import { IEmailLocals, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mailTransport', 'debug');

async function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> {
  try {
    emailTemplates(template, receiverEmail, locals);
    log.info('Email sent successfully.');
  } catch (error) {
    log.log('error', 'NotificationService MailTransport sendEmail() method error:', error);
  }
}

export { sendEmail };
~~~

- En helpers de notification-ms/src tengo el emailTemplates
- La función recibe el template, el receiver (destinatario), y las locals de tipo IEmailLocals (más abajo está)
- Creo una instancia de Email de email-templates
- emailTemplates requiere el template, el receiverEmail y las locals de tipo IEmailLocals
- Para trabajar en un entorno de producción nodemailer no es válido, solo para testing
- notification-ms/src/helpers.ts

~~~js
import path from 'path';

import { IEmailLocals, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import nodemailer, { Transporter } from 'nodemailer';
import Email from 'email-templates';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mailTransportHelper', 'debug');

async function emailTemplates(template: string, receiver: string, locals: IEmailLocals): Promise<void> {
  try {
                                                //creo el transport de nodeMailer
    const smtpTransport: Transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email', //usaremos ethereal, hay que crear una cuenta
      port: 587, //puerto smtp
      auth: {
        user: config.SENDER_EMAIL, //cerdenciales en env. (copiar el username de ethereal)
        pass: config.SENDER_EMAIL_PASSWORD
      }
    });

              //importo Email de email-templates
    const email: Email = new Email({
      message: {
        from: `Jobber App <${config.SENDER_EMAIL}>` //mi correo de ethereal
      },
      send: true, //en true podemos testearlo
      preview: false,
      transport: smtpTransport, //le paso el transport
      views: {
        options: {
          extension: 'ejs' //debo especificar el tipo de engine del template
        }
      },
      juice: true, //habilita el css en el template
      juiceResources: {
        preserveImportant: true, //prevalece el flag de html
        webResources: {
          relativeTo: path.join(__dirname, '../build')//el path donde haremos el build
        }
      }
    });

  //uso .send y le doy el path de los templates con el template en cuestión
    await email.send({
      template: path.join(__dirname, '..', 'src/emails', template),
      message: { to: receiver }, //destinatario
      locals
    });
  } catch (error) {
    log.error(error);
  }
}

export { emailTemplates };
~~~

- Hay otras maneras de componer emails con template strings 
- La interfaz de email en jobber-shared/src

~~~js
export interface IEmailLocals {
  sender?: string;
  appLink: string;
  appIcon: string;
  offerLink?: string;
  amount?: string;
  buyerUsername?: string;
  sellerUsername?: string;
  title?: string;
  description?: string;
  deliveryDays?: string;
  orderId?: string;
  orderDue?: string;
  requirements?: string;
  orderUrl?: string;
  originalDate?: string;
  newDate?: string;
  reason?: string;
  subject?: string;
  header?: string;
  type?: string;
  message?: string;
  serviceFee?: string;
  total?: string;
  username?: string;
  verifyLink?: string;
  resetLink?: string;
  otp?: string;
}
~~~

- En notification-ms/src/queues/email.consumer.ts desestructuro las variables, uso toString para usar el JSON.parse y pasarlo a JSON
- Genero el objeto locals
- Le paso a sendEmail el template, el destinatario y las locals
- Una vez enviado el mail uso .ack para eliminar la queue

~~~js
import { config } from '@notifications/config';
import { IEmailLocals, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@notifications/queues/connection';
import { sendEmail } from '@notifications/queues/mail.transport';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug');

async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
  //lo coloco todo en un try catch
  try {
    if (!channel) {
      channel = await createConnection() as Channel;
    }
    const exchangeName = 'jobber-email-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';

    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });

    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
                                                  
                                                  //tipo de amqplib
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {

      //desestructuro las variables                                           Uso toString para pasarlo a JSON
      const { receiverEmail, username, verifyLink, resetLink, template, otp } = JSON.parse(msg!.content.toString());

      //creo las locals
      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`, //url frontend
        appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
        username,
        verifyLink,
        resetLink,
        otp
      };

      await sendEmail(template, receiverEmail, locals);
      //Una vez enviado el email uso .ack para finalizar y quitar la queue
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'NotificationService EmailConsumer consumeAuthEmailMessages() method error:', error);
  }
}


export { consumeAuthEmailMessages};
~~~

- En notidication-ms/src/emails tengo las diferentes carpetas
  - forgotPassword
  - offer
  - orderDelivered
  - orderExtension
  - orderExtensionApproval
  - orderPlaced
  - orderReceipt
  - otpEmail
  - resetPasswordSuccess
  - verifyEmail
- Veamos verifyEmail
  - Tengo el **html.ejs** y el **subject.ejs**
- Docs en npm /email-templates
- html.ejs

~~~html
<div>
  <div></div>
  <div tabindex="-1"></div>
  <div
  >
   <div id=":ut" class="a3s aiL msg8498267932913214134">
    <u></u>
    <u></u>

    <div style="height: 100%; margin: 0; padding: 0; width: 100%; background-color: #f5f4f2;">
     <center>
      <table
       align="center"
       border="0"
       cellpadding="0"
       cellspacing="0"
       height="100%"
       width="100%"
       style="border-collapse: collapse; height: 100%; margin: 0; padding: 0; width: 100%; background-color: #f5f4f2;"
      >
       <tbody>
        <tr>
         <td align="center" valign="top" id="m_8498267932913214134bodyCell" style="height: 100%; margin: 0; padding: 8px; width: 100%; border-top: 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_8498267932913214134templateContainer" style="border-collapse: collapse; border: 0; border-radius: 16px; max-width: 600px;">
           <tbody>
            <tr>
             <td
              valign="top"
              id="m_8498267932913214134templateHeader"
              style="
               background-color: #ffffff;
               background-image: none;
               background-repeat: no-repeat;
               background-position: center;
               background-size: cover;
               border-top: 0;
               border-bottom: 0;
               padding-top: 0px;
               padding-bottom: 0px;
               border-radius: 16px 16px 0 0;
              "
             >
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border-collapse: collapse;">
               <tbody>
                <tr>
                 <td valign="top" style="padding: 16px;">
                  <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width: 100%; border-collapse: collapse;">
                   <tbody>
                    <tr>
                     <td valign="top" style="padding: 16px; text-align: center;">
                      <a
                       href="<%= appLink %>"
                       style="line-height: inherit; color: #4aa1f3; font-weight: normal; text-decoration: underline;"
                       target="_blank"
                      >
                       <img
                        align="center"
                        alt="Proton"
                        src="<%= appIcon %>"
                        width="190"
                        style="
                         width: 35.4477%;
                         max-width: 380px;
                         padding-bottom: 0;
                         vertical-align: bottom;
                         border: 0;
                         height: auto;
                         outline: none;
                         text-decoration: none;
                         font-family: Arial, Helvetica, sans-serif;
                         font-size: 16px;
                         line-height: 1.5em;
                         color: #4aa1f3;
                         display: inline;
                        "
                        data-image-whitelisted=""
                        class="CToWUd"
                        data-bit="iit"
                       />
                      </a>
                     </td>
                    </tr>
                   </tbody>
                  </table>
                 </td>
                </tr>
               </tbody>
              </table>
             </td>
            </tr>
            <tr>
             <td
              valign="top"
              style="background-color: #ffffff; background-image: none; background-repeat: no-repeat; background-position: center; background-size: cover; border-top: 0; border-bottom: 0; padding-top: 8px; padding-bottom: 8px;"
             >
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border-collapse: collapse; table-layout: fixed;">
               <tbody>
                <tr>
                 <td style="min-width: 100%; padding: 0 32px 0px 32px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border-top: 1px solid #f5f4f2; border-collapse: collapse;">
                   <tbody>
                    <tr>
                     <td>
                      <span></span>
                     </td>
                    </tr>
                   </tbody>
                  </table>
                 </td>
                </tr>
               </tbody>
              </table>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border-collapse: collapse;">
               <tbody>
                <tr>
                 <td valign="top">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 100%; min-width: 100%; border-collapse: collapse;">
                   <tbody>
                    <tr>
                     <td
                      valign="top"
                      style="
                       word-break: break-word;
                       color: #0c0c14;
                       font-family: Arial, Helvetica, sans-serif;
                       font-size: 16px;
                       line-height: 1.5em;
                       text-align: left;
                       padding-top: 8px;
                       padding-bottom: 12px;
                       padding-right: 32px;
                       padding-left: 32px;
                      "
                     >
                      <p style="padding: 0px; color: #0c0c14; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5em; text-align: left; margin: 12px 0px;">
                        Welcome to Jobber!
                      </p>
                      <p style="padding: 0px; color: #0c0c14; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5em; text-align: left; margin: 12px 0px;">
                        In order to get
                        started, you need to
                        verify your email
                        address.
                      </p>
                     </td>
                    </tr>
                   </tbody>
                  </table>
                 </td>
                </tr>
               </tbody>
              </table>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border-collapse: collapse;">
               <tbody>
                <tr>
                 <td valign="top" align="left" style="text-align: center; padding-left: 32px; padding-right: 32px; padding-top: 0px; padding-bottom: 32px;">
                  <table
                   border="0"
                   cellpadding="0"
                   cellspacing="0"
                   style="border-radius: 8px; background-color: #4aa1f3; margin-left: auto; margin-right: auto; border-collapse: separate;"
                  >
                   <tbody>
                    <tr>
                     <td
                      align="center"
                      valign="middle"
                      style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; padding-left: 32px; padding-right: 32px; padding-top: 12px; padding-bottom: 12px;"
                     >
                      <a
                       href="<%= verifyLink %>"
                       style="font-weight: normal; letter-spacing: 1px; line-height: 1.5em; text-align: center; text-decoration: none; color: #ffffff; display: block;"
                       target="_blank"
                      >
                       Verify email address
                      </a>
                     </td>
                    </tr>
                   </tbody>
                  </table>
                 </td>
                </tr>
               </tbody>
              </table>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border-collapse: collapse;">
               <tbody>
                <tr>
                 <td valign="top">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 100%; min-width: 100%; border-collapse: collapse;">
                   <tbody>
                    <tr>
                     <td
                      valign="top"
                      class="m_8498267932913214134mcnTextContent"
                      style="
                       word-break: break-word;
                       color: #0c0c14;
                       font-family: Arial, Helvetica, sans-serif;
                       font-size: 16px;
                       line-height: 1.5em;
                       text-align: left;
                       padding-top: 8px;
                       padding-bottom: 12px;
                       padding-right: 32px;
                       padding-left: 32px;
                      "
                     >
                      <p style="padding: 0px; color: #0c0c14; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5em; text-align: left; margin: 12px 0px;">
                       Best,<br />
                       The Jobber Team
                      </p>
                     </td>
                    </tr>
                   </tbody>
                  </table>
                 </td>
                </tr>
               </tbody>
              </table>
             </td>
            </tr>
            <!-- <tr>
             <td
              valign="top"
              id="m_8498267932913214134templateFooter"
              style="
               background-color: #ffffff;
               background-image: none;
               background-repeat: no-repeat;
               background-position: center;
               background-size: cover;
               border-top: 0;
               border-bottom: 0;
               padding-top: 16px;
               padding-bottom: 16px;
               border-radius: 0 0 16px 16px;
              "
             >
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border-collapse: collapse; table-layout: fixed;">
               <tbody>
                <tr>
                 <td style="min-width: 100%; padding: 0 32px 16px 32px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border-top: 1px solid #f5f4f2; border-collapse: collapse;">
                   <tbody>
                    <tr>
                     <td>
                      <span></span>
                     </td>
                    </tr>
                   </tbody>
                  </table>
                 </td>
                </tr>
               </tbody>
              </table>

             </td>
            </tr> -->
           </tbody>
          </table>
         </td>
        </tr>
       </tbody>
      </table>
     </center>
    </div>
   </div>
  </div>
 </div>
~~~

- En subject.ejs (el subject del email)

~~~
Reset your Jobber Password
~~~

- Se ve el uso de las variables en el template en el html.ejs de orderPlaced
- notification-ms/src/emails/orderPlaced/html.ejs

~~~html
<div>
  <div></div>
  <div tabindex="-1"></div>
  <div>
    <div>
      <u></u>

      <div style="margin: 0 !important; padding: 0 !important;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td width="100%" align="center" valign="top" bgcolor="#eeeeee" height="20"></td>
            </tr>
            <tr>
              <td bgcolor="#eeeeee" align="center" style="padding: 0px 15px 0px 15px;">
                <table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%"
                  style="max-width: 600px;">
                  <tbody>
                    <tr>
                      <td>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tbody>
                            <tr>
                              <td align="center" style="padding: 40px 40px 0px 40px;">
                                <a href="<%= appLink %>" target="_blank">
                                  <img src="<%= appIcon %>" width="70" border="0" style="vertical-align: middle;"
                                    class="CToWUd" data-bit="iit" />
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td align="center"
                                style="font-size: 18px; color: #0e0e0f; font-weight: 700; font-family: Helvetica Neue; line-height: 28px; vertical-align: top; text-align: center; padding: 35px 40px 0px 40px;">
                                <strong>
                                  You just received an order from <%= buyerUsername %><br />
                                    Please review the requirements below:
                                </strong>
                              </td>
                            </tr>

                            <tr>
                              <td align="center" bgcolor="#ffffff" height="1" style="padding: 40px 40px 5px;"
                                valign="top" width="100%">
                                <table cellpadding="0" cellspacing="0" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="border-top: 1px solid #e4e4e4;"></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>

                            <tr>
                              <td
                                style="font: 16px/22px 'Helvetica Neue', Arial, 'sans-serif'; text-align: left; color: #555555; padding: 40px 40px 0 40px;">
                                <p>
                                  Hi <%= sellerUsername %>,
                                </p>
                                <p>
                                  You've just received an order from <%= buyerUsername %>! Feels good, right?<br />
                                  Order
                                  <a href="<%= orderUrl %>"
                                    style="color: #4aa1f3; text-decoration: none;" target="_blank"
                                    >
                                    #<%= orderId %>
                                  </a>
                                  is due <strong>
                                    <%= orderDue %>
                                  </strong>.
                                </p>

                                <table align="center" style="color: #555555; margin: 0; width: 100%;">
                                  <tbody>
                                    <tr>
                                      <td style="color: #555555; border: 1px solid #aeaeae; border-radius: 3px;">
                                        <table cellspacing="0" cellpadding="8"
                                          style="border: none; border-bottom: 1px solid #aeaeae; width: 100%; font-family: arial;">
                                          <tbody>
                                            <tr>
                                              <td
                                                style="color: #000000; border-bottom: 1px solid #aeaeae; font-weight: bold; text-align: left;">
                                                Item
                                              </td>
                                              <td
                                                style="color: #000000; border-bottom: 1px solid #aeaeae; font-weight: bold; width: 20%;">
                                                Qty
                                              </td>
                                              <td
                                                style="color: #000000; border-bottom: 1px solid #aeaeae; font-weight: bold; width: 40px; text-align: right;">
                                                Price
                                              </td>
                                            </tr>
                                            <tr>
                                              <td
                                                style="color: #555555; font-weight: bold; text-align: left; border-right: 1px solid #aeaeae; border-bottom: 1px solid #aeaeae;">
                                                <%= title %> -
                                                  <span style="font-weight: normal;">
                                                    <%= description %>
                                                  </span>
                                              </td>

                                              <td
                                                style="color: #555555; border-right: 1px solid #aeaeae; border-bottom: 1px solid #aeaeae;">
                                                × 1</td>
                                              <td
                                                style="text-align: right; color: #555555; border-bottom: 1px solid #aeaeae;">
                                                $<%= amount %>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <div
                                          style="text-align: right; padding: 10px 8px 10px 0px; color: #000000; font-size: 16px; font-family: arial; font-weight: 700;">
                                          Total: $<%= amount %>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <p style="font-weight: 500; padding-top: 20px;">
                                  The buyer has provided the following order requirements:
                                </p>

                                <ol style="margin: 0; padding: 0 20px;">
                                  <li>
                                    <p style="margin-bottom: 0;">Requirements</p>

                                    <p style="margin: 0;">
                                      <%= requirements %>
                                    </p>
                                  </li>
                                </ol>

                                <table cellpadding="0" cellspacing="0" width="100%" style="margin-top: 50px;">
                                  <tbody>
                                    <tr>
                                      <td style="border-top: 1px solid #e4e4e4;"></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <table width="100%" border="0" cellspacing="0" cellpadding="0"
                                  style="margin: 30px 0px;">
                                  <tbody>
                                    <tr>
                                      <td align="center" style="text-align: center;">
                                        <p
                                          style="font: 16px/22px 'Helvetica Neue', Arial, 'sans-serif'; text-align: center; color: #555555; padding: 0 0 20px 0; margin: 0;">
                                          Got everything you need?
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center" style="text-align: center;">
                                        <a name="m_-4412857948817324922_CTA" bgcolor="#1dbf73" style="
                                            color: #ffffff;
                                            background-color: #4aa1f3;
                                            display: inline-block;
                                            font-family: Helvetica Neue;
                                            font-size: 16px;
                                            line-height: 30px;
                                            text-align: center;
                                            font-weight: bold;
                                            text-decoration: none;
                                            padding: 5px 20px;
                                            border-radius: 3px;
                                            text-transform: none;"
                                          href="<%= orderUrl %>" target="_blank">
                                          View Order
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td width="100%" align="center" valign="top" bgcolor="#ffffff" height="45"></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
~~~

- Hago uso en el notification-ms/src/server.ts usando el emailChannel

~~~js
import 'express-async-errors';
import http from 'http';

import { winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export function start(app: Application): void {
  startServer(app);
  app.use('', healthRoutes());
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  const emailChannel: Channel = await createConnection() as Channel;
  await consumeAuthEmailMessages(emailChannel);
  //await consumeOrderEmailMessages(emailChannel);

}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error);
  }
}
~~~
------

- La interfaz en jobber-shared/src/auth.interface

~~~js
export interface IEmailMessageDetails {
  receiverEmail?: string;
  template?: string;
  verifyLink?: string;
  resetLink?: string;
  username?: string;
  otp?: string;
}
~~~


- Faltaría ejecutarlo en el server pasándole el channel
- El html.ejs de verifyEmail

~~~html
<div>
  <div></div>
  <div tabindex="-1"></div>
  <div
  >
   <div id=":ut" class="a3s aiL msg8498267932913214134">
    <u></u>
    <u></u>

    <div style="height: 100%; margin: 0; padding: 0; width: 100%; background-color: #f5f4f2;">
     <center>
      <table
       align="center"
       border="0"
       cellpadding="0"
       cellspacing="0"
       height="100%"
       width="100%"
       style="border-collapse: collapse; height: 100%; margin: 0; padding: 0; width: 100%; background-color: #f5f4f2;"
      >
       <tbody>
        <tr>
         <td align="center" valign="top" id="m_8498267932913214134bodyCell" style="height: 100%; margin: 0; padding: 8px; width: 100%; border-top: 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_8498267932913214134templateContainer" style="border-collapse: collapse; border: 0; border-radius: 16px; max-width: 600px;">
           <tbody>
            <tr>
             <td
              valign="top"
              id="m_8498267932913214134templateHeader"
              style="
               background-color: #ffffff;
               background-image: none;
               background-repeat: no-repeat;
               background-position: center;
               background-size: cover;
               border-top: 0;
               border-bottom: 0;
               padding-top: 0px;
               padding-bottom: 0px;
               border-radius: 16px 16px 0 0;
              "
             >
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border-collapse: collapse;">
               <tbody>
                <tr>
                 <td valign="top" style="padding: 16px;">
                  <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width: 100%; border-collapse: collapse;">
                   <tbody>
                    <tr>
                     <td valign="top" style="padding: 16px; text-align: center;">
                      <a
                       href="<%= appLink %>"
                       style="line-height: inherit; color: #4aa1f3; font-weight: normal; text-decoration: underline;"
                       target="_blank"
                      >
                       <img
                        align="center"
                        alt="Proton"
                        src="<%= appIcon %>"
                        width="190"
                        style="
                         width: 35.4477%;
                         max-width: 380px;
                         padding-bottom: 0;
                         vertical-align: bottom;
                         border: 0;
                         height: auto;
                         outline: none;
                         text-decoration: none;
                         font-family: Arial, Helvetica, sans-serif;
                         font-size: 16px;
                         line-height: 1.5em;
                         color: #4aa1f3;
                         display: inline;
                        "
                        data-image-whitelisted=""
                        class="CToWUd"
                        data-bit="iit"
                       />
                      </a>
                     </td>
                    </tr>
                   </tbody>
                  </table>
                 </td>
                </tr>
               </tbody>
              </table>
             </td>
            </tr>
            <tr>
             <td
              valign="top"
              style="background-color: #ffffff; background-image: none; background-repeat: no-repeat; background-position: center; background-size: cover; border-top: 0; border-bottom: 0; padding-top: 8px; padding-bottom: 8px;"
             >
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border-collapse: collapse; table-layout: fixed;">
               <tbody>
                <tr>
                 <td style="min-width: 100%; padding: 0 32px 0px 32px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border-top: 1px solid #f5f4f2; border-collapse: collapse;">
                   <tbody>
                    <tr>
                     <td>
                      <span></span>
                     </td>
                    </tr>
                   </tbody>
                  </table>
                 </td>
                </tr>
               </tbody>
              </table>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border-collapse: collapse;">
               <tbody>
                <tr>
                 <td valign="top">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 100%; min-width: 100%; border-collapse: collapse;">
                   <tbody>
                    <tr>
                     <td
                      valign="top"
                      style="
                       word-break: break-word;
                       color: #0c0c14;
                       font-family: Arial, Helvetica, sans-serif;
                       font-size: 16px;
                       line-height: 1.5em;
                       text-align: left;
                       padding-top: 8px;
                       padding-bottom: 12px;
                       padding-right: 32px;
                       padding-left: 32px;
                      "
                     >
                      <p style="padding: 0px; color: #0c0c14; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5em; text-align: left; margin: 12px 0px;">
                        Welcome to Jobber!
                      </p>
                      <p style="padding: 0px; color: #0c0c14; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5em; text-align: left; margin: 12px 0px;">
                        In order to get
                        started, you need to
                        verify your email
                        address.
                      </p>
                     </td>
                    </tr>
                   </tbody>
                  </table>
                 </td>
                </tr>
               </tbody>
              </table>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border-collapse: collapse;">
               <tbody>
                <tr>
                 <td valign="top" align="left" style="text-align: center; padding-left: 32px; padding-right: 32px; padding-top: 0px; padding-bottom: 32px;">
                  <table
                   border="0"
                   cellpadding="0"
                   cellspacing="0"
                   style="border-radius: 8px; background-color: #4aa1f3; margin-left: auto; margin-right: auto; border-collapse: separate;"
                  >
                   <tbody>
                    <tr>
                     <td
                      align="center"
                      valign="middle"
                      style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; padding-left: 32px; padding-right: 32px; padding-top: 12px; padding-bottom: 12px;"
                     >
                      <a
                       href="<%= verifyLink %>"
                       style="font-weight: normal; letter-spacing: 1px; line-height: 1.5em; text-align: center; text-decoration: none; color: #ffffff; display: block;"
                       target="_blank"
                      >
                       Verify email address
                      </a>
                     </td>
                    </tr>
                   </tbody>
                  </table>
                 </td>
                </tr>
               </tbody>
              </table>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border-collapse: collapse;">
               <tbody>
                <tr>
                 <td valign="top">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 100%; min-width: 100%; border-collapse: collapse;">
                   <tbody>
                    <tr>
                     <td
                      valign="top"
                      class="m_8498267932913214134mcnTextContent"
                      style="
                       word-break: break-word;
                       color: #0c0c14;
                       font-family: Arial, Helvetica, sans-serif;
                       font-size: 16px;
                       line-height: 1.5em;
                       text-align: left;
                       padding-top: 8px;
                       padding-bottom: 12px;
                       padding-right: 32px;
                       padding-left: 32px;
                      "
                     >
                      <p style="padding: 0px; color: #0c0c14; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5em; text-align: left; margin: 12px 0px;">
                       Best,<br />
                       The Jobber Team
                      </p>
                     </td>
                    </tr>
                   </tbody>
                  </table>
                 </td>
                </tr>
               </tbody>
              </table>
             </td>
            </tr>
            <!-- <tr>
             <td
              valign="top"
              id="m_8498267932913214134templateFooter"
              style="
               background-color: #ffffff;
               background-image: none;
               background-repeat: no-repeat;
               background-position: center;
               background-size: cover;
               border-top: 0;
               border-bottom: 0;
               padding-top: 16px;
               padding-bottom: 16px;
               border-radius: 0 0 16px 16px;
              "
             >
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border-collapse: collapse; table-layout: fixed;">
               <tbody>
                <tr>
                 <td style="min-width: 100%; padding: 0 32px 16px 32px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border-top: 1px solid #f5f4f2; border-collapse: collapse;">
                   <tbody>
                    <tr>
                     <td>
                      <span></span>
                     </td>
                    </tr>
                   </tbody>
                  </table>
                 </td>
                </tr>
               </tbody>
              </table>

             </td>
            </tr> -->
           </tbody>
          </table>
         </td>
        </tr>
       </tbody>
      </table>
     </center>
    </div>
   </div>
  </div>
 </div>
~~~

- Puedo mirar en el template las variables que necesito y pasárselas en el Buffer dentro de un objeto message
- Para forgotPassword usaría un objeto como este

~~~js
const messageDetails: IEmailMessageDetails={
  receiverEmail: `${config.SENDER_EMAIL}`,
  resetLink: verificationLink,
  username: 'Manuel'.
  template: 'fotgotPassword'
}

channel.publish('jobber-email-notification', 'auth-email', Buffer.from(message))
~~~

- Puedo ver en elasticSearch/Observability/Logs Email Sent Succesfully
- Es lo que puse en el transport
- El link del template me dará un url en el frontend desde donde extraer el token y hacer la verificación
-----

## Add send email to order consume

- Para las diferentes variantes copio el código **hasta channel.consume** cambiando las variable de queueName y la routuingKey
- La data para extraer con la desestructuración está en la interfaz **IEmailLocals**
- El mail para enviar cuando la orden es este

~~~js
async function consumeOrderEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = await createConnection() as Channel;
    }
    const exchangeName = 'jobber-order-notification';
    const routingKey = 'order-email';
    const queueName = 'order-email-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const {
        receiverEmail,
        username,
        template,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total     //desestructuro el msg de toString a JSON.parse 
      } = JSON.parse(msg!.content.toString());

      //son las variables a desplegar en el email-template
      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
        username,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total
      };
      if (template === 'orderPlaced') { //enviamos la orden y el recibo
        await sendEmail('orderPlaced', receiverEmail, locals);
        await sendEmail('orderReceipt', receiverEmail, locals);
      } else {
        await sendEmail(template, receiverEmail, locals);
      }
      channel.ack(msg!); //borro la queue
    });
  } catch (error) {
    log.log('error', 'NotificationService EmailConsumer consumeOrderEmailMessages() method error:', error);
  }
}
~~~
------

## Setup Jest

----
- El Dockerfile.dev
- Declaro la imagen de Node
- Declaro el directorio donde voy a trabajar
- Copio el package.json en la raiz
- Copio diferentes directorios
- Con RUN ejecuto npm i e instalo nodemon globalmente
- Uso los comandos npm run dev

~~~Dockerfile
FROM node:21-alpine3.18

WORKDIR /app  
COPY package.json ./
COPY tsconfig.json ./
COPY .npmrc ./
COPY src ./src
COPY tools ./tools
RUN ls -a
RUN npm install && npm install -g nodemon

EXPOSE 4001

CMD [ "npm", "run", "dev" ]
~~~

- Docker.ignore

~~~
node_modules
.git/
Dockerfile
.dockerignore
coverage/
~~~

- Añado  notification service en docker-compose

~~~yaml
  notifications:
    container_name: notification_container
    build:
      context: ../server/2-notification-service
      dockerfile: Dockerfile.dev
    restart: always
    ports:
      - 4001:4001
    env_file: ../server/2-notification-service/.env
    environment:
      - ENABLE_APM=1
      - NODE_ENV=development
      - CLIENT_URL=http://localhost:3000
      - RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@rabbitmq_container:5672
      - SENDER_EMAIL=lysanne.rutherford88@ethereal.email
      - SENDER_EMAIL_PASSWORD=ad8y45AkfebKmW8rCV
      - ELASTIC_SEARCH_URL=http://elastic:admin1234@elasticsearch_container:9200
      - ELASTIC_APM_SERVER_URL=http://apm_server_container:8200
      - ELASTIC_APM_SECRET_TOKEN=
    depends_on:
      - elasticsearch
~~~

- Production Dockerfile

~~~Dockerfile
FROM node:21-alpine3.18 as builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc ./
COPY src ./src
COPY tools ./tools
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

EXPOSE 4001

CMD [ "npm", "run", "start" ]
~~~

- Los scripts en el package.json

~~~json
  "scripts": {
    "start": "pm2 start ./build/src/app.js -i 5 --attach --watch | pino-pretty -c",
    "stop": "pm2 stop all",
    "delete": "pm2 delete all",
    "dev": "nodemon -r tsconfig-paths/register src/app.ts | pino-pretty -c",
    "lint:check": "eslint 'src/**/*.ts'",
    "lint:fix": "eslint 'src/**/*.ts' --fix",
    "prettier:check": "prettier --check 'src/**/*.{ts,json}'",
    "prettier:fix": "prettier --write 'src/**/*.{ts,json}'",
    "build": "tsc --project tsconfig.json && tsc-alias -p tsconfig.json && ts-node tools/copyAssets.ts",
    "test": "jest --coverage=true -w=1 --forceExit --detectOpenHandles --watchAll=false"
  },
~~~