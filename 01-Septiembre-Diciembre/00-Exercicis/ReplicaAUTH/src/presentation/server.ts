import express, { Router } from "express"
import cors from 'cors'

interface Options{
    port: number
    routes: Router
}

export class Server{
    public app = express()
    private readonly port: number
    private readonly routes: Router

    constructor(options: Options){
        const {port,routes }= options

        this.port = port
        this.routes = routes

    }

    start(){
        this.middlewares()
        this.listen()
    }

    middlewares(){
        this.app.use(express.json())
        this.app.use(cors())
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log("server running on port ",this.port )
        })
    }
}
