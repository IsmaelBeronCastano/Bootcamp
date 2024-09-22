import express  from "express"


const initialize=()=>{
    const app = express()
    
    app.listen(3001, ()=>{
        console.log("server listen on port 3001")
    })

}

initialize()
