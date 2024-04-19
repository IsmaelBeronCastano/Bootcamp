# NODE TS Envio Correo + Validación Token


## Email Service
----
- **NOTA**: para generar la contraseña de aplicación de gmail acceder desde la cuenta en *https://myaccount.google.com/u/0/apppasswords*
----
- Creo presentation/services/email.service.ts

~~~js
import nodemailer from 'nodemailer'

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

    constructor(){  

    }
    private transporter= nodemailer.createTransport({
        service: envs.MAILER_SERVICE, //NO TENGO LAS VARIABLES DE ENTORNO
        auth:{
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    async sendEmail(options: SendEmailOptions): Promise<boolean>{

        const {to, subject,htmlBody, attachments} = options

            try {

                const sentInformation = await this.transporter.sendMail({
                    to,
                    subject,
                    html: htmlBody,
                    attachments
                })

                console.log(sentInformation)

                const log = new LogEntity({
                    level: LogSeverityLevel.low,
                    message: 'Email sent',
                    origin: 'email.service'
                })
               // this.logRepository.saveLog(log)

                return true
            } catch (error) {

                console.log(error)
                const log = new LogEntity({
                    level: LogSeverityLevel.low,
                    message: 'Email was no sent',
                    origin: 'email.service'
                })
                //this.logRepository.saveLog(log)
             
                return false
            }
    }

    async sendemailWithFileSystemLogs(to: string | string[]){ 
            const subject= 'Logs del servidor'
            const htmlBody=`
            <h3>Logs del sistema</h3>
            <p>Desde sendEmailWithFileSystem</p>
            `

        const attachments: Attachment[]= [
            {filename: 'logs-all.log', path: './logs/logs-all.log'},
            {filename: 'logs-high.log', path: './logs/logs-high.log'},
            {filename: 'logs-medium.log', path: './logs/logs-medium.log'},
        ]

        
        return this.sendEmail({to, subject, attachments, htmlBody})
    }
}
~~~

- No tengo las variables de entorno
- Quiero evitar esta dependencia oculta
- En lugar de hacerlo asi, declaro transporter de nodemailer pero no lo inicializo
- Lo hago en el constructor
- No tengo LogEntity, lo borro por el momento
- Pasándole las variables por el constructor, me deshago de la dependencia oculta

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
        senderEmailPassword: string
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

        const {to, subject,htmlBody, attachments} = options

            try {

                const sentInformation = await this.transporter.sendMail({
                    to,
                    subject,
                    html: htmlBody,
                    attachments
                })

                return true
            } catch (error) {
                return false
            }
    }

}
~~~

- Hay que rellenar las variables de entorno
- *NOTA* para obtener la secret_key hay que activar el 2 factor auth, y generarla en contraseña de aplicaciones

~~~
MAILER_SERVICE=gmail
MAILER_EMAIL=ismaelberoncastano@gmail.com
MAILER_SECRET_KEY=kludyhcnbiuecrfby
~~~

- Hay que configurarlas en config/envs.ts

~~~js
import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  MONGO_STRING: get('MONGO_STRING').required().asString(),
  MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
  JWT_SEED: get('JWT_SEED').required().asString(),
  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL:get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY:get('MAILER_SECRET_KEY').required().asString()

}
~~~

- Cuando registramos un usuario debemos enviar un correo de confirmación
- Inyecto el emailService (hay varias maneras de hacerlo)
- Creo un método privado para este caso concreto
- Debo generar el token para la validación
- Creo el link (lo añado como variable de entorno)
- Creo el html del email
- Configuro el objeto de opciones que le pasaré a sendEmail
- Empleo el servicio para enviar el email
- *NOTA* en proximas clases crearemos un túnel para poder autenticarnos con el teléfono sin tener desplegada la aplicación
- presentation/services/auth.service

~~~js
import { Request, Response } from "express";
import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { UserModel } from "../../data";
import { CustomError } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { UserEntity } from "../../domain/entities/user/user.entity";
import { JwtAdapter } from "../../config/jwt.adqapter";
import { EmailService } from "./email.services";
import { envs } from "../../config/envs";

export class AuthService{
    constructor(
        private readonly emailService: EmailService
    ){

    }

    public async registerUser(registerUserDto: RegisterUserDto){

        const existUser = await UserModel.findOne({email: registerUserDto.email});
        if(existUser) throw CustomError.badRequest('User already exists');

        try {
            const user = new UserModel(registerUserDto);

            user.password = bcryptAdapter.hash(registerUserDto.password) //encripto el password antes de guardar

            await user.save();

            await this.sendEmailValidationLink(user.email) //ENVIO EL MQAIL DE CONFIRMACIÓN!!

            const {password, ...userEntity}= UserEntity.fromObject(user)
            const token= await  JwtAdapter.generateToken({id: user.id})
            if(!token) throw CustomError.internalServer("Error generating token")
            return {user: userEntity, token: token}
            
        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

        
    }

    public async loginUser(loginUserDto: LoginUserDto){
        const user = await UserModel.findOne({email:loginUserDto.email })

        if(!user) throw CustomError.badRequest("User don't exists!")

        const hashMatch = bcryptAdapter.compare(loginUserDto.password, user.password)

        if(!hashMatch) throw CustomError.unauthorized("Password is not valid")
        
        const {password, ...userEntity} = UserEntity.fromObject(user)

        const token= await  JwtAdapter.generateToken({id: user.id})
        if(!token) throw CustomError.internalServer("Error generating token")

        return {
            user: userEntity,
            token: token
        }
    }

      private sendEmailValidationLink =async(email:string)=>{
        const token = await JwtAdapter.generateToken(email)

        if(!token) throw CustomError.internalServer('Error generating token')

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`

        const html=`
        <h1>Validar Email</h1>
        <p>Este es un correo para validar tu cuenta</p>
        <a href=${link}>Valida tu email: ${email}</a>
        <p>por favor, si no has sido tu ignóralo</p>
        <p>Gracias</p>
        `

        const options= {
            to: email,
            subject: 'Valida tu email',
            htmlBody: html
        }

        const isSent= await this.emailService.sendEmail(options)

        if(!isSent) throw CustomError.internalServer("Error sending email")

        return true
    }   
}
~~~

- En las rutas del auth voy a tener un error porque el authService está esperando que le pase el emailService
- Como son tres argumentos podría crear un objeto en la clase para pasar al constructor con una interfaz y luego generar aquí el objeto con las variables
- Recuerda que tienen que estar en orden

~~~js
import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../services/auth.service';
import { envs } from '../../config/envs';
import { EmailService } from '../services/email.services';



export class AuthRoutes {


  static get routes(): Router {
    const router = Router();

    const emailService = new EmailService(envs.MAILER_SERVICE,envs.MAILER_EMAIL,envs.MAILER_SECRET_KEY)
    const authService = new AuthService(emailService)
    const controller = new AuthController(authService);
    
   router.post('/login', controller.loginUser)
   router.post('/register', controller.registerUser)
   router.get('/validate-email/:token', controller.validateEmail)



    return router;
  }


}
~~~
-----

## Probar envío de correos

- Coloco console.logs en el servicio para ver que puede salir mal
- En el body envio un correo válido para poder chequear el mail
-----

## Validar Token

- En auth.controller voy a validateEmail

~~~js
validateEmail=(req:Request,res:Response)=>{
    const {token} = req.params

    this.authService.validateEmail(token)
        .then((user)=>res.json('Email validated'))
        .catch((error)=>this.handleError(error, res))
}
~~~

- En auth.service creo el método validateEmail pero primero CREO EL METODO PARA VERIFICAR EL TOKEN EN EL JWT.ADAPTER
- JwtAdapter

~~~js
static validateToken(token:string){
return new Promise(resolve=>{
    jwt.verify(token, JWT_SEED, (err, decoded)=>{
        if(err) return resolve(null)
        resolve(decoded)
    })
})

}
~~~

- En auth.service

~~~js
public validateEmail= async(token:string)=>{
    const payload = await JwtAdapter.validateToken(token);

    if (!payload) throw CustomError.badRequest('Invalid token');

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer('Email not in token');

    const user = await UserModel.findOne({ email });

    if (!email) throw CustomError.internalServer('Error getting email');

    if (!user) throw CustomError.internalServer('User not found');

    user.emailValidated = true;

    await user.save()
    return true

}
~~~

- Ahora puedo probar con el link que hay en mi correo
-------

## 