import connection from '../common/persistence/mysql.persistence'
import { createUserDto } from "../common/dtos/identity.dto"
import { ApplicationException } from '../common/exception/application.exception'
import SHA from 'sha.js'
import jwt from 'jsonwebtoken'

export class IdentityService{
    

    async create(user: createUserDto): Promise<void>{
        
        //HASH password---> el algoritmo de encriptación, los caracteres de la cadena y cómo quieres que sea retornada
        user.password = SHA('sha256').update(user.password).digest('base64')

        await connection.execute(
            'INSERT INTO auth_user(email, password, created_at) VALUES(?,?,?)',
            [user.email, user.password, new Date() ]
        )
    }
                                                         //el token es un string                   
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
}