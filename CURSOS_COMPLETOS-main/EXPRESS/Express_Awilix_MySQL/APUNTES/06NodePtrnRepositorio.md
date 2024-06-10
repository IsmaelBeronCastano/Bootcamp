# NODE Patron Repositorio Typescript - APIauth

- Vamos a gestionarlo mediante usuario y contraseña con JWT
- Flujo de trabajo:
  - El usuario va intentar autenticarse
  - Si este es válido genera un JWT con cierta info (el user_id, el correo, info estática)
  - Con el token, cada request que realiza a APIwallet se va a enviar en el header
  - Si este es válido va a poder acceder
  - Si no arrojará un 401

- La tabla de auth_user contiene
  
~~~js
id: Number, //primary key auto increment not null
email: VARCHAR , // not null
password: VARCHAR,// not null
created_at: DATE,// not null
updated_at: DATE,
~~~

- Aqui está el script

~~~js
CREATE TABLE `kodotiwallet`.`auth_user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `created_at` DATE NOT NULL,
  `updated_at` DATE NULL,
  PRIMARY KEY (`id`));
~~~
------

## Registro de usuarios

- Creo la misma estructura de directorios para APIauth
- Hago las instalaciones pertinentes (mirar el package.json) **NOTA**: @types/mysql  (sin el 2)
- Creo el .gitignore con node_modules/
- Creo el tsconfig y copio la configuración del proyecto de APIwallet
- **En este caso no va a haber repositorio, se hará todo en la capa de servicio**
- No lo voy a hacer en orden, pero detallo los pasos:
- Creo en /common/dtos el dto de createUser con email y password para usarlo en el servicio
- Creo los archivos .env development, production, stagging en la carpeta config
- En /persistence/mysql.persistence.ts creo el pool con las variables de entorno ( que en este caso las pongo en duro) para hacer la conexión con la db
- Creo en /common/controllers el base.controller.ts para crear la clase abstracta y manejar errores con el método handleException
- Creo en /common/exception/application.exception.ts la excepción para manejar ApplicationException que extiende de Error
- Creo el identity.service (clase vacía de momento)
- Creo el identity.controller (case vacía de momento)
- Faltan app.ts, server.ts y container.ts
- app.ts

~~~js
import express from 'express'
import dotenv from 'dotenv'
import loadContainer  from './container'
import { loadControllers } from 'awilix-express'


process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.APP_ENV = process.env.APP_ENV || 'development'

dotenv.config({
    path: `${__dirname}/../config/${process.env.APP_ENV}.env` //no funciona!!! Pongo las variables de entorno en duro en el pool
})                                                             




export const app: express.Application = express()


app.use(express.json())

//exportación por defecto del container
loadContainer(app)

//cargo los controladores
app.use(loadControllers(
    'controllers/*.ts', 
    {cwd: __dirname}
))
~~~

- server.ts

~~~js
import { app } from "./app";


app.listen(5000, ()=>{
    console.log("Servidor corriendo en puerto 5000")
})
~~~

- container.ts

~~~js
import express from 'express'
import {createContainer, asClass} from 'awilix'
import { scopePerRequest } from 'awilix-express';
import { IdentityService } from './services/identity.service';

export default (app: express.Application)=>{
    
    const container = createContainer({
        injectionMode: 'CLASSIC'
    })
    
   
    container.register({
      //le añado el servicio
    identityService: asClass(IdentityService).scoped()

    })

   
    app.use(scopePerRequest(container))

}
~~~
- Copio el script de start del package.json de APIwallet 

> "start": "ts-node-dev --respawn --transpile-only src/server.ts"

-----------

## Registro de usuarios

- Empiezo por el método crear user
- Para encriptar el password usaré sha.js

> npm i sha.js @types/sha.js

~~~js
import connection from '../common/persistence/mysql.persistence'
import { createUserDto } from "../common/dtos/identity.dto"
import SHA from 'sha.js'

export class IdentityService{
    

    async create(user: createUserDto): Promise<void>{
        
        //HASH password---> el algoritmo de encriptación, la cadena a encriptar y cómo quieres que sea retornada
        user.password = SHA('sha256').update(user.password).digest('base64')

        await connection.execute(
            'INSERT INTO auth_user(email, password, created_at) VALUES(?,?,?)',
            [user.email, user.password, new Date() ]
        )
    }
}
~~~

- En el controller

~~~js
import { POST, route } from "awilix-express";
import { Request, Response } from "express";
import { BaseController } from "../common/controllers/base.controller";
import { IdentityService } from "../services/identity.service";
import { createUserDto } from "../common/dtos/identity.dto";

@route('/auth')
export class IdentityController extends BaseController{
    constructor(private identityService: IdentityService){
        super()
    }

    
    @route('/create')
    @POST()
    async create(req: Request, res: Response){
        try {
            await this.identityService.create({
                email: req.body.email,
                password: req.body.password
            } as createUserDto)

            res.status(201)
            res.send()

            
        } catch (error) {
            this.handleException(error, res)
        }
    }

}
~~~

- Compruebo que todo esté bien con POSTMAN/ThunderClient

> http://localhost:5000/auth/create     (método POST, añado en el body email y password como strings)
------

## Generación de Token

- Creo el método authenticate en el IdentityService
- Instalo jsonwebtoken ( y los tipos )

> npm i jsonwebtoken
> npm i -D @types/jsonwebtoken


~~~js
 async authenticate(email: string, password: string): Promise<string>{

        //encripto el password
        password= SHA('sha256').update(password).digest('base64')

        const [rows]: any[]= await connection.execute(
            'SELECT * FROM auth_user WHERE email=? AND password = ?',
            [email, password]
        )
                                //pongo la variable de entorno como string porque si no no la lee! PERO NO IRIA COMO STRING
        const secretKey: string = "process.env.jwt_secret_key" //tendría que hacer una validación de que le llega la variable de entorno

        //si encuentra un registro genero el token
        if(rows.length){
             return jwt.sign({     //le paso el payload(quiero pasarle el id y el email)
                id: rows[0].id,
                email: rows[0].email
             }, secretKey,{
                expiresIn: '7h'   //cómo tercer parámetro le paso cuanto quiero que dure el token (7 horas)
             })
        }

        //Lanzo una ApplicationException porque ha sido error del usuario ( ha pasado mal sus credenciales)
        throw new ApplicationException("Invalid user credential supplied")
    }
~~~

- El controlador de authenticate

~~~js
    @route('/authenticate')
    @POST()
    async authenticate(req: Request, res: Response){
        try {

            const result = await this.identityService.authenticate(
                req.body.email, req.body.password
            )

            res.send(result)
            
        } catch (error) {
            this.handleException(error, res)            
        }
    }
~~~

- Si hago el POST a http://localhost:5000/auth/authenticate en ThunderClient me devuelve el token como respuesta
- El token contiene el id, el email, la fecha en que fue generado, y la fecha de expiración
- **TIP** puedes convertir a milisegundos y pasarselo a new Date para saber la fecha de expiración

> new Date(654654654 * 1000)  //devuelve fecha de expiración en formato fecha
-----

## Proteger la APIwallet de acceso no autorizado

- Instalo express-jwt, paquete que permite implementar facilmente la autorización a través de jwt

> npm i express-jwt
> npm i -D @types/express-jwt

- Se debe adjuntar el middleware en la ruta
- Vamos a hacerlo de manera global, porque quiero que toda mi app esté securizada
- Vamos al app.ts (donde definimos comportamiento)
- La validación hay que hacerla antes de cargar los controladores

~~~js
import express from 'express'
import dotenv from 'dotenv'
import loadContainer  from './container'
import { loadControllers } from 'awilix-express'
import {expressjwt} from 'express-jwt'


process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.APP_ENV = process.env.APP_ENV || 'development'

dotenv.config({
    path: `${__dirname}/../config/${process.env.APP_ENV}.env` //no funciona, a veces detecta el __dirname, a veces no
})                                                            //he colocado las variables de entorno en duro ya que no las encuentra 




export const app: express.Application = express()

//Habilito a express leer JSON
app.use(express.json())

//debo cargar el container antes de usar los controladores
loadContainer(app)


//JWT

app.use(expressjwt({ //necesita el secretKey
    secret: "process.env.jwt_secret_key",
    requestProperty: 'auth', //configuro para poder acceder a la info del token en req.auth
    algorithms: ['HS256'] //hay que pasarle el algoritmo que se usó para encriptar el token

    //para desproteger ciertas rutas uso .unless
}).unless({path: ['/', '/check']}))


//para usar los controladores
app.use(loadControllers(
    'controllers/*.ts', 
    {cwd: __dirname} //le indico en el objeto cual es la ruta donde debe empezar a buscar, es decirle /src
))
~~~

- El token hay que pasarlo en los headers Authorization/Bearer Token
- Si le hago un GET a http://localhost:3000/movement con el token en los headers me devuelve los movimientos
- Sin el token lanza error Invalid token
- Para acceder a la info del token está en req.auth
- Hago una prueba en el check.controller

~~~js
import {route, GET} from 'awilix-express'
import { Request, Response } from 'express'
import { TestService } from '../services/test.service'

@route('/check')
export class CheckController{
    constructor(private readonly testService: TestService){

    }
    @GET()
    public index(req: Request, res:Response): void{
        res.send({
            NODE_ENV: process.env.NODE_ENV,
            APP_ENV: process.env.APP_ENV
        })
    }

    @route('/test')
    @GET()
    public test(req: Request, res:Response): void{
        
        res.send(this.testService.get())
    }

    @route('/user-payload')
    @GET()
    public userPayload(req: Request, res: Response): void{
        //Typescript dice que req.user no existe porque está agregada dinamicamente por el middleware de express-jwt
        //Una opción es habilitar que Typescript acepte valores any, otra es castearlo
            res.send((req as any).user) 
    }
}
~~~
-----

## Habilitar CORS

- Lo habilito en app.ts con un midlleware
- Instalo con npm i cors y los types
- Uso app.use

~~~js
import express from 'express'
import dotenv from 'dotenv'
import loadContainer  from './container'
import { loadControllers } from 'awilix-express'
import {expressjwt} from 'express-jwt'
import cors from 'cors'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.APP_ENV = process.env.APP_ENV || 'development'

dotenv.config({
    path: `${__dirname}/../config/${process.env.APP_ENV}.env` //no funciona, a veces detecta el __dirname, a veces no
})                                                            //he colocado las variables de entorno en duro ya que no las encuentra 




export const app: express.Application = express()

//Habilito cors
app.use(cors())
//Habilito a express leer JSON
app.use(express.json())

//debo cargar el container antes de usar los controladores
loadContainer(app)


//JWT

app.use(expressjwt({ //necesita el secretKey
    secret: "process.env.jwt_secret_key",
    requestProperty: 'auth',
    algorithms: ['HS256'] //hay que pasarle el algoritmo que se usó para encriptar el token

}).unless({path: ['/', 'check']}))


//para usar los controladores
app.use(loadControllers(
    'controllers/*.ts', 
    {cwd: __dirname} //le indico en el objeto cual es la ruta donde debe empezar a buscar, es decirle /src
))
~~~


