import express from 'express'
import { start } from './server'
import { dbConnection } from './db/dbConnection'
import { config } from './config'

function initialize(){
    const app = express()
    dbConnection()
    start(app)

    app.listen(config.PORT, ()=>{
        console.log("Server running on port "+ config.PORT)
    })
}

initialize()


