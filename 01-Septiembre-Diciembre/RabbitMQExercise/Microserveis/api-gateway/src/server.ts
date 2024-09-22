import { Application, json } from "express";
import cors from 'cors'
import { config } from "./config";
import { appRoutes } from "./routes";

export class Server {
    private app: Application

    constructor(app:Application){
        this.app = app
    }

    public start(): void{
        this.routesMiddleware(this.app)
        this.standardMiddlewares()

        this.app.listen(config.PORT, ()=>{
            console.log("server running on port: "+ config.PORT)
        })
    }

    standardMiddlewares(): void{
        this.app.use(json())
        this.app.use(cors())


    }


    routesMiddleware(app: Application){
        appRoutes(app)
    }
}