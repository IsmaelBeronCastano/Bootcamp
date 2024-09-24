import express  from "express"
import { start} from "./server"
import { connectionDB } from "./db/connection"


const initialize=()=>{

    connectionDB()
    const app = express()

  
    start(app)
    
    app.listen(3002, ()=>{
        console.log("server listen on port 3002")
    })

}

initialize()