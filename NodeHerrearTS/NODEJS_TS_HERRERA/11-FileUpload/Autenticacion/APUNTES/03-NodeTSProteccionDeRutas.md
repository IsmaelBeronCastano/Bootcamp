# Node TS Protecciónde rutas, middlewares y relaciones


- Creo una variable en false para evitar seguir mandando correos electrónicos (eso ya lo probamos)

~~~
SEND_EMAIL=false
~~~

- La configuro en envs.ts
- Le pongo false por defecto. Las variables de entorno siempre tienen que ser strings

~~~js
SEND_EMAIL: get('SEND_EMAIL').default('false').asBool()
~~~

- Creo una nueva propiedad en el EmailService
- Uso la forma corta con private readonly en el constructor

~~~js
import nodemailer, { Transporter } from 'nodemailer'



interface SendEmailOptions{
    to: string | string[]
    subject: string
    htmlBody: string
    attachments?: Attachment[]
}

interface Attachment{
    filename?: string
    path?: string
}

export class EmailService{
    
    private transporter: Transporter;

    constructor(
        mailerService: string,
        mailerEmail: string,
        senderEmailPassword: string,
        private readonly postToProvider: boolean //añado la propiedad
    ){  
        this.transporter= nodemailer.createTransport({
            service: mailerService,
            auth:{
                user: mailerEmail,
                pass: senderEmailPassword
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    async sendEmail(options: SendEmailOptions): Promise<boolean>{

        const {to, subject,htmlBody, attachments=[]} = options

            try {

                    if(!this.postToProvider) return true //retorno true simulando el envio de correo

                const sentInformation = await this.transporter.sendMail({
                    to,
                    subject,
                    html: htmlBody,
                    attachments
                })

                console.log(sentInformation)
                return true
            } catch (error) {
                console.log(error)
                return false
            }
    }
}
~~~

- En AuthRoutes le paso la variable de entorno a la instancia de EmailService 

~~~js

export class AuthRoutes {


  static get routes(): Router {
    const router = Router();

    const emailService = new EmailService(envs.MAILER_SERVICE,envs.MAILER_EMAIL,envs.MAILER_SECRET_KEY, envs.SEND_EMAIL)
    const authService = new AuthService(emailService)
    const controller = new AuthController(authService);
    
   router.post('/login', controller.loginUser)
   router.post('/register', controller.registerUser)
   router.get('/validate-email/:token', controller.validateEmail)

    return router;
  }
}
~~~
----

## Preparación de los modelos restantes

- Vamos a usar el token cuando alguna persona quiera crearse algo
- Cual es la diferencia entre el modelo y la entidad?
  - El modelo está amarrado a la base de datos
- Creo category.model
- La categtoría estará asociada a un usuario
- Creo la relación
- En la referencia pongo el nombre que le puse como primer parámetro en la creación del modelo
  - mongoose.model("**Este_nombre**", Schema)

~~~js
import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required']
    },
    available:{
        type: Boolean,
        default: true
    },

    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

})


export const CategoryModel = mongoose.model('Category', categorySchema)
~~~

- Creo también el modelo de producto
- Si no indico que la propiedad es requerida y no le pongo ningún valor por defecto, ni aparecerá en el documento
  - La hace opcional automáticamente

~~~js
import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required']
    },
    available:{
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        default: 0
    },
    description:{
        type: String

    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }

})


export const ProductModel = mongoose.model('Product', productSchema)
~~~
------

## Category - Rutas y Controlador

- De momento, si no existe la ruta devuelve lo que hay en la carpeta pública
- Creo presentation/categories/routes.ts, controller.ts y services/categories.service.ts
- La ruta llama al controlador que maneja las rutas, este llama al servicio dónde tengo toda mi lógica e interactúo con la db
- Básicamente copio lo que hay en AppRoutes y lo modifico
- Lo mismo con el controlador

~~~js
import { Request, Response } from "express"
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { AuthService } from "../services/auth.service";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";

export class CategoryController{

    constructor(
        
    ){}

    private handleError = (error:unknown, res: Response)=>{
        if(error instanceof Error){
            return res.status(400).json({error: error.message})
        }
        res.status(500).json({error: 'Internal Server Error'})
    }

    public getCategories(){

    }

    public createCategory(){
        
    } 
}
~~~

- En las rutas

~~~js
import { Router } from 'express';
import { CategoryController } from './controller';
import { getEnabledCategories } from 'trace_events';


export class CategoryRoutes {


  static get routes(): Router {
    const categoryController = new CategoryController()
    const router = Router();
    
    router.get('/', categoryController.getCategories)
    router.post('/', categoryController.createCategory)

    return router;
  }
}
~~~

- Añado el router en AppRoutes

~~~js
import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { CategoryRoutes } from './categories/routes';


export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    router.use('/api/auth', AuthRoutes.routes)
    router.use('/api/categories', CategoryRoutes.routes)

    return router;
  }
}
~~~
----

## CreateCategoryDTO

- Necesito mandar el usuario pero vamos a obviarlo por ahora

~~~js
export class CategoryDto{
   private constructor(
       public readonly name: string,
       public readonly avaliable: boolean
    ){}

    static create(object: {[key:string]:any}):[string?, CategoryDto?] {

        const {name, avaliable}=object
        if(!name) return [`Name ${name} don't exists`, undefined]
        let avaliableBoolean= avaliable
        if(typeof avaliable !== 'boolean'){
            avaliableBoolean = (avaliable === true)
        }

        return [undefined, new CategoryDto(name, avaliableBoolean)]
    }
}
~~~

- Usémoslo en el controller 
- presentation/categories/controller.ts

~~~js
public createCategory(req:Request, res: Response){
    const [error, categoryDto] = CategoryDto.create(req.body)
    if(error) return res.status(400).json({error})

    res.json(categoryDto)
}
~~~
------

## Auth Middleware - proteger rutas

- Cómo obtengo el usuario?
- Cuando hacemos un login, el token que se crea solo tiene el id del usuario
- Hay que tomar el token y mandarlo mediante los headers
- Seleccionamos Bearer Token en POSTMAN o similares y pego el token del login
- El middleware no es una regla de negocio, va en la capa de presentación
- El token está en la Response, en header Authorization
- Le añado el tipado genérico a valideateToken jwt.adapter
- Puede retornar un genérico o null
- Le digo que trate el decoded de tipo genérico

~~~js
static validateToken<T>(token:string): Promise<T | null>{
    return new Promise(resolve=>{
        jwt.verify(token, JWT_SEED, (err, decoded)=>{
            if(err) return resolve(null)
            resolve(decoded as T)
        })
    })
~~~

- Después de hacer las validaciones y encontrar el usuario, lo paso al req.body
- Quiero que este user sea una instancia de mi entidad, para que no esté amarrado a la db y a mongoose
- Uso fromObject de UserEntity
- presentation/middlewares/auth.middleware.ts

~~~js
import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/jwt.adqapter";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain/entities/user/user.entity";

export class AuthMiddleware{
 
    static async validateJWT(req:Request,res:Response,next: NextFunction ){
        const authorization= req.header('Authorization')

        if(!authorization) return res.status(401).json({error:"No token provider"})

        if(!authorization.startsWith('Bearer ')) return res.status(401).json({error: "Invalid Bearer Token"})

        const token = authorization.split(' ').at(1)  || ""//es lo mismo que poner [1]
        
        try {
            const payload = await JwtAdapter.validateToken<{id:string}>(token)
            if(!payload) return res.status(401).json({error: "Invalid Token"})

            const user = await UserModel.findById(payload.id)
            if(!user) return res.status(401).json({error:"Invalid Token- user"})
            
            //todo: validar si el usuario está activo
            req.body.user = UserEntity.fromObject(user)

            next()
            
        } catch (error) {
            res.status(500).json({error:"Internal Server error"})
        }

    }
}
~~~
------

## Probar AuthMiddleware

- Como solo debo aplicarlo al posteo de categoria voy al CategoryRoute
- Para colocar el middleware lo pongo como segundo argumento. Si hay varios puedo colocarlos en un arreglo

~~~js
import { Router } from 'express';
import { CategoryController } from './controller';
import { getEnabledCategories } from 'trace_events';
import { AuthMiddleware } from '../middlewares/auth.middleware';


export class CategoryRoutes {


  static get routes(): Router {
    const categoryController = new CategoryController()
    const router = Router();
    
    router.get('/', categoryController.getCategories)
    router.post('/', [AuthMiddleware.validateJWT], categoryController.createCategory)

    return router;
  }
}
~~~

- El usuario lo tengo en el req.body
- Creo el CategoryService

~~~js
import { CategoryModel } from "../../data/mongo";
import { CustomError } from "../../domain";
import { CategoryDto } from "../../domain/dtos/auth/categories/category.dto";
import { UserEntity } from "../../domain/entities/user/user.entity";

export class CategoryService{


    constructor(){}

    async createCategory(categoryDto:CategoryDto, user:UserEntity){
        const categoryExists = await CategoryModel.findOne({name: categoryDto.name})
        if(categoryExists) throw CustomError.badRequest("Category exists")

            try {
                const category= new CategoryModel({
                    ...categoryDto,
                    user: user.id
                })

                await category.save()

                return {
                    id: category.id,
                    name: category.name,
                    available: category.available
                }
                
            } catch (error) {
                throw CustomError.internalServer(`${error}`)
            }
    }
}
~~~

- En el controlador necesito usar el servicio. Debo inyectarlo

~~~js
import { Request, Response } from "express"
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { AuthService } from "../services/auth.service";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { CategoryDto } from "../../domain/dtos/auth/categories/category.dto";
import { CustomError } from "../../domain";
import { CategoryService } from "../services/category.service";

export class CategoryController{

    constructor(
        private readonly categoryService: CategoryService
        
    ){}

    private handleError = (error:unknown, res: Response)=>{
        if(error instanceof Error){
            return res.status(400).json({error: error.message})
        }
        res.status(500).json({error: 'Internal Server Error'})
    }

    public getCategories(){

    }

    public createCategory=(req:Request, res: Response)=>{
        const [error, categoryDto] = CategoryDto.create(req.body)
        if(error) return res.status(400).json({error})

        this.categoryService.createCategory(categoryDto!, req.body.user)
            .then(category =>res.json(category))
            .catch(error=>res.json(`${error}`))
    }   
}
~~~

- Debo pasarle una instancia del servicio a la instancia del controller en routes

~~~js
import { Router } from 'express';
import { CategoryController } from './controller';
import { getEnabledCategories } from 'trace_events';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryService } from '../services/category.service';


export class CategoryRoutes {


  static get routes(): Router {
    
    const categoryController = new CategoryController(new CategoryService())
    const router = Router();
    
    router.get('/', categoryController.getCategories)
    router.post('/', [AuthMiddleware.validateJWT], categoryController.createCategory)

    return router;
  }
}
~~~
----

## Retornar todas las categorias

- En el servicio

~~~js
async getCategories(){
    try {
        const categories = await CategoryModel.find()
        return categories.map(category=>({
            id: category.id,
            name: category.name,
            available: category.available
        }))    
        
    } catch (error) {
        throw CustomError.internalServer(`${error}`)
    }
}
~~~

- En el controller

~~~js
public getCategories = (req:Request, res:Response)=>{
    this.categoryService.getCategories()
        .then(categories=>res.json(categories))
        .catch(error=>this.handleError(error, res))
}
~~~
-----

## Paginación (DTO)

- Los query parameters suelen ser opcionales

~~~js
export class PaginationDto{
 

    constructor(
        public readonly page:number,
        public readonly limit:number
    ){}

    static create(page:number =1,limit:number = 10 ):[string?, PaginationDto?]{

        if(typeof page !== 'number' || typeof limit !== 'number') return ['Invalid data', undefined]
        if(page < 0 || limit < 0) return ['Page and  limit must be greater than 0', undefined]


        return [undefined, new PaginationDto(page, limit)]
    }
}
~~~

- En el controller

~~~js
public getCategories = (req:Request, res:Response)=>{

    const {page=1, limit=10} = req.query
    const [error, paginationDto] = PaginationDto.create(Number(page), Number(limit))
    if(error) return res.status(400).json({error})

    this.categoryService.getCategories(paginationDto)
        .then(categories=>res.json(categories))
        .catch(error=>this.handleError(error, res))
}
~~~

- Si pongo 1 * limit sería skip 10, pasaría a la página 2
- Si pongo 0 * limit, le estoy diciendo que haga un skip de 0 por lo que estaríamos en la página 1

~~~js
async getCategories(paginationDto:PaginationDto){
    const {page, limit} = paginationDto

    try {
        const categories = await CategoryModel.find()
        .skip((page-1) * limit)
        .limit(limit)

        return categories.map(category=>({
            id: category.id,
            name: category.name,
            available: category.available
        }))    
        
    } catch (error) {
        throw CustomError.internalServer(`${error}`)
    }
}
~~~

- Para hacer un recuento de todos los documentos uso 

~~~js
const total = await CategoryModel.countDocuments()
~~~

- Puedo disparar las dos promesas de manera simultánea

~~~js
async getCategories(paginationDto:PaginationDto){
    
    const {page, limit} = paginationDto

    try {

        const [total, categories] = await Promise.all([
            CategoryModel.countDocuments(),
            CategoryModel.find()
            .skip((page-1) * limit)
            .limit(limit)
        ])
        
        return{
            page,
            limit,
            total,
            next: (page-1 >0)?`/api/v1/categories?page=${page+1}&limit=${limit}`:null,
            prev: `/api/v1/categories?page=${page-1}&limit=${limit}`,


            categories: categories.map(category=>({
                
                id: category.id,
                name: category.name,
                available: category.available
            }))    
        }

        
    } catch (error) {
        throw CustomError.internalServer(`${error}`)
    }
}
~~~
