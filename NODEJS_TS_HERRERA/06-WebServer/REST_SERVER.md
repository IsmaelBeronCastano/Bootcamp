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

- Importo http en app.ts

~~~js
import http from 'http'

const server = http.createServer((req,res)=>{
    console.log(req.url)
})


server.listen(8080, ()=>{
    console.log('Server is listening on port 8080')
})
~~~

- Si me conecto al localhost 8080 desde el navegador, cualquier dirección a la que vaya se verá en la consola

~~~js
import http from 'http'

const server = http.createServer((req,res)=>{
    console.log(req.url)
    res.write("hola mundo!") //imprime en pantalla hola mundo!
    res.end()
})


server.listen(8080, ()=>{
    console.log('Server is listening on port 8080')
})
~~~
------

## Diferentes respuestas

- Puedes escribit el codigo de respuesta con res.writeHead()

~~~js
res.writeHead(404)
~~~

- Esto sería server side rendering

~~~js
import http from 'http'

const server = http.createServer((req,res)=>{
    console.log(req.url)

    res.write("hola mundo!")
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write(`<h1>URL ${req.url}</h1>`)
    res.end()
})


server.listen(8080, ()=>{
    console.log('Server is listening on port 8080')
})
~~~

- Puedo renderizar JSON

~~~js
import http from 'http'

const server = http.createServer((req,res)=>{
    console.log(req.url)

    // res.write("hola mundo!")
    // res.writeHead(200, {'Content-Type': 'text/html'})
    // res.write(`<h1>URL ${req.url}</h1>`)

    const data = {name: "Mili Vanili", age: 25}
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(data))
})


server.listen(8080, ()=>{
    console.log('Server is listening on port 8080')
})
~~~

- Creo la carpeta public/index.html
- Psara renderizar el index en /

~~~js
import http from 'http'
import fs from 'fs'

const server = http.createServer((req,res)=>{
    
    if(req.url === '/'){
        const htmlFile= fs.readFileSync('./public/index.html', 'utf-8')
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(htmlFile)
    }else{
        res.writeHead(404)
    }
})


server.listen(8080, ()=>{
    console.log('Server is listening on port 8080')
})
~~~

- Si coloco una hoja de estilos CSS y un script de JS en el HTML el servidor no los encuentra **porque no los estoy sirviendo**
-----

## Responder demás archivos

- Para servir lso archivos en / (tengo index.css e index.js en la carpeta public)

~~~js
import http from 'http'
import fs from 'fs'

const server = http.createServer((req,res)=>{

    if(req.url === '/'){
        const htmlFile= fs.readFileSync('./public/index.html', 'utf-8')
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(htmlFile)
        return
    }

    if(req.url?.endsWith('.js')){
        res.writeHead(200, {'Content-Type': 'application/javascript'})
    }else if(req.url?.endsWith('.css')){
        res.writeHead(200, {'Content-Type': 'text/css'})
    }

    const responseContent= fs.readFileSync(`./public${req.url}`, 'utf-8') //habria que comprobar si existe el archivo
    res.end(responseContent)
})


server.listen(8080, ()=>{
    console.log('Server is listening on port 8080')
})
~~~
- Esta manera de trabajar es muy tediosa.
- Con **Express** es más sencillo
---------

## Http2 OpenSSL

- Clono app.ts y a la copia le pongo app.http.ts
- Renombro http por http2
- Solo con esto no va a funcionar
- No hay navegadores que soporten http2 con servidores no seguros
- Hay que usar .createSecureServer (con las opciones key y certificado) y configurar https
- Para generar el key y el certificado en windows
  - Powershell > openssl (no lo reconoce)
- Si esta instalado Git esta instalado pero hay que actualizar las variables de entorno
- Buscar en Windows env
- Editaremos Path
- Buscar la ruta Program Files/ Git/ usr /bin / openssl
- Copiar ruta en las variables de entorno, en Path 
- Cerrar y volver a abrir la powershell
- Ahora usar este comando

> openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt

- Rellenar la info
- Tengo la key y el certificado server.crt y server.key, los m,eto dentro de la carpeta keys en la raiz
- Ahora hay que añadirlos a las opciones de createSecureServer
- Si intento conectarme a localhost:8080 me dice que la conexion no es segura porque el certificado no es valido
- Advanced/proceed
- Si da error con favicon.ico, créalo o usa un try catch
~~~js
import http2 from 'http2'
import fs from 'fs'

const server = http2.createSecureServer({
    key:fs.readFileSync('./keys/server.key'),
    cert:fs.readFileSync('./keys/server.crt')
}, (req,res)=>{
    
    if(req.url === '/'){
        const htmlFile= fs.readFileSync('./public/index.html', 'utf-8')
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(htmlFile)
        return
    }

    if(req.url?.endsWith('.js')){
        res.writeHead(200, {'Content-Type': 'application/javascript'})
    }else if(req.url?.endsWith('.css')){
        res.writeHead(200, {'Content-Type': 'text/css'})
    }

    const responseContent= fs.readFileSync(`./public${req.url}`, 'utf-8')
    res.end(responseContent)
})


server.listen(8080, ()=>{
    console.log('Server is listening on port 8080')
})
~~~
------

## Usemos Express

- 

- 

