import express  from "express"
import { Server } from "./server"


const initialize=()=>{
    const app = express()

    const server: Server = new Server(app)

    server.start()
    
    app.listen(3002, ()=>{
        console.log("server listen on port 3002")
    })

}

initialize()