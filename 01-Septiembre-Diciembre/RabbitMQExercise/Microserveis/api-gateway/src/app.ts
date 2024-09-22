import express  from "express"


const initialize=()=>{
    const app = express()
    
    app.listen(3000, ()=>{
        console.log("server listen on port 3000")
    })

}

initialize()