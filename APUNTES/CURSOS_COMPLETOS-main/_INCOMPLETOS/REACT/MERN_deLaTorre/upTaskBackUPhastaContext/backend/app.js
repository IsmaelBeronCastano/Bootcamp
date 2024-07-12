import express from 'express'
import dotenv from "dotenv"
import { conectarDB } from './config/db.js'
import usuarioRoutes from './routes/usuario.routes.js'
import proyectoRoutes from './routes/proyecto.routes.js'
import tareaRoutes from './routes/tarea.routes.js'
import cors from 'cors'

const app = express()
app.use(express.json())
dotenv.config()



conectarDB()

const whitelist = [process.env.STRING_CONNECTION_CORS1, process.env.STRING_CONNECTION_CORS2]

const corsOptions ={
    origin: function(origin, callback){
        if(whitelist.includes(origin)){
            callback(null, true)
        }else{
            callback(new Error("Error de Cors"))
        }
    }
}

app.use(cors(corsOptions))
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/tareas', tareaRoutes)


const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
})