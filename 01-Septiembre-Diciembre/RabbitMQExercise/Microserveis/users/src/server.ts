import { Application, json } from "express";
import cors from 'cors'
import { appRoutes } from "./routes";
import { Channel } from "amqplib";
import {createConnection} from './queues/connection'


export let userChannel: Channel;


export function start(app:Application){
    standardMiddlewares(app)
    routesMiddleware(app)    
    startQueues()
 
    }

function standardMiddlewares(app: Application){
        app.use(json())
        app.use(cors())
    }

function routesMiddleware(app: Application){
        appRoutes(app)
    }

async function startQueues(){
        userChannel = await createConnection() as Channel 
    }

