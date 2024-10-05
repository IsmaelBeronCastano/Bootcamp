# Auth

- **3 rutes**
  - POST - /login
  - POST - /register
  - GET - /validate-email/:token

~~~js
import { Router } from "express"

export class AuthRoutes{
    static get routes(): Router{
        const router = Router()
        
        router.post('/login')
        router.post('/register')
        router.get('/validate-email/:token')

        return router
    }
}
~~~

- Per utilitzar-ho a AppRoutes

~~~js
import { Router } from "express";
import { AuthRoutes } from "./auth/routes/auth.routes";

export class AppRoutes {

  static get routes(): Router{
    const router = Router()

    router.use('/api/v1/auth',AuthRoutes.routes)
    return router
  }
}
~~~

- Al controller farem injecció de dependències

~~~js
import { Request, Response } from "express"

export class AuthController{
    constructor(){

    }
    registerUser =(req:Request, res: Response)=>{
        res.json({msg: 'register user'})
    }

    loginUser = (req:Request, res: Response)=>{
        res.json({msg: "login user"})
    }

    validateEmail=(req:Request, res: Response)=>{
        res.json({msg: "validate-email"})
    }
}
~~~

- Genero una nova instancia de l'auth.controller

~~~js
import { Router } from "express"
import { AuthController } from "../controller/auth.controller"

export class AuthRoutes{
    static get routes(): Router{
        const router = Router()

        const authController = new AuthController()
        
        router.post('/login', authController.loginUser)
        router.post('/register', authController.registerUser)
        router.get('/validate-email/:token', authController.validateEmail)

        return router
    }
}
~~~

- Creo la conexió amb mongo a src/data/mongo/mongo.connection.ts
- Ho faig amb un try catch

~~~js
import mongoose from "mongoose"

interface connectionOptions{
    mongoUrl: string
    dbName: string
}


export class MongoConnection{
    static async connect(options: connectionOptions){
        const {mongoUrl, dbName}= options

        try {
            await mongoose.connect(mongoUrl,{
                dbName
            })
            console.log("Mongo connected!")  
            return true          
        } catch (error) {
            
            console.log("Mongo not connected")
            throw error
        }
    }
}
~~~

- Definexio les variables a .env i les valido a src/config/envs

~~~
PORT = 3000
mongoUrl=mongodb://root:root@localhost:27017
dbName=labotiga
~~~

- envs

~~~js
import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  MONGO_URL: get('mongoUrl').required().asString(),
  DB_NAME: get('dbName').required().asString()

}
~~~


- Invoco la funció al main d'app.ts

~~~js
import { envs } from "./config/envs"
import { MongoConnection } from "./data/mongo/mongo.connection"
import { AppRoutes } from "./presentation/routes"
import { Server } from "./presentation/server.new"


(async ()=>{
  main()
})()


async function main (){

  await MongoConnection.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.DB_NAME
  }) 
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes
  })

  server.start()
}
~~~
----

## User Model


