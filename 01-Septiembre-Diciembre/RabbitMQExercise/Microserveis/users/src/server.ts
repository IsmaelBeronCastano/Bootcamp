import { Application, json } from "express";
import cors from 'cors'
import { appRoutes } from "./routes";




export class Server{

    private app: Application;

    constructor(app: Application){
        this.app = app
    }


    public start(){
    this.routesMiddleware(this.app)    
    this.standardMiddlewares()

 
    }

    standardMiddlewares(){
        this.app.use(json())
        this.app.use(cors())
    }

    routesMiddleware(app: Application){
        appRoutes(app)
    }
}