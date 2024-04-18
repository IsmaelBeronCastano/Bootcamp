# NODE TS Autenticacion

- Plantilla node configurado con typescript

> https://github.com/Klerith/node-ts-express-shell 

> npm i

- Usaremos mongo
- En docker-compose descomento el primer bloque
- Compongo la db

> docker compose up -d

- En .env coloco el puerto, PORT=3000 

- Con npm run dev corro la aplicación, en localhost:3000 en el navegador debo ver el mensaje "Tu eres increíble" 
- *NOTA* ya tenemos la configuración del server básica hecha
-----

## Módulo Auth - Rutas y controladores

- Creo presentation/auth/controller.ts y routes.ts
- El controlador solo da la respuesta al cliente
- Para las rutas puedo copiar lo que tengo en el archivo de routes y modificarlo

~~~js
import { Router } from 'express';

export class AuthRoutes {


  static get routes(): Router {

    const router = Router();
    
   router.post('/login') //falta añadir el controlador
   router.post('/register')
   router.get('/validate-email/:token')

    return router;
  }
}
~~~

- Para usarlo en AppRoutes

~~~js
import { Router } from 'express';
import { AuthRoutes } from './auth/routes';


export class AppRoutes {

  static get routes(): Router {

    const router = Router();
    
    router.use('/api/auth', AuthRoutes.routes)

    return router;
  }
}
~~~

- El controlador no va a ser más que una clase que me permita hacer inyección de dependencias

~~~js
import { Request, Response } from "express"

export class AuthController{

    constructor(){

    }

    registerUser=(req:Request,res:Response)=>{
        res.json('registerUser')
    }
    
    loginUser=(req:Request,res:Response)=>{
        res.json('loginUser')
    }
    
    validateEmail=(req:Request,res:Response)=>{
        res.json('validateEmail')
    }
}
~~~

- Los coloco en las rutas. En AuthRoutes creo una instancia del controlador

~~~js
import { Router } from 'express';
import { AuthController } from './controller';

export class AuthRoutes {

  static get routes(): Router {
    const router = Router();
    const controller = new AuthController();
    
   router.post('/login', controller.loginUser)
   router.post('/register', controller.registerUser)
   router.get('/validate-email/:token', controller.validateEmail)

    return router;
  }
}
~~~
----

## Conectar MongoDB

- Creo src/data/mongo/mongo-connection.ts
- Instalo mongoose

> npm i mongoose

~~~js
import mongoose from "mongoose"

interface connectionOptions{
    mongoUrl: string
    dbName: string
}

export class MongoDBConnection{
    
    static async connect(options: connectionOptions){
        const {mongoUrl, dbName} = options

        try {
            await mongoose.connect(mongoUrl, {
                dbName
            })
            console.log('Mongo connected')
            return true
        
        } catch (error) {
            console.log('Mongo connection error')
            throw error
        }

    }
}
~~~-

- Debo definir mongoUrl y dbName en las .env

~~~
PORT=3000

MONGO_STRING=mongodb://mongo-user:123456@localhost:27017
MONGO_DB_NAME=mystore
~~~

- Coloco las variables de entorno en src/config/envs.ts

~~~js
import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  MONGO_STRING: get('MONGO_STRING').required().asString(),
  MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),

}
~~~

- Para usarlas en MongoDbConnection en el main de app.ts

~~~js
import { envs } from './config/envs';
import { MongoDBConnection } from './data/mongo/mongo-connection';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';


(async()=> {
  main();
})();


async function main() {

  await MongoDBConnection.connect({
    mongoUrl: envs.MONGO_STRING,
    dbName: envs.MONGO_DB_NAME

  })

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}
~~~

- *NOTA* En gitignore el / de mongo y progres es al inicio
- Ahora hay que hacer el modelo!
--------

## User Model

- Creo /data/mongo/models/user.model.ts

~~~js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({


    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    emailvalidated:{
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role:{
        type: [String],
        enum: ['ADMIN_ROLE', 'USER_ROLE'],
        default: 'USER_ROLE'
    },
    img:{
        type: String
    }
})


export const UserModel = mongoose.model('User', userSchema)
~~~

- Coloco el modelo el archivo de barril de /data

~~~js
export * from './mongo/mongo-connection'
export * from './mongo/models/user.model'
~~~
------

## Custom Error

- Creo domain/errors/cutom.error.ts
- Hago el método privado para que solo sean los métodos estáticos quienes creen y presenten el CustomError

~~~js
export class CustomError extends Error{
    private constructor(
        public readonly statusCode: number,
        public readonly message: string
    ){
        super(message)
    }

    static badRequest(message: string): CustomError {
        return new CustomError(400, message)
    }
}
~~~

- Creo los otros

~~~js
export class CustomError extends Error{
   private constructor(
        public readonly statusCode: number,
        public readonly message: string
    ){
        super(message)
    }

    static badRequest(message: string): CustomError {
        return new CustomError(400, message)
    }

    static unauthorized(message: string): CustomError {
        return new CustomError(401, message)
    }
    static forbidden(message: string): CustomError {
        return new CustomError(404, message)
    }
    static internalServer(message: string): CustomError {
        return new CustomError(500, message)
    }
}
~~~

- Creo un archivo de barril para exportar los errores en /domain

~~~js
export * from './errors/custom.error'
~~~
------

- Creemos la entidad de Usuario en domain/entities para que rija mi DB
-----

## User Entity

- Yo no quiero regresar un modelo de mongoose, porque si algo cambia, y no uso mongoose es una dependencia fuerte que debo resolver
- Si pones una propiedad opcional en el constructor debe ir al final

~~~js
import { CustomError } from "../../errors/custom.error"

export class UserEntity{
    constructor(
        public id:string,
        public name: string,
        public email: string,
        public emailValidated: boolean,
        public password: string,
        public role: string[],
        public img?: string,
        
    ){}

    static fromObject(obj:{[key:string]:any}): UserEntity{
        
        const {id, _id, name, email, emailValidated, password, role, img} = obj
        
        if(!id && !_id) throw CustomError.badRequest('Missing id')
        if(!name) throw CustomError.badRequest('Missing name')
        if(!email) throw CustomError.badRequest('Missing email')
        if(emailValidated=== undefined) throw CustomError.badRequest('Missing emailValidated')
        if(!password) throw CustomError.badRequest('Missing password')
        if(!role) throw CustomError.badRequest('Missing role')     
            
        //hay que ponerlo en el mismo orden que el constructor
        return new UserEntity(
            id || _id,
            name,
            email,
            password,
            role,
            emailValidated,
            img
        )
    }
}
~~~
-----

## RegisterUserDto

- Creo el DTO en domain/dtos/auth/register-user.dto con la información que espero que me manden para registrar un usuario
- Espero name, email y password
- Hay que validar que sea un email válido. Coloco la expresión regular en config/regular-exp.ts

~~~js
export const regularExps = {

  // email
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,

}
~~~

- El dto

~~~js
import { regularExps } from "../../../config/regular-exp";

export class RegisterUserDto{
    constructor(
        public name: string,
        public email: string,
        public password: string 
    ){}

    static create(object:{[key:string]: any}): [string?, RegisterUserDto?]{
        const {name, email, password} = object;
        if(!name || !email || !password){
            return ['Invalid input', undefined];
        }

        if(!regularExps.email.test(email)) return ['Invalid email', undefined]
        if(password.length < 6) return ['Password must be at least 6 characters', undefined]
        
        return [undefined, new RegisterUserDto(name, email, password)];

    }
}
~~~
-----

## AuthService

- Creo presentation/services/auth.service.ts

~~~js
import { UserModel } from "../../data";
import { CustomError } from "../../domain";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";

export class AuthService{
    constructor(){

    }

    public async registerUser(registerUserDto: RegisterUserDto){

        const existUser = await UserModel.findOne({email: registerUserDto.email});
        if(existUser) throw CustomError.badRequest('User already exists');

        return 'todo ok!'
    }
}
~~~

- Para inyectar el servicio en el controller puedo hacer un singleton para que solo haya una instancia del servicio
- O puedo crear la instancia en el controller dentro del mismo constructor

~~~js
export class AuthController{

    constructor(
        public readonly authService: AuthService = new AuthService()
    ){

    }
}
~~~

- O puedo instanciarla en /auth/routes que es dónde lo voy a usar 

~~~js
import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../services/auth.service';


export class AuthRoutes {


  static get routes(): Router {
    const router = Router();
    const authService = new AuthService()
    const controller = new AuthController(authService);
    
   router.post('/login', controller.loginUser)
   router.post('/register', controller.registerUser)
   router.get('/validate-email/:token', controller.validateEmail)



    return router;
  }

}
~~~

- Hago uso del servicio

~~~js
export class AuthController{

    constructor(
        public readonly authService: AuthService
    ){

    }

    registerUser=(req:Request,res:Response)=>{
        const [error, registerUserDto] = RegisterUserDto.create(req.body);
        if(error) return res.status(400).json({error});

        this.authService.registerUser(registerUserDto!)
            .then((user)=>res.json(user))
            .catch((error)=>res.status(400).json({error}))
        
    }
}
~~~
-----

## Crear usuario y manejo de errores

- El controlador delega en el servicio la creación del usuario
- auth.service

~~~js
import { UserModel } from "../../data";
import { CustomError } from "../../domain";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";

export class AuthService{
    constructor(){

    }

    public async registerUser(registerUserDto: RegisterUserDto){

        const existUser = await UserModel.findOne({email: registerUserDto.email});
        if(existUser) throw CustomError.badRequest('User already exists');

        try {
            const user = new UserModel(registerUserDto);
            await user.save();

            return user
            
        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

        return 'todo ok!'
    }
}
~~~

- Si lo hago asi, el return user me regresa el password sin encriptar y el _id
- Vamos a manejar el error del servicio en el AuthController

~~~js
private handleError = (error:unknown, res: Response)=>{
    if(error instanceof Error){
        return res.status(400).json({error: error.message})
    }
    res.status(500).json({error: 'Internal Server Error'})
}

registerUser=(req:Request,res:Response)=>{
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if(error) return res.status(400).json({error});

    this.authService.registerUser(registerUserDto!)
        .then((user)=>res.json(user))
        .catch((error)=>this.handleError(error, res))
    
}
~~~

- Creamos un usuario correctamente, nos conectamos con mongoCompass para comprobar que todo esté bien
- No quiero regresar el password, ni el _id, ni __v
- Podría coger el objeto en AuthService y crear con mi entidad para que se encargue de validar todo

------
- *NOTA*: si no tienes configurada la autenticación en MONGO deberás crear un usuario y habilitarla. Si tienes corriendo el servicio de mongod y docker a la vez, es posible que MongoCompass no te muestre la db
-----

~~~js
public async registerUser(registerUserDto: RegisterUserDto){

    const existUser = await UserModel.findOne({email: registerUserDto.email});
    if(existUser) throw CustomError.badRequest('User already exists');

    try {
        const user = new UserModel(registerUserDto);
        await user.save();

        const {password, ...rest} = UserEntity.fromObject(user) //no quiero retornar el password

        return {user: rest, token: 'ABC'}
        

        
    } catch (error) {
        throw CustomError.internalServer(`${error}`)
    }

    
}
~~~
- También podría inyectar el repositorio en el servicio para hacerlo más sostenible
------

## Encriptar contraseñas

- Usemos bcrypt.js y el patrón adaptador
- En srx/config/bcrypt.adapter.ts. Bien podría hacerlo con métodos estáticos de una clase

~~~js
import {compareSync, genSaltSync, hashSync} from 'bcryptjs'


export const bcryptAdapter= {
    hash: (password:string)=>{
        const salt = genSaltSync()
        return hashSync(password,salt) 
    },
    compare: (password: string, hashed: string)=>{
        return compareSync(password,hashed)
    }
}
~~~

- Encripto el password

~~~js
public async registerUser(registerUserDto: RegisterUserDto){

    const existUser = await UserModel.findOne({email: registerUserDto.email});
    if(existUser) throw CustomError.badRequest('User already exists');

    try {
        const user = new UserModel(registerUserDto);

        user.password = bcryptAdapter.hash(registerUserDto.password) //encripto el password antes de guardar

        await user.save();

        const {password, ...rest} = UserEntity.fromObject(user)
        return {user: rest, token: 'ABC'}
        
    } catch (error) {
        throw CustomError.internalServer(`${error}`)
    }   
}
~~~
-------

- Hagamos el login y luego evaluemos el mail de confirmación con el token
-----

## Login de usuario

- LoginUserDto

~~~js
import { regularExps } from "../../../config/regular-exp"

export class LoginUserDto{
    constructor(
        public readonly email: string,
        public readonly password: string
    ){}

    static create(object:{[key:string]:any}):[string?, LoginUserDto?] {
        const {email, password} = object

        if(!email) return ['Email is required', undefined]
        if(!regularExps.email.test(email)) return ['Invalid email', undefined]
        if(!password) return ['Password is required', undefined]
        if(password.length >6) return ['Password too short']

        return [undefined, new LoginUserDto(email, password)]
    }
}
~~~

- AuthController

~~~js
import { regularExps } from "../../../config/regular-exp"

interface Options{
    email: string | null
    password: string | null
}


export class LoginUserDto{
    constructor(options:Options){}

    static create(options:{[key:string]:any}):[string?, LoginUserDto?] {
        const {email, password}= options

        if(!email) return ['Email is required', undefined]
        if(!regularExps.email.test(email)) return ['Invalid email', undefined]
        if(!password) return ['Password is required', undefined]
        if(password.length >6) return ['Password too short']

        return [undefined, new LoginUserDto({email, password})]
    }
}
~~~

- AuthService

~~~js
public async loginUser(loginUserDto: LoginUserDto){
    const user = await UserModel.findOne({email:loginUserDto.email })

    if(!user) throw CustomError.badRequest("User don't exists!")

    const hashMatch = bcryptAdapter.compare(loginUserDto.password, user.password)

    if(!hashMatch) throw CustomError.unauthorized("Password is not valid")
    
    const {password, ...userEntity} = UserEntity.fromObject(user)

    return {
        user: userEntity,
        token: 'ABC'
    }
}
~~~


