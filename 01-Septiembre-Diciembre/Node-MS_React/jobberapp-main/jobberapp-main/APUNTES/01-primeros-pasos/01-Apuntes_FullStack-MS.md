# 01 NODE-REACT MICROSERVICES FULL STACK

- Tengo este árbol de directorios
  - jobber-client
    - public
    - src
      - assets
      - features
        - auth
          - components
          - hooks
          - interfaces
          - reducers
          - schemes
          - services
        - buyer
          - components
          - interfaces
          - reducers
          - services
        - chat
          - components
          - hooks
          - interfaces
          - services
        - error
        - gigs
          - components
          - context
          - hooks
          - interfaces
          - schemes
          - services
        - home
          - components
          - interfaces
        - index
          - gig-tabs
        - order
          - components
          - context
          - hooks
          - interfaces
          - services
        - sellers
          - components
          - context
          - hooks
          - interfaces
          - reducers
          - schemes
          - services
        - settings
          - components
          - services
      - shared
        - alert
        - banner
        - breadcrumb
        - button
        - dropdown
        - gigs
        - header
        - hooks
        - html-parser
        - inputs
        - modals
        - page-loader
        - page-message
        - rating
        - utils
      - sockets
      - store
  - jobber-k8s
    - AWS
      - 0 - frontend
      - 1 - gateway
      - 2 - notifications
      - 3 - auth
      - 4 - users
      - 5 - gig
      - 6 - chat
      - 7 - order
      - 8 - reviews
      - jobber-elastic
      - jobber-prometheus-grafana
      - jobber-queue
      - jobber-secrets
    - minikube
      - 0 - frontend
      - 1 - gateway
      - 2 - notifications
      - 3 - auth
      - 4 - users
      - 5 - gig
      - 6 - chat
      - 7 - order
      - 8 - reviews
      - jobber-elastic
      - jobber-prometheus-grafana
      - jobber-queue
      - jobber-secrets 
  - microservices
    - 1 - gateway-service
      - src
        - controllers
          - auth
          - gig
          - message
          - order
          - review
          - users
        - redis
        - routes
        - services
        - sockets
    - 2 - notification-service
      - src
        - emails
          - forgotPassword
          - offer
          - orderdelivered
          - orderExtension
          - orderExtensionApproval
          - orderPlaced
          - orderReceipt
          - otpEmail
          - resetPasswordSuccess
          - verifyEmail
        - queues
      - tools
    - 3 - auth-service
      - src
        - controllers
        - models
        - queues
        - routes
        - schemes
        - services
    - 4 - users-service
      - src
        - controllers
          - buyer
          - seller
        - models
        - queues
        - routes
        - schemes
        - services
    - 5 - gig-service
      - src
        - controllers
        - models
        - queues
        - redis
        - routes
        - schemes
        - services
    - 6 - chat-service
      - src
        - controllers
        - models
        - queues
        - routes
        - schemes
        - services
    - 7 - order-service
      - src
        - controllers
        - models
        - queues
        - routes
        - schemes
        - services
    - 8 - review-service
      - src
        - controllers
        - queues
        - routes
        - services
    - 9 - jobber-shared
      - .github
      - scripts
      - src
    - 10 - jenkins-automation
  - volumes

- Voy con los package.json

- jobber-client

~~~json
{
  "name": "jobber-client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint:check": "eslint src --ext ts,tsx,js,jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx,js,jsx --fix",
    "prettier:check": "prettier --check 'src/**/*.{ts,tsx,js,jsx,json}'",
    "prettier:fix": "prettier --write 'src/**/*.{ts,tsx,js,jsx,json}'",
    "preview": "vite preview"
  },
  "dependencies": {
    "@elastic/apm-rum": "^5.16.0",
    "@headlessui/react": "^1.7.18",
    "@react-pdf/renderer": "^3.4.2",
    "@reduxjs/toolkit": "^2.2.3",
    "@stripe/react-stripe-js": "^2.6.2",
    "@stripe/stripe-js": "^3.1.0",
    "axios": "^1.6.8",
    "date-fns": "^3.6.0",
    "html-react-parser": "^5.1.10",
    "i18n-iso-countries": "^7.11.0",
    "lodash": "^4.17.21",
    "millify": "^6.1.0",
    "react": "^18.2.0",
    "react-device-detect": "^2.2.3",
    "react-dom": "^18.2.0",
    "react-fast-compare": "^3.2.2",
    "react-icons": "^5.0.1",
    "react-lazy-load-image-component": "^1.6.0",
    "react-quill": "^2.0.0",
    "react-redux": "^9.1.0",
    "react-router-dom": "^6.22.3",
    "react-sticky-box": "^2.0.5",
    "react-toastify": "^10.0.5",
    "redux-persist": "^6.0.0",
    "sass": "^1.72.0",
    "socket.io-client": "^4.7.5",
    "typed.js": "^2.1.0",
    "uuid": "^9.0.1",
    "yup": "^1.4.0"
  },
  "devDependencies": {
    "@types/lodash": "^4.17.0",
    "@types/react": "^18.2.73",
    "@types/react-dom": "^18.2.23",
    "@types/react-lazy-load-image-component": "^1.6.3",
    "@types/redux-persist": "^4.3.1",
    "@types/uuid": "^9.0.8",
    "@typescript-eslint/eslint-plugin": "^7.4.0",
    "@typescript-eslint/parser": "^7.4.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-import": "^2.29.1",
    "eslint-plugin-jest": "^27.9.0",
    "eslint-plugin-prettier": "^5.1.3",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "eslint-plugin-simple-import-sort": "^12.0.0",
    "postcss": "^8.4.38",
    "prettier": "^3.2.5",
    "prettier-plugin-tailwindcss": "^0.5.13",
    "tailwindcss": "^3.4.3",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.3",
    "vite": "^5.2.7",
    "vite-tsconfig-paths": "^4.3.2"
  }
}
~~~

- microservices/1-gateway-service

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
- micorservices/2-notification-service

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

- microservices/3-auth-service

~~~json
{
  "name": "jobber-auth",
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
    "bcryptjs": "^2.4.3",
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
    "mysql2": "^3.6.3",
    "pino-pretty": "^10.2.3",
    "sequelize": "^6.34.0",
    "typescript": "^5.2.2",
    "typescript-transform-paths": "^3.4.6",
    "unique-username-generator": "^1.2.0",
    "uuid": "^9.0.1",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@jest/types": "^29.6.3",
    "@types/amqplib": "^0.10.3",
    "@types/bcryptjs": "^2.4.5",
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
    "ts-alias": "^0.0.7",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.1",
    "tsc-alias": "^1.8.8",
    "tsconfig-paths": "^4.2.0"
  }
}
~~~

- microservices/4-users-service

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

- microservices/5-gig-service

~~~json
{
  "name": "jobber-gig",
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
    "redis": "^4.6.10",
    "typescript": "^5.2.2",
    "typescript-transform-paths": "^3.4.6",
    "uuid": "^9.0.1",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@jest/types": "^29.6.3",
    "@types/amqplib": "^0.10.4",
    "@types/compression": "^1.7.5",
    "@types/cors": "^2.8.16",
    "@types/express": "^4.17.21",
    "@types/hpp": "^0.2.5",
    "@types/jest": "^29.5.7",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/lodash": "^4.14.200",
    "@types/uuid": "^9.0.6",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
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

- microservice/chat-service

~~~json
{
  "name": "jobber-chat",
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
    "amqplib": "^0.10.3",
    "cloudinary": "^1.41.0",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "elastic-apm-node": "^4.1.0",
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "helmet": "^7.1.0",
    "hpp": "^0.2.3",
    "http-status-codes": "^2.3.0",
    "joi": "^17.11.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.0",
    "pino-pretty": "^10.2.3",
    "socket.io": "^4.7.2",
    "typescript": "^5.2.2",
    "typescript-transform-paths": "^3.4.6",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@jest/types": "^29.6.3",
    "@types/amqplib": "^0.10.4",
    "@types/compression": "^1.7.5",
    "@types/cors": "^2.8.16",
    "@types/express": "^4.17.21",
    "@types/hpp": "^0.2.5",
    "@types/jest": "^29.5.8",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/lodash": "^4.14.201",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
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

- microservices/7-order-service

~~~json
{
  "name": "jobber-order",
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
    "amqplib": "^0.10.3",
    "cloudinary": "^1.41.0",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "elastic-apm-node": "^4.1.0",
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "helmet": "^7.1.0",
    "hpp": "^0.2.3",
    "http-status-codes": "^2.3.0",
    "joi": "^17.11.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.0",
    "pino-pretty": "^10.2.3",
    "socket.io": "^4.7.2",
    "stripe": "^14.3.0",
    "typescript": "^5.2.2",
    "typescript-transform-paths": "^3.4.6",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@jest/types": "^29.6.3",
    "@types/amqplib": "^0.10.4",
    "@types/compression": "^1.7.5",
    "@types/cors": "^2.8.16",
    "@types/express": "^4.17.21",
    "@types/hpp": "^0.2.5",
    "@types/jest": "^29.5.8",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/lodash": "^4.14.201",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
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

- microservices/8-review-service

~~~json
{
  "name": "jobber-review",
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
    "amqplib": "^0.10.3",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "elastic-apm-node": "^4.1.0",
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "helmet": "^7.1.0",
    "hpp": "^0.2.3",
    "http-status-codes": "^2.3.0",
    "joi": "^17.11.0",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.11.3",
    "pino-pretty": "^10.2.3",
    "typescript": "^5.2.2",
    "typescript-transform-paths": "^3.4.6",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@jest/types": "^29.6.3",
    "@types/amqplib": "^0.10.4",
    "@types/compression": "^1.7.5",
    "@types/cors": "^2.8.16",
    "@types/express": "^4.17.21",
    "@types/hpp": "^0.2.5",
    "@types/jest": "^29.5.8",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/lodash": "^4.14.201",
    "@types/pg": "^8.10.9",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
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

- microservices/9-jobber-shared

~~~json
{
  "version": "0.0.1",
  "license": "MIT",
  "types": "./src/index.d.ts",
  "description": "Helpers library for Jobber app",
  "scripts": {
    "build": "npm run build:cjs && npm run build:esm && tsc --outDir build/src && node scripts/build-package.js",
    "build:cjs": "NODE_ENV=production BABEL_ENV=cjs babel src --presets=./scripts/babel-preset.js --extensions .ts,.tsx --ignore src/**/*.specs.tsx --out-dir build/cjs --source-maps",
    "build:esm": "NODE_ENV=production BABEL_ENV=esm babel src --presets=./scripts/babel-preset.js --extensions .ts,.tsx --ignore src/**/*.specs.tsx --out-dir build/esm --source-maps"
  },
  "prettier": {
    "printWidth": 80,
    "semi": true,
    "singleQuote": true,
    "trailingComma": "es5"
  },
  "keywords": [],
  "name": "",
  "author": "",
  "repository": {
    "type": "git",
    "url": ""
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "files": [
    "build",
    "src"
  ],
  "exports": {
    ".": {
      "import": "./src/index.js",
      "require": "./src/index.js"
    }
  },
  "dependencies": {
    "@elastic/elasticsearch": "^8.13.0",
    "cloudinary": "^2.1.0",
    "express": "^4.19.2",
    "http-status-codes": "^2.3.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.2.4",
    "typescript": "^5.4.3",
    "winston": "^3.13.0",
    "winston-elasticsearch": "^0.18.0"
  },
  "devDependencies": {
    "@babel/cli": "^7.24.1",
    "@babel/preset-env": "^7.24.3",
    "@babel/preset-typescript": "^7.24.1",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6"
  }
}
~~~

- En la carpeta volumes tengo el docker-compose.yaml

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

- El Dockerfile.dev en cada microservicio es así

~~~Dockerfile
FROM node:21-alpine3.18

WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY .npmrc ./
COPY src ./src
RUN ls -a
RUN npm install && npm install -g nodemon

EXPOSE 4003

CMD [ "npm", "run", "dev" ]
~~~

- Vamos con los archivos .env.dev
- El del jobber-client

~~~
VITE_NODE_ENV=development
VITE_BASE_ENDPOINT=http://localhost:4000
VITE_CLIENT_ENDPOINT=http://localhost:3000
VITE_STRIPE_KEY=
VITE_ELASTIC_APM_SERVER=http://localhost:8200
~~~

- Los de los microservicios
- 1-gateway-service

~~~
ENABLE_APM=0
GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
NODE_ENV=development
SECRET_KEY_ONE=032c5c3cfc37938ae6dd43d3a3ec7834
SECRET_KEY_TWO=d66e377018c0bc0b5772bbc9b131e6d9
CLIENT_URL=http://localhost:3000
AUTH_BASE_URL=http://localhost:4002
USERS_BASE_URL=http://localhost:4003
GIG_BASE_URL=http://localhost:4004
MESSAGE_BASE_URL=http://localhost:4005
ORDER_BASE_URL=http://localhost:4006
REVIEW_BASE_URL=http://localhost:4007
REDIS_HOST=redis://localhost:6379
ELASTIC_SEARCH_URL=http://elastic:admin1234@localhost:9200
ELASTIC_APM_SERVER_URL=http://localhost:8200
ELASTIC_APM_SECRET_TOKEN=
~~~

- 2-notification-service

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

- 3-auth-service

~~~
ENABLE_APM=0
GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
NODE_ENV=development
AP_GATEWAY_URL=http://localhost:4000
CLIENT_URL=http://localhost:3000
RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@localhost:5672
MYSQL_DB=mysql://jobber:api@localhost:3306/jobber_auth
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
ELASTIC_SEARCH_URL=http://elastic:admin1234@localhost:9200
ELASTIC_APM_SERVER_URL=http://localhost:8200
ELASTIC_APM_SECRET_TOKEN=
~~~

- 4-users-service

~~~
ENABLE_APM=0
DATABASE_URL=mongodb://127.0.0.1:27017/jobber-users
GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
NODE_ENV=development
AP_GATEWAY_URL=http://localhost:4000
RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@localhost:5672
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
REDIS_HOST=redis://localhost:6379
ELASTIC_SEARCH_URL=http://elastic:admin1234@localhost:9200
ELASTIC_APM_SERVER_URL=http://localhost:8200
ELASTIC_APM_SECRET_TOKEN=
~~~

- 5-gig-service

~~~
ENABLE_APM=0
DATABASE_URL=mongodb://127.0.0.1:27017/jobber-gig
GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
NODE_ENV=development
AP_GATEWAY_URL=http://localhost:4000
RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@localhost:5672
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
REDIS_HOST=redis://localhost:6379
ELASTIC_SEARCH_URL=http://elastic:admin1234@localhost:9200
ELASTIC_APM_SERVER_URL=http://localhost:8200
ELASTIC_APM_SECRET_TOKEN=
~~~

- 6-chat-service

~~~
ENABLE_APM=0
DATABASE_URL=mongodb://127.0.0.1:27017/jobber-chat
GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
NODE_ENV=development
AP_GATEWAY_URL=http://localhost:4000
RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@localhost:5672
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
ELASTIC_SEARCH_URL=http://elastic:admin1234@localhost:9200
ELASTIC_APM_SERVER_URL=http://localhost:8200
ELASTIC_APM_SECRET_TOKEN=
~~~

- 7-orders-service

~~~
ENABLE_APM=0
DATABASE_URL=mongodb://127.0.0.1:27017/jobber-order
GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
NODE_ENV=development
AP_GATEWAY_URL=http://localhost:4000
CLIENT_URL=http://localhost:3000
RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@localhost:5672
STRIPE_API_KEY=
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
ELASTIC_SEARCH_URL=http://elastic:admin1234@localhost:9200
ELASTIC_APM_SERVER_URL=http://localhost:8200
ELASTIC_APM_SECRET_TOKEN=
~~~

- 8-review-service

~~~
ENABLE_APM=0
DATABASE_HOST=
DATABASE_USER=jobber
DATABASE_PASSWORD=api
DATABASE_NAME=jobber_reviews
CLUSTER_TYPE=local
GATEWAY_JWT_TOKEN=1282722b942e08c8a6cb033aa6ce850e
JWT_TOKEN=8db8f85991bb28f45ac0107f2a1b349c
NODE_ENV=development
AP_GATEWAY_URL=http://localhost:4000
RABBITMQ_ENDPOINT=amqp://jobber:jobberpass@localhost:5672
ELASTIC_SEARCH_URL=http://elastic:admin1234@localhost:9200
ELASTIC_APM_SERVER_URL=http://localhost:8200
ELASTIC_APM_SECRET_TOKEN=
~~~

- Fuera de microservices, en volumes tengo este .yml

~~~yml
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

- En jobber-shared instalo

> npm i -D @babel/cli @babel/preset-env @babel/preset-typescript @types/express @types/jsonwebtoken

- En jobber-shared/scripts
- babel.preset.js

~~~js
const BABEL_ENV = process.env.BABEL_ENV;
const isCommonJS = BABEL_ENV !== undefined && BABEL_ENV === 'cjs';
const isESM = BABEL_ENV !== undefined && BABEL_ENV === 'esm';

module.exports = () => ({
  presets: [
    ['@babel/preset-typescript'],
    [
      '@babel/env',
      {
        bugfixes: true,
        loose: true,
        modules: isCommonJS ? 'commonjs' : false,
        targets: {
          esmodules: isESM ? true : undefined,
          chrome: 70,
        },
      },
    ],
  ],
});
~~~

- En /build-package.js

~~~js
const BABEL_ENV = process.env.BABEL_ENV;
const isCommonJS = BABEL_ENV !== undefined && BABEL_ENV === 'cjs';
const isESM = BABEL_ENV !== undefined && BABEL_ENV === 'esm';

module.exports = () => ({
  presets: [
    ['@babel/preset-typescript'],
    [
      '@babel/env',
      {
        bugfixes: true,
        loose: true,
        modules: isCommonJS ? 'commonjs' : false,
        targets: {
          esmodules: isESM ? true : undefined,
          chrome: 70,
        },
      },
    ],
  ],
});
~~~

- En keyowrds/name pongo mi usuario de github, lo que usaré para compartir los archivos helpers

~~~json
{
  "version": "0.0.1",
  "license": "MIT",
  "types": "./src/index.d.ts",
  "description": "Helpers library for Jobber app",
  "scripts": {
    "build": "npm run build:cjs && npm run build:esm && tsc --outDir build/src && node scripts/build-package.js",
    "build:cjs": "NODE_ENV=production BABEL_ENV=cjs babel src --presets=./scripts/babel-preset.js --extensions .ts,.tsx --ignore src/**/*.specs.tsx --out-dir build/cjs --source-maps",
    "build:esm": "NODE_ENV=production BABEL_ENV=esm babel src --presets=./scripts/babel-preset.js --extensions .ts,.tsx --ignore src/**/*.specs.tsx --out-dir build/esm --source-maps"
  },
  "prettier": {
    "printWidth": 80,
    "semi": true,
    "singleQuote": true,
    "trailingComma": "es5"
  },
  "keywords": [],
  "name": "@mi_usuario_github/jobber-shared", //para compartir e importar los archivos
  "author": "Yo",
  "repository": {
    "type": "git",
    "url": "la dirección de mi proyecto en github"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "files": [
    "build",
    "src"
  ],
  "exports": {
    ".": {
      "import": "./src/index.js",
      "require": "./src/index.js"
    }
  },
  "dependencies": {
    "@elastic/elasticsearch": "^8.13.0",
    "cloudinary": "^2.1.0",
    "express": "^4.19.2",
    "http-status-codes": "^2.3.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.2.4",
    "typescript": "^5.4.3",
    "winston": "^3.13.0",
    "winston-elasticsearch": "^0.18.0"
  },
  "devDependencies": {
    "@babel/cli": "^7.24.1",
    "@babel/preset-env": "^7.24.3",
    "@babel/preset-typescript": "^7.24.1",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6"
  }
}
~~~

- El ts.config de jobber-shared

~~~js
{
  "compilerOptions": {
    "declaration": true,
    "experimentalDecorators": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "importHelpers": true,
    "lib": ["DOM", "esnext"],
    "module": "CommonJS",
    "moduleResolution": "node",
    "noEmitOnError": true,
    "outDir": "build",
    "rootDir": "./src",
    "sourceMap": true,
    "strict": true,
    "target": "es5",
    "emitDecoratorMetadata": true,
    "forceConsistentCasingInFileNames": true,
    "pretty": true,
    "resolveJsonModule": true,
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
~~~

- El .editorconfig (ayuda al trabajo en equipo)

~~~
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

- Creo un proyecto solo para joober-shared en github
- Creo un token en github (Personal access tokens/Tokens (classis))
- Creo un archivo .npmrc en la raiz de jobber-shared

~~~
@uzochukwueddie:registry=https://npm.pkg.github.com/uzochukwueddie
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
~~~