import express  from "express"
import {config} from './config'
import { start } from "./server"


const initialize=()=>{
    const app = express()
    
    start(app)
    
    app.listen(`${config.PORT}`, ()=>{
        console.log("Server running on port: "+ config.PORT)
    })

}

initialize()
