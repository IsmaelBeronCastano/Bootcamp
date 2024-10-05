import express, { Application, Router } from "express"
import cors from 'cors'

export interface IOptions{
    port : number
    routes: Router
}

export class Server {

    public readonly app = express()
    private readonly port: number
    private readonly routes: Router

    constructor(options: IOptions){
        const {port = 3000, routes} = options
        this.port = port
        this.routes = routes
    }

    start(){
        this.middlewares()
        this.router()
        this.listen()
    }

    middlewares(){
        this.app.use(express.json())
        this.app.use(cors())
    }

    router(){
        this.app.use(this.routes)
    }


    listen(){
        this.app.listen(this.port, ()=>{
            console.log("Server running on port "+ this.port)
        })
    }

}