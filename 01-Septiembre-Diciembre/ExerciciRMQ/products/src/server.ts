import { Application, json } from "express"
import cors from 'cors'

const start = (app:Application)=>{
    standardMiddleware(app)
    routes()
    startQueues
}


const standardMiddleware=(app:Application)=>{
    app.use(json())
    app.use(cors())
}

function routes(){

}


function startQueues(){

}

export {start}


