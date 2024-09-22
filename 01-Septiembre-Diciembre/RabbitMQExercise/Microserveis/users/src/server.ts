import { Application, json } from "express";
import cors from 'cors'
import { config } from "./config";




export class Server{

    private app: Application;

    constructor(app: Application){
        this.app = app
    }


    public start(){
        this.app.use(json())
        this.app.use(cors())
        this.app.listen(config.PORT, ()=>{
            console.log("Server running on port: "+ config.PORT)
        })
    }
}