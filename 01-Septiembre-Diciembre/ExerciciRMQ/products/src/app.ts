import express, { Application } from 'express'
import { start } from './server'


function initialize(){
    const app: Application = express()

    start(app)

    app.listen(4001, ()=>{
        console.log("Server running on port 4001")
    })
}

initialize()