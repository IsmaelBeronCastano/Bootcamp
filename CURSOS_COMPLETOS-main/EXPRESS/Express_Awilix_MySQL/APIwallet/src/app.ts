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

                   