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
- Uso log.info para informar, log.log para los errores

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