import { Application, json } from "express";
import cors from 'cors'
import { appRoutes } from "./routes";
import { createConnection } from "./queues/connection";
import {Channel} from 'amqplib'
import { databaseConnection } from "./database/dbConnection";






export let productsChannel: Channel

    export function start(app:Application): void{
        dbConnection()
        routesMiddleware(app)
        middlewareStandard(app)
        startQueues()


    }

    function middlewareStandard(app:Application): void{
        app.use(json())
        app.use(cors())

    }

    function routesMiddleware(app:Application){
        appRoutes(app)
    }

    async function startQueues(){
       productsChannel = await createConnection() as Channel
    }

    function dbConnection(){
        databaseConnection()
    }


