import express  from "express"


const initialize=()=>{
    const app = express()
    
    app.listen(3002, ()=>{
        console.log("server listen on port 3002")
    })

}

initialize()