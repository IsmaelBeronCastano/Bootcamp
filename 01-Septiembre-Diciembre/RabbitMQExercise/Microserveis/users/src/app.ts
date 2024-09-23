import express  from "express"
import { Server } from "./server"
import { connectionDB } from "./db/connection"


const initialize=()=>{

    connectionDB()
    const app = express()

    const server: Server = new Server(app)

    server.start()
    
    app.listen(3002, ()=>{
        console.log("server listen on port 3002")
    })

}

initialize()