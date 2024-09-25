import {Application, json} from 'express'
import cors from 'cors'
import { appRoutes } from './routes'

export function start(app:Application)
{
    routes(app)
    standardMiddlewares(app)
    startQueues()

}


function standardMiddlewares(app:Application){
    app.use(json())
    app.use(cors())
}

function routes(app:Application){
    appRoutes(app)
}

function startQueues(){

}

