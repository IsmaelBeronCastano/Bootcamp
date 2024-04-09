# NODE_TS REST SERVER

> npm init -y
> npm i -D typescript @types/node ts-node-dev rimraf
> npx tsc --init --outDir dist/ --rootDir src

- Crear scripts

~~~
"dev": "tsnd --respawn --clear src/app.ts",
"build": "rimraf ./dist && tsc",
"start": "npm run build && node dist/app.js",
~~~

- Creo src/app.ts
----

## Creemos un Web Server

~~~js

~~~