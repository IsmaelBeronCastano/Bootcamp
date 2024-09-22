import express  from "express"
import { Server } from "./server"


const initialize=()=>{
    const app = express()
    
    const server = new Server(app)
    server.start()

}

initialize()