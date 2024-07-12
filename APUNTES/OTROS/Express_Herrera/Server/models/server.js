import express from 'express'
import cors from 'cors'
import userRouter from '../routes/user.routes.js'
import dbConnection from '../database/config.js'
import authRouter from '../routes/auth.router.js'
import categoriaRouter from '../routes/categoria.routes.js'
import productosRouter from '../routes/producto.router.js'
import buscarRouter from '../routes/buscar.routes.js'
export class Server {

    constructor(){
        this.app = express()
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios'
        this.authPath= '/api/auth'
        this.categoriasPath = '/api/categorias'
        this.productosPath = '/api/productos'
        this.buscarPath = "/api/buscar"

        //conexion a la DB
        this.conectarDB()
        
        //Middlewares ( en el constructor van a ejecutarse al levantar el servidor )
        this.middlewares()

       //Rutas
        this.routes()
    }

    async conectarDB(){
        await dbConnection()
    }

    middlewares(){
        this.app.use(express.static('public')) //Esto servirá lo que haya en la carpeta public en '/'
        this.app.use(express.urlencoded({extended: false})) //parseo el body
        this.app.use(express.json())
        this.app.use(cors())
    }

    routes(){
        
        this.app.use(this.usuariosPath, userRouter)
        this.app.use(this.authPath, authRouter)
        this.app.use(this.categoriasPath, categoriaRouter )
        this.app.use(this.productosPath, productosRouter)
        this.app.use(this.buscarPath, buscarRouter)
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Server corriendo en puerto ${this.port}`)
        })
    }
}