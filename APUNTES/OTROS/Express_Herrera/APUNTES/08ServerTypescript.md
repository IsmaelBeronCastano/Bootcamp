# Server Typescript


- Instalaciones necesarias
  
> npm i express cors dotenv

- Instalo los tipos de express

> npm i -D @types/express

- Debo definir las propiedades antes de declararlas en el constructor
- server.ts

~~~js
import express from 'express'

class Server{
    
    private app: express.Application

    constructor(){
        this.app = express()
    }
}
~~~

- Creo el archivo .env con la variable PORT=8000
- Debo importar dotenv en app.ts 
- app.ts

~~~js
import dotenv from 'dotenv'

dotenv.config()
~~~

- Lo declaro como string, ya que las variables de entorno se leen como string
- Como port puede ser undefined uso el operador || para asignarle un número de puerto por defecto y no me marque error

~~~js
import express from 'express'

class Server{

    private app: express.Application
    private port: string 
    

    constructor(){
        this.app = express()
        this.port= process.env.PORT || '8000'
    }
}
~~~

- Creo el método listen
- Exporto el Server por defecto

~~~js
import express from 'express'

class Server{

    private app: express.Application
    private port: string 
    

    constructor(){
        this.app = express()
        this.port= process.env.PORT || '8000'
    }


    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Server listen on port ${this.port}`)
        })
    }
}

export default Server
~~~

- No estoy usando el Server en ningún lugar
- Creo una nueva instancia en app.ts

~~~js
import Server from './src/server'
import dotenv from 'dotenv'

dotenv.config()

const server = new Server()

server.listen()
~~~
-------

## Uso ts-node

> npm i ts-node

- En el package.json añado --esm para que no de el error de UNKNOWN EXTENSION

~~~json
"start:dev": "ts-node --esm app.ts"
~~~

- En el tsconfig.json debo añadir estas lineas

~~~json
"ts-node": {
"esm": true,
"experimentalSpecifierResolution": "node"
}
~~~

- Puedo usar tsc --watch para la compilación
-------

## Rutas de mi aplicación

- Creo en la carpeta routes en src el archivo usuario.routes.ts
- Creo la carpeta controllers también con usuario.controller.ts
- Los controladores no son más que **simples funciones que voy a llamar**
- Importo la request y la Response para el tipado
- usuario.controller.ts

~~~js
import { Request, Response } from "express"

export const getusuarios = (req: Request, res: Response)=>{
    res.json({
        msg: 'GET USUARIOS'
    })
}
~~~

- Hago lo mismo con el resto de endpoints (CRUD completo)
- En las rutas debo importar el Router de 'express'
- usuario.routes.ts

~~~js
import {Router} from 'express'
import { createUsuario, deleteUsuario, getUsuario, getUsuarios, updateUsuario } from '../controllers/usuario.controller'

const usuarioRouter = Router()

usuarioRouter.get('/', getUsuarios)
usuarioRouter.get('/:id', getUsuario)
usuarioRouter.post('/', createUsuario)
usuarioRouter.put('/:id', updateUsuario)
usuarioRouter.delete('/:id', deleteUsuario)

export default usuarioRouter
~~~

- Para definir las rutas creo una nueva propiedad en mi Server llamada apiPaths
- Creo el método routes
- Hago uso de this.app.use, apunto a this.apiPaths.usuarios, y uso el router que he creado
- LLamo el método en el constructor

~~~js
import express from 'express'
import usuarioRouter from './routes/usuario.routes'

class Server{

    private app: express.Application
    private port: string 
    private apiPaths ={
        usuarios: '/api/usuarios'
    }
    

    constructor(){
        this.app = express()
        this.port= process.env.PORT || '8000'
        this.routes()
    }

    routes(){
        this.app.use(this.apiPaths.usuarios, usuarioRouter)
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Server listen on port ${this.port}`)
        })
    }
}

export default Server
~~~

## NOTA: dejo solo la Response en los controladores para poder levantar el server, ya que no uso la request de momento y da error
--------

## Middlewares necesarios

- Para recibir el body necesito serializar el body, habilitar cors...
- Debo instalar tipos del cors con @types/cors
- Creo el método middlewares
- Hago uso de this.app.use para implementar cors 
- Parseo el body
- Configuro la carpeta pública para servir contenido estático
- Creo la carpeta public con dentro un html
- server.ts

~~~js
import express from 'express'
import usuarioRouter from './routes/usuario.routes'
import cors from 'cors'

class Server{

    private app: express.Application
    private port: string 
    private apiPaths ={
        usuarios: '/api/usuarios'
    }
    

    constructor(){
        this.app = express()
        this.port= process.env.PORT || '8000'
        this.middlewares()
        this.routes()
    }

    routes(){
        this.app.use(this.apiPaths.usuarios, usuarioRouter)
    }

    middlewares(){
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(express.static('public'))
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Server listen on port ${this.port}`)
        })
    }
}

export default Server
~~~
--------

## Conexión MySQL - Tabla de usuarios - Sequelize

- Creo una nueva conexión en TablePlus para MySQL
  - Name: NodeTypescript
  - host: localhost
  - user: root
  - password: root
  - port: 3306
- Le doy al icono de DB en TablePlus, creo una nueva DB, la llamo node-typescript
- Clic derecho a la izquierda--> nueva tabla --> usuarios
- Columna de id, data_type serial, is_nullable en NULL y column_default en NULL
- Columna nombre, VARCHAR , is_nullable en NO y column_default DEFAULT 
- Columna nombre, VARCHAR , is_nullable en NO y column_estadolt DEFAULT 
- Columna email, VARCHAR , is_nullable en NO y column_default DEFAULT 
- Columna estado, en lugar de boolean voy a usar tinyint , is_nullable en NO y column_default el valor de 1 
    - En 0 estará inactivo
- Para guardar los cambios (hacer el commit) uso Ctrl+S
- Falta establecer el email como único, se hará después
- Instalaciones

> npm i sequelize mysql2
> npm i -D @types/sequelize

- Creo el directorio db/connection.ts
- Creo una nueva instancia de Sequelize, le paso el nombre de la db, el user y la contraseña
  - Por último viene el objeto de configuración
    - Le paso el host
    - El dialect (el tipo de lenguaje de db)
    - Si pongo el logging en false no veré los impactos en la db en la consola

~~~js
import {Sequelize} from 'sequelize'


const db = new Sequelize('node-typescript', 'root', 'root',{
    host: 'localhost',
    dialect: 'mysql',
    //logging: false
})

export default db
~~~

- Voy al server
- Creo un nuevo metodo async dbConnection. Cómo puede fallar uso un try catch
- Uso el método authenticate
- Llamo al método dbConnection en el constructor

~~~js
import express from 'express'
import usuarioRouter from './routes/usuario.routes'
import cors from 'cors'
import db from '../db/connection'

class Server{

    private app: express.Application
    private port: string 
    private apiPaths ={
        usuarios: '/api/usuarios'
    }
    

    constructor(){
        this.app = express()
        this.port= process.env.PORT || '8000'
        this.dbConnection()
        this.middlewares()
        this.routes()
    }

    async dbConnection(){
            try {
                await db.authenticate()

                console.log('Database online')
                
            } catch (error:any) {
                throw new Error(error)
            }
    }

    routes(){
        this.app.use(this.apiPaths.usuarios, usuarioRouter)
    }

    middlewares(){
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(express.static('public'))
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Server listen on port ${this.port}`)
        })
    }
}

export default Server
~~~
------

## Modelo de usuario

- Creo la carpeta models/usuario.ts
- Import DataTypes de sequelize y la conexión a la db
- usuario.ts

~~~js
import {DataTypes} from 'sequelize'
import db from '../../db/connection'

const Usuario = db.define('Usuario', {

})
~~~

- El modelo debe tener los mismos campos que la tabla
- Sequelize me agregará created_at y updated_at
- Entonces solo necesito nombre, email y estado (el id lo maneja de forma automática)

~~~js
import {DataTypes} from 'sequelize'
import db from '../../db/connection'

const Usuario = db.define('Usuario', {
    nombre:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    estado:{
        type: DataTypes.TINYINT
    }
})

export default Usuario
~~~
--------

## Obtener usuarios

- Creo un par de usuarios manualmente
- Voy al GET del controlador
- uso Usuario para hacer la consulta. Devuelve una promesa, por lo que uso async await

~~~js
export const getUsuarios = async (res: Response)=>{

    const usuarios = await  Usuario.findAll()

    res.json({
        msg: 'GET USUARIOS',
        usuarios
    })
}
~~~

- Como he creado los usuarios manualmente, da error porque no encuentra la columna createdAt ( y updatedAt)
- Los creo manualmente en TablePlus, clic derecho-->Open structure
- createdAt y updatedAt son de tipo TIMESTAMP
- Para asegurarme de que hay un usuario con el id debo hacer una validación muy sencilla
## NOTA: Necesito pasarle la req:Request para que funcione correctamente. Como si no la uso me marca error, extraigo los headers

~~~js
export const getUsuarios = async ( req: Request, res: Response)=>{
    const {headers} = req.headers //solo para que no de error por pasarle la Request y no usarla

    const usuarios = await  Usuario.findAll()

    res.json({
        usuarios,
        headers
    })
}

export const getUsuario = async (req: Request, res: Response)=>{

    const {id}= req.params

    const usuario = await Usuario.findByPk(id)

    if(!usuario){
        res.status(404).json({
            msg: `No existe un usuario con el id ${id}`
        })        
    }else{
        res.json({
            msg: 'GET USUARIO',
            usuario
        })
    }
}
~~~
-------

## Crear y actualizar

- Validar la data, y todo el uso del express-validator en las rutas es exactamente lo mismo que lo visto anteriormente
- Para crear el usuario lo haremos dentro de un try catch porque puede que falle

~~~js
export const createUsuario = async (req: Request,res: Response)=>{

    try {
        const {body} = req

        const usuario = await Usuario.create(body)

        usuario.save()
        
    } catch (error: any) {
        throw new Error(error)
    }
    
    res.json({
        msg: 'POST USUARIO'
    })
}
~~~

- El email debe de ser único
- Desde TablePlus le agrego un índice. clic derecho -->Open Structure
  - index_name: email_unique
  - index_algorithm: DEFAULT
  - is_unique: TRUE
  - column: email
- Antes de hacer la inserción del usuario debo verificar si existe el email
- Le pongo un return al res.json para que el error no haga caer mi servidor

~~~js
export const createUsuario = async (req: Request,res: Response)=>{

    try {
        const {body} = req

        const existeEmail = await Usuario.findOne({
            where:{
                email: body.email
            }
        })

        if(existeEmail){
            return res.status(400).json({
                msg: `El email ${body.email} ya está registrado`
            })
        }

        const usuario = await Usuario.create(body)

        usuario.save()
        
    } catch (error: any) {
        throw new Error(error)
    }
    
    res.json({
        msg: 'POST USUARIO'
    })
}
~~~

- El update es muy parecido

~~~js
export const updateUsuario = async (req:Request, res: Response)=>{
  
    try {
        const {body} = req
        const {id} = req.params

        const usuario = await Usuario.findByPk(id)

        if(!usuario){
           return res.status(404).json({
                msg: `El usuario con id ${id} no existe`
            })
        }        

        await Usuario.update(body,{
            where:{
                id
            }
        })
        res.json({
            usuario
        })
    } catch (error: any) {
        throw new Error(error)
    }
}
~~~
-------

## Delete

- Borrado físico y borrado lógico

~~~js
export const deleteUsuario = async (req: Request, res: Response)=>{
  
    const {id} = req.params

    const usuario = await Usuario.findByPk(id)

    if(!usuario) return res.status(404).json({
        msg: `Usuario con id ${id} no encontrado`
    })
    
    //await usuario.destroy()    borrado fisico
    
    //borrado lógico

    await usuario.update({estado: 0})
    
    res.json({
        msg: 'DELETE USUARIO'
    })
}
~~~
