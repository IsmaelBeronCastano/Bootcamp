import express from 'express'
import path from 'path'


interface Options{
    PORT : number
    PUBLIC_PATH?: string
}


export class Server {
    private readonly port;
    private readonly publicPath;

    constructor(options:Options){
        const {PORT, PUBLIC_PATH='public'}= options

        this.port = PORT
        this.publicPath = PUBLIC_PATH
    }

    private app = express()

    async start(){


        //middlewares

        //Public Folder
        this.app.use(express.static(this.publicPath))

        this.app.get('*', (req,res)=>{
          const indexPage = path.join(__dirname, `../../${this.publicPath}/index.html`)  
          res.sendFile(indexPage)  
        })
        
        this.app.listen(this.port, ()=>{
            console.log("corriendo en el 3000!")
        })
    }
}