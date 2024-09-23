import { Application, json } from "express";
import cors from 'cors'
import { config } from "./config";
import { appRoutes } from "./routes";






export class Server{
    private app: Application

    constructor(app: Application){
        this.app = app
    }



    public start(): void{
        this.routesMiddleware(this.app)
        this.middlewareStandard()

        this.app.listen(config.PORT, ()=>{
            console.log("Server running on port"+ config.PORT)
        })

    }

    middlewareStandard(): void{
        this.app.use(json())
        this.app.use(cors())

    }

    routesMiddleware(app:Application){
        appRoutes(app)
    }
}

