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