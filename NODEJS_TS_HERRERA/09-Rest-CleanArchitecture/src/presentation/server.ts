import express, { Router } from 'express'
import path from 'path'
import compression from 'compression'


interface Options{
    PORT : number
    PUBLIC_PATH?: string
    routes: Router
}


export class Server {
    private readonly port;
    private readonly publicPath;
    private readonly routes; 

    constructor(options:Options){
        const {PORT, PUBLIC_PATH='public', routes}= options

        this.port = PORT
        this.publicPath = PUBLIC_PATH
        this.routes = routes
    }

    private app = express()

    async start(){


        //middlewares
        this.app.use(express.json())

        //Public Folder
        this.app.use(express.static(this.publicPath))

        this.app.use(compression())


        this.app.use(this.routes)

        this.app.get('*', (req,res)=>{
          const indexPage = path.join(__dirname, `../../${this.publicPath}/index.html`)  
          res.sendFile(indexPage)  
        })
        
        this.app.listen(this.port, ()=>{
            console.log("corriendo en el 3000!")
        })
    }
}