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

- 

-  