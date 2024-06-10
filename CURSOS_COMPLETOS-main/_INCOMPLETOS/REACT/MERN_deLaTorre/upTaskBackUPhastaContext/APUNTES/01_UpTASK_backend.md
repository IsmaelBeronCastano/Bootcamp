# 01 MERN UPTASK

## Backend

- Creo dos carpetas, una para el fornt otra para el back
- En el back creo el package.json e instalo

> npm init

> npm i express 
> npm i g nodemon

- Creo el app.js para el servidor básico

~~~js
const express = require("express")


const app = express()

const PORT = 3000
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
})
~~~


> "dev": "nodemon app.js"

- Para habilitar soporte a imports, en el package.json

>  "type": "module"

- Uso import para importar express en el servidor.
  - Cómo es una dependencia no hace falta que coloque la extensión del archivo
  
~~~js
import express from 'express'


const app = express()

const PORT = 3000
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
})
~~~

- Para importar de archivos que he creado yo **debo colocar la extensión .js**
------

## Configurando DB

- Creo una DB con MongoCompass llamada UpTASK
- Instalo mongoose

> npm i mongoose

- Creo la carpeta config con el archivo db.js
- Creo el script de conexión
- En lugar de usar localhost en el string de conexión URL uso 127.0.0.1
- Le añado la url y las dos propiedades obligatorias en el objeto de conexión

~~~js
import mongoose from "mongoose";

export const conectarDB = async ()=>{
    try {
        const URL = 'mongodb://127.0.0.1:27017/UpTASK' 
        const connection = await mongoose.connect(URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log("Conexión realizada!")
        
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}
~~~

- Llamo a la función en app.js

~~~js
conectarDB()
~~~
------

## Usando variables de entorno

- Instalo dotenv

> npm i dotenv

- Para usarlo uso **dotenv.config()** en app.js
- Ahora puedo usar process.env.NOMBRE_DE_LA_VARIABLE, usando los nombres que incluya en el archivo .env en la raíz

~~~js
import express from 'express'
import dotenv from "dotenv"
import { conectarDB } from './config/db.js'

const app = express()
dotenv.config()

conectarDB()

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
})
~~~

- Hago lo mismo con el string de conexión
-----

## MVC

- Para crear el modelo creo la carpeta models/Usuario.js
- Creo el Schema con **mongoose.Schema**
- La propiedad confirmado cambiará cuando el usuario de click al enlace enviado por mail
- timestamps crea el created_at y el updated_at
- Creo el modelo con **mongoose.model**. Le paso el nombre cómo voy a llamar al modelo y el schema

~~~js
import mongoose from "mongoose";

const usuarioSchema = mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    token :{
        type: String,
    },
    confirmado:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

const Usuario = mongoose.model("Usuario", usuarioSchema)

export default Usuario
~~~
-----

## Routing de Usuarios

- Creo la carpeta controllers y la carpeta routes
- routes/usuarioRoutes.js

~~~js
import { Router } from "express";

const router = Router()

router.get('/', (req,res)=>{
    res.send("Desde API/Usuarios")
})

export default router
~~~

- En app.js hago uso del app.use
- Como lo exporto por default puedo renombrarlo como quiera
- Le añado /api/usuarios al endpoint

~~~js
app.use('/api/usuarios', usuarioRoutes)
~~~

- Creo el crud completo con los controladores en otro archivo
- usuarioController.js

~~~js
const postUsuario = (req,res)=>{
    console.log("POST desde /api/usuarios")
}

const putUsuario = (req,res)=>{
    console.log("POST desde /api/usuarios")
}

const deleteUsuario = (req,res)=>{
    console.log("DELETE desde /api/usuarios")
}

export default {
    postUsuario,
    putUsuario,
    deleteUsuario
}
~~~

- usuario.routes.js

~~~js
import { Router } from "express";
import usuarioController from "../controllers/usuario.controller.js";
const router = Router()

router.post('/', usuarioController.postUsuario)
router.put('/:id', usuarioController.putUsuario)
router.delete('/:id', usuarioController.deleteUsuario)

export default router
~~~

- Compruebo que los endpoints funcionan con ThunderClient/POSTMAN
-----

## Enviando Request, leyendo datos y creando usuarios

- Añado el res.send y le paso el body para imprimirlo en la respuesta

~~~js
const postUsuario = (req,res)=>{
    res.send(req.body)
}
~~~

- Debo añadirle los campos obligatorios en formato JSON en el body de la petición

~~~json
{
  "nombre": "Pedro",
  "email": "pedro@gmail.com",
  "password": "123456"
}
~~~

- Para que express pueda leer JSON y enviarlo en la Response debo configurarlo en app.js

~~~js
app.use(express.json())
~~~

- Para insertar en la db voy al controlador e importo el modelo

~~~js
const postUsuario = async (req,res)=>{
    try {
        const usuario = new Usuario(req.body)

        const usuarioAlmacenado = await usuario.save()
        
        res.json(usuarioAlmacenado)
        
    } catch (error) {
        console.log(error)
    }
}
~~~

- Para prevenir usuarios duplicados y crear mi propia respuesta de error

~~~js
const postUsuario = async (req,res)=>{
    const {email} = req.body
    const existeUsuario = await Usuario.findOne({email})

    if(existeUsuario){
        const error = new Error("Usuario ya registrado")

        return res.status(400).json({msg: error.message})
    }

    try {
        const usuario = new Usuario(req.body)

        const usuarioAlmacenado = await usuario.save()
        
        res.json(usuarioAlmacenado)
        
    } catch (error) {
        console.log(error)
    }
}
~~~
-------

## Hashear los passwords

- Instalo bcrypt
  
> npm i bcrypt

- Voy a implementar el hasheo en el modelo usando un middleware y un hook de mongoose
- Uso el middleare pre para que lo haga antes de, y le digo 'save'. Uso function para el callback porque voy a usar el this
- Le paso next para que pase a lo siguiente una vez finalizada la tarea
- Debo generar el salt para el hasheo. Lo bloqueo con el await porque lo voy a necesitar en la siguiente linea y no continue hasta que esté listo
- 10 rondas es el default
- this hace referencia al objeto del Usuario
- Le añado la comprobación con la función de mongoose isModified, para comprobar que no se esté modificando el password, por ejemplo al hacer un PUT, porque volvería a hashear lo hasheado y nunca haría match
- Usuario.model.js

~~~js
usuarioSchema.pre('save', async function(next){
    if(!this.isModified('password')) next()

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
~~~
------

## Generar id para el Token

- Creo la carpeta helpers/generar-id.js

~~~js
export const generarId =()=>{

    const random = Math.random().toString(32).substring(2)

    const date = Date.now().toString(32)

    const id = random + date
    
    return id
}
~~~

- Voy al usuario.controller

~~~js
const postUsuario = async (req,res)=>{
    const {email} = req.body
    const existeUsuario = await Usuario.findOne({email})

    if(existeUsuario){
        const error = new Error("Usuario ya registrado")

        return res.status(400).json({msg: error.message})
    }

    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId() //añado el id
        const usuarioAlmacenado = await usuario.save()
        
        res.json(usuarioAlmacenado)
        
    } catch (error) {
        console.log(error)
    }
}
~~~
-----

## Creando el endpoint de autenticación

- Creo el endpoint en usuario.routes

> router.post('/login', usuarioController.login)

- Añado el login al controlador
- Coloco el token que he generado en el bearer_token de ThunderClient
- Debo comprobar si el usuario existe y está confirmado

~~~js
const login = async (req,res)=>{
    const {email, password} = req.body

    const usuario = await Usuario.findOne({email})

    if(!usuario){
        const error = new Error("Usuario no encontrado")
        res.status(400).json({msg: error.message})
    }

    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada")
        res.status(403).json({msg: error.message})
    }

    res.json(usuario)    
}
~~~

- Para comprobar el password lo haré en el modelo. Con .methods puedo agregar los métodos que quiera
- Debo pasarle el password del body al modelo. El método retornará true o false con .compare
- usuario.model

~~~js
usuarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password)
}
~~~

- Uso el await en el if del controlador porque comprobarPassword es asíncrono, le paso el password del body
- Para probar que todo marcha bien pongo unos console.log y cambio el estado de confirmado del usuario a true desde MongoCompass
- usuario.controller método login
~~~js
if(await usuario.comprobarPassword(password)){ //uso el método que he creado en el modelo y le paso el password del body
       res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email
        })
}else{
    const error = new Error("El password es incorrecto")
    res.status(403).json({msg: error.message})
}
~~~
-------

## Generar JWT

- Instalo jwt

> npm i jsonwebtoken

- Creo en helpers generarJWT.js
- .sign me permite crear un JWT. Le digo que genere un objeto con el id que le paso de usuario._id
- Creo una variable de entorno para la palabra secreta en .env

~~~js
import jwt from 'jsonwebtoken'

export const generarJWT = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })
}
~~~

- usuario.controller

~~~js
const login = async (req,res)=>{
    const {email, password} = req.body

    const usuario = await Usuario.findOne({email})

    if(!usuario){
        const error = new Error("Usuario no encontrado")
        return res.status(400).json({msg: error.message})
    }

    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(403).json({msg: error.message})
    }

    if(await usuario.comprobarPassword(password)){
        return res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)  //le paso el id al token
        })
    }else{
        const error = new Error("El password es incorrecto")
        return res.status(403).json({msg: error.message})
    }    
}
~~~
-----

## Crear endpoint para confirmar cuenta

- Creo el endpoint de tipo GET en usuario.routes

> router.get('/confirmar/:token', usuarioController.confirmarCuenta)

- En usuario.controller, quiero comparar el token almacenado (el que yo generé con el helper, NO EL DEL LOGIN)

~~~js
const confirmarCuenta = async (req,res)=>{
    const {token} = req.params

    const usuarioConfirmar = await Usuario.findOne({token})

    if(!usuarioConfirmar){
        const error = new Error("Token no valido")
        res.status(400).json({msg: error.message})
    }

    try {
        usuarioConfirmar.confirmado = true
        usuarioConfirmar.token = ""
        await usuarioConfirmar.save()
        res.json({msg: "Usuario confirmado correctamente"})
        
    } catch (error) {
        console.log(error)
    }
}
~~~

- No hay forma de revertir esta cadena hasheada del password
- Si alguien quiere cambiar el password se le envía un nuevo token de comprobación para poder redefinir el password
-------

## Resetear password

- Defino una nueva ruta POST, porque el usuario va a enviar su email

> router.post('/olvide-password', usuarioController.olvidePassword)

- En usuario.controller compruebo que el email exista, que la cuenta esté confirmada
- Genero un nuevo token con la funcion generarId
- Más adelante este token se enviará por email dónde se entregará un link para resetear el password

~~~js
const olvidePassword = async (req,res)=>{

    const {email} = req.body

    const usuario = await Usuario.findOne({email})

    if(!usuario){
        const error = new Error("Usuario no encontrado")
        res.status(400).json({msg: error.message})
    }

    try {
        usuario.token = generarId()
        await usuario.save()
        res.json({msg: 'Hemos enviado un email con las instrucciones'})
        
    } catch (error) {
        console.log(error)
    }
}
~~~

- Hay que crear otro endpoint GET olvide-password/:token para validar el token y otro endpoint POST para resetar el password definitivamente
- Hay que identificar que sea un token válido y qué usuario está tratando de cambiar el password

> router.get('/olvide-password/:token', usuarioController.comprobarToken)

- usuario.controller

~~~js
const comprobarToken = async (req,res)=>{
    const {token} = req.params

    const tokenValido = await Usuario.findOne({token})

    if(!tokenValido){
        const error = new Error("Token no válido")
        res.status(400).json({msg: error.message})
    }
    
    res.json({msg: "Token válido, usuario existe"})
}
~~~

- Una vez validado el token vamos a enviar un formulario para resetear password
- Para almacenar el nuevo password una vez pasó la validación creo un nuevo endpoint POST
- En usuario.routes

> router.post('/nuevo-password/:token', usuarioController.nuevoPassword)

- Puedo usar router.route para agrupar mismos endpoints con diferente verbo http

~~~js
router.route('/:id')
        .get(usuarioController.getUsuario)
        .put(usuarioController.putUsuario)
        .delete(usuarioController.deleteUsuario)
~~~

- El archivo usuario.routes queda de la siguiente forma

~~~js
import { Router } from "express";
import usuarioController from "../controllers/usuario.controller.js";
import  checkAuth from "../middlewares/checkAuth.middleware.js";
import { comprobarIdMongo } from "../middlewares/comprobarIdMongo.middleware.js";

const router = Router()

router.put('/:id', comprobarIdMongo, usuarioController.putUsuario)
router.delete('/:id', comprobarIdMongo, usuarioController.deleteUsuario)


router.get('/confirmar/:token', usuarioController.confirmarCuenta)
router.get('/olvide-password/:token', usuarioController.comprobarToken)
router.get('/perfil', checkAuth, usuarioController.obtenerPerfil)

router.post('/', usuarioController.postUsuario)
router.post('/login', usuarioController.login)
router.post('/olvide-password', usuarioController.olvidePassword)
router.post('/nuevo-password/:token', usuarioController.nuevoPassword)


export default router
~~~

- En usuario.controller para validar el token es el mismo código que el anterior

~~~js
const nuevoPassword = async(req,res)=>{
    const {token} = req.params
    const {password} = req.body

    const usuario = await Usuario.findOne({token})

    if(!usuario){
        const error = new Error("Token no válido")
        res.status(400).json({msg: error.message})
    }

    try {
        usuario.password = password
        usuario.token = ""
        await usuario.save()
        res.json({msg: "Password modificado correctamente"})
        
    } catch (error) {
        console.log(error)
    }
}
~~~
-----

## Custom middleware de autenticación

- Creo la carpeta middlewares/checkAuth.middleware.js
- Creo un endpoint al que vamos a pasarle el JWT y me retorne el perfil del usuario

> router.get('/perfil', checkAuth, usuarioController.obtenerPerfil)

- Con checkAuth voy a proteger el endpoint, que el JWT sea válido, etc
- En la petición los headers es lo que se envía primero
- Para saber que hay en los headers de autorización puedo hacer un console.log de **req.headers.authorization**
- La forma más común es Bearer Token

~~~js
const checkAuth = (req,res,next)=>{

    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization
            console.log(token)
        } catch (error) {
            console.log(error)
        }
    }

    next()
}
export default checkAuth
~~~

- Para enviar el JWT en los headers, con ThunderClient uso Auth / Bearer
- Hago un Login para obtener el JWT y lo añado en Auth / Bearer 
- Con este código puedo ver que me imprime en consola Bearer (espacio) y el jwt kjhw9b37bcw7rytr8074wfr6b4wry7...
- Uso .split para dividir por el espacio en blanco y me quedo con la segunda posición que es el jwt

~~~js
token = req.headers.authorization.split(" ")[1]
~~~

- El token esta codificado, vamos a descifrarlo para obtener el id del usuario
- Le paso en la req.usuario el usuario que he encontrado a través del id de jwt

~~~js
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.model.js'

const checkAuth = async (req,res,next)=>{
    
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.usuario= await Usuario.findById(decoded.id)

            console.log(req.usuario)

        } catch (error) {
            return res.status(404).json({msg:"Hubo un error"})
        }
    }

    next()
}

export default checkAuth
~~~
- Para que no me devuelva el password en la respuesta uso .select. Quito también otros campos

~~~js
req.usuario= await Usuario.findById(decoded.id)
                          .select("-password -confirmado -token -updatedAt -createdAt -__v")
~~~

## NOTA: si dudas si es decoded.id o decoded._id haz un console.log de decoded y lo ves en el objeto

- Por último, si no me han enviado o no encuentra el token devuelvo un error
- Después de una consulta es recomendable poner un return para que no continúe con el código

~~~js
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.model.js'

const checkAuth = async (req,res,next)=>{

    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.usuario= await Usuario.findById(decoded.id)
                                      .select("-password -confirmado -token -updatedAt -createdAt -__v")

            console.log(req.usuario)
            
           return next()
        } catch (error) {
            return res.status(404).json({msg:"Hubo un error"})
        }
    }

    if(!token){
        const error = new Error("Token no válido")
        return res.status(401).json({msg: error.message})
    }

    next()
}

export default checkAuth
~~~

- Ahora puedo extraer el usuario de la Request desde el controlador

~~~js
const obtenerPerfil = (req,res)=>{
    const {usuario} = req

    res.json(usuario)
}
~~~

- Volveremos a usuarios.route para integrar usuarios como colaboradores de un proyecto, pero de momento esto es todo
------

## Modelo Proyecto

- Creo la relación con la tabla Usuario (el mismo nombre que le puse en el string en .model del schema)
- Colaboradores es un array de Usuarios

~~~js
import mongoose from 'mongoose'


const proyectoSchema = mongoose.Schema({

    nombre:{
        type: String,
        trime: true,
        required: true
    },
    descripcion: {
        type: String,
        trime: true,
        required: true
    },
    fechaEntrega:{
        type: Date,
        default: Date.now()
    },
    cliente:{
        type: String,
        trime: true,
        required: true
    },
    creador:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    colaboradores:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }]
},{
    timestamps: true
})

const Proyecto = mongoose.model("Proyecto", proyectoSchema)
export default Proyecto
~~~

- Creo el controlador
- proyecto.controller

~~~js

const obtenerProyectos = (req,res)=>{
    console.log('GET proyectos')
}

const obtenerProyecto = (req,res)=>{
    console.log('GET proyecto')
}

const crearProyecto = (req,res)=>{
    console.log('POST proyecto')
}

const editarProyecto = (req,res)=>{
    console.log('PUT proyecto')
}

const eliminarProyecto = (req,res)=>{
    console.log('DELETE proyecto')
}

const agregarColaborador = (req,res)=>{
    console.log('Agregar colaborador')
}

const eliminarColaborador = (req,res)=>{
    console.log('Eliminar colaborador')
}


export default{
    obtenerProyectos,
    obtenerProyecto,
    crearProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador
}
~~~

- Vamos con el router
- Hago uso del router en app.js. Como lo exporto por defecto puedo renombrarlo como quiera

> app.use('/api/proyectos', proyectoRoutes)

- proyecto.routes

~~~js
import {Router} from 'express'
import proyectoController from '../controllers/proyecto.controller.js'
import checkAuth from '../middlewares/checkAuth.middleware.js'

const router = Router()


router.get('/', checkAuth, proyectoController.obtenerProyectos)
router.get('/:id', checkAuth, proyectoController.obtenerProyecto)
router.post('/', checkAuth, proyectoController.crearProyecto)
router.put('/:id', checkAuth, proyectoController.editarProyecto)
router.delete('/:id', checkAuth, proyectoController.eliminarProyecto)
router.post('/agregar-colaborador/:id', checkAuth, proyectoController.agregarColaborador)
router.post('/eliminar-colaborador/:id', checkAuth, proyectoController.eliminarColaborador)

export default router
~~~

- Para crear un proyecto
- Devuelvo el proyecto salvado al frontend porque lo vamos a sincronizar con el state
- proyecto.controller

~~~js
const crearProyecto = async (req,res)=>{
     const proyecto = new Proyecto(req.body)
     proyecto.creador = req.usuario._id

     try {
       const proyectoAlmacenado= await proyecto.save()
       res.json(proyectoAlmacenado)
     } catch (error) {
        console.log(error)
     }
}
~~~

- obtenerProyectos me debe mostrar solo los proyectos creados por la persona que ha iniciado sesión
- Hago uso de mongoose para hacer un query un poco más complejo
- Mongoose permite hacer comparaciones con objetos completos. Automáticamente extraerá el _id y lo buscará en la db
- usuario.controller.js

~~~js
const obtenerProyectos = async (req,res)=>{
    const proyectos = await Proyecto.find().where("creador").equals(req.usuario)
    res.json(proyectos)
}
~~~

- Para obtener y validar un proyecto por su ID
- Si quiero comparar id's debo parsearlos a strings

~~~js
const obtenerProyecto = async (req,res)=>{
    const {id} = req.params

    const {usuario} = req

    const proyecto = await Proyecto.findById(id)

    if(!proyecto){
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== usuario._id.toString()){
        const error = new Error("Acción no válida")
        return res.status(403).json({msg: error.message})
    }

    res.json(proyecto)
}
~~~

- Creo un middleware para validar el id de mongo

~~~js
export const comprobarIdMongo = (req, res, next)=>{
    const {id} = req.params
    const _id = id.trim()

    if(!_id.match(/^[0-9a-fA-F]{24}$/)){
        const error = new Error("MongoId no válido")
        return res.status(401).json({msg: error.message})
    }
    next()
}
~~~

- Se lo agrego a las rutas que requieren id en proyecto.routes 
- Para editar un proyecto tengo las mismas medidas de seguridad que en obtener proyecto
- Para actualizar el proyecto uso findByIdAndUpdate
~~~js
const editarProyecto = async (req,res)=>{
    const {id} = req.params

    const {usuario} = req

    const proyecto = await Proyecto.findById(id)

    if(!proyecto){
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== usuario._id.toString()){
        const error = new Error("Acción no válida")
        return res.status(403).json({msg: error.message})
    }

    try {
        const proyectoActualizado = await Proyecto.findByIdAndUpdate(id, req.body, {new: true})
        return res.json(proyectoActualizado)
        
    } catch (error) {
        console.log(error)
    }

}
~~~

- Para eliminar vuelvo a tener el mismo código
- Uso .delete para borrar
~~~js
const eliminarProyecto = async(req,res)=>{
    const {id} = req.params

    const {usuario} = req

    const proyecto = await Proyecto.findById(id)

    if(!proyecto){
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== usuario._id.toString()){
        const error = new Error("Acción no válida")
        return res.status(403).json({msg: error.message})
    }

    try {
        await proyecto.deleteOne()
        return res.status(200).json({msg: "Proyecto eliminado correctamente!"})
    } catch (error) {
        console.log(error)
    }
}
~~~

## Modelo de Tareas

- En prioridad solo voy a aceptar los valores del enum
- Lo asocio al proyecto con mongoose.Schema.Types.ObjectId, le paso en la ref el nombre del modelo

~~~js
import mongoose from 'mongoose'

const tareaSchema = mongoose.Schema({

  nombre:{
    type: String,
    trim: true,
    required: true
  },
  descripcion: {
    type: String,
    trim: true,
    required: true
  },
  estado:{
    type: Boolean,
    default: false
  },
  fechaDeEntrega: {
    type: Date,
    required: true,
    default: Date.now()
  },
  prioridad:{
    type: String,
    required: true,
    enum: ['Baja', 'Media', 'Alta']
  },
  proyecto:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proyecto"
  }

    
}, {
    timestamps: true
})

const Tarea = mongoose.model("Tarea", tareaSchema)

export default Tarea
~~~

- Creo el enrutado y el controlador. Agrego el router a app.js
- tarea.routes

~~~js
import {Router} from 'express'
import tareaController from '../controllers/tarea.controller.js'
import checkAuth from '../middlewares/checkAuth.middleware.js'
import { comprobarIdMongo } from '../middlewares/comprobarIdMongo.middleware.js'

const router = Router()

router.route("/:id")
        .get(checkAuth, comprobarIdMongo, tareaController.getTarea)
        .put(checkAuth, comprobarIdMongo, tareaController.editarTarea)
        .delete(checkAuth, comprobarIdMongo, tareaController.editarTarea)
        
router.post("/", checkAuth, tareaController.crearTarea)
router.post("/estado/:id", checkAuth, comprobarIdMongo, tareaController.cambiarEstado)

export default router
~~~

- tarea.controller.js

~~~js

const getTarea = (req,res)=>{
    console.log("GET tarea")
}

const crearTarea = (req,res)=>{
    console.log("POST tarea")
}

const editarTarea = (req,res)=>{
    console.log("PUT tarea")
}

const eliminarTarea = (req,res)=>{
    console.log("DELETE tarea")
}

const cambiarEstado = (req,res)=>{
    console.log("cambiar estado")
}

export default{
    getTarea,
    crearTarea,
    editarTarea,
    eliminarTarea,
    cambiarEstado
}
~~~

- En app.js importo el router. Lo renombro como quiera porque lo exporto por default

> app.use('/api/tareas', tareaRoutes)

- Para agregar tareas apunto con POST a http://localhost:3000/api/tareas 
- En ThunderClient le paso el jwt en Auth / Bearer y en el body el objeto que cumpla con el modelo Tarea

~~~json
{
  "nombre": "elegir colores",
  "descripcion": "elegir colores para el proyecto",
  "prioridad": "Media",
  "proyecto": "64db1c41fa5bf8c889ca8adb"
}
~~~

- Voy al controlador

~~~js
const crearTarea = async (req,res)=>{
    const {proyecto}= req.body

    const existeProyecto = await Proyecto.findById(proyecto)

    //compruebo que el proyecto existe
    if(!proyecto){
        const error = new Error("El proyecto no existe")
        return res.status(404).json({msg: error.message})
    }   

    //compruebo que quien crea la tarea es el mismo que creó el proyecto
    if(req.usuario._id.toString() !== existeProyecto.creador.toString()){
        const error = new Error("No tienes los permisos necesarios")
        return res.status(403).json({msg: error.message})
    }

    try {
            //puedo usar new Tarea o Tarea.create
        const tareaAlmacenada = await Tarea.create(req.body)
        return res.status(200).json(tareaAlmacenada)
        
    } catch (error) {
     console.log(error)   
    }
}
~~~

- Más adelante vamos a implementar que las personas que están como colaboradoras SI puedan cambiar EL ESTADO de las tareas
- Para obtener una tarea requiero un id
- La manera menos eficiente de saber el creador del proyecto sería desestructurando proyecto de tarea y buscando en la db
- Pero puedo usar el **populate** para que también me devuelva la info de proyecto

~~~js
const getTarea = async (req,res)=>{
    const {id} = req.params

    const tarea =  await Tarea.findById(id).populate("proyecto")

    if(!tarea){
        const error = new Error("No se encontró la tarea")
        return res.status(404).json({msg: error.message})
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Acción no válida")
        return res.status(403).json({msg: error.message})
    }

   return res.status(200).json(tarea)
}
~~~

- Para actualizar tarea son las mismas comprobaciones

~~~js
const editarTarea = async (req,res)=>{
    const {id} = req.params

    const tarea =  await Tarea.findById(id).populate("proyecto")

    if(!tarea){
        const error = new Error("No se encontró la tarea")
        return res.status(404).json({msg: error.message})
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Acción no válida")
        return res.status(403).json({msg: error.message})
    }

    try {
       const tareaActualizada =  await Tarea.findByIdAndUpdate(id, req.body, {new: true})
        return res.status(200).json(tareaActualizada)
    } catch (error) {
        console.log(error)
    }
}
~~~

- Para eliminar

~~~js
const eliminarTarea = async (req,res)=>{
    const {id} = req.params

    const tarea =  await Tarea.findById(id).populate("proyecto")

    if(!tarea){
        const error = new Error("No se encontró la tarea")
        return res.status(404).json({msg: error.message})
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Acción no válida")
        return res.status(403).json({msg: error.message})
    }

    try {
       await tarea.deleteOne()
        return res.status(200).json({msg: "Tarea eliminada correctamente!"})
    } catch (error) {
        console.log(error)
    }
}
~~~

- Para obtener tareas lo voy a hacer desde proyecto.controller pero bien se podría hacer desde tarea.controller
- Una manera sería esta apuntando a http://localhost:3000/api/proyectos/tareas/64db1c41fa5bf8c889ca8adb

~~~js
const obtenerTareas = async (req,res)=>{
    const {id} = req.params

    const existeProyecto = await Proyecto.findById(id)

    if(!existeProyecto){
        const error = new Error("El proyecto no existe")
        return res.status(404).json({msg: error.message})
    }

    const tareas = await Tarea.find().where('proyecto').equals(id)

    res.json(tareas)
}
~~~

- Para obtener todas las tareas de un proyecto por su id, para cuando esté en el frontend me aparezcan al clicar en un proyecto
- Para agregar las tareas a proyecto con proyecto.tareas no me va a funcionar porque es un objeto inmutable
- Puedo devolverlo en un mismo objeto

~~~js
const obtenerProyecto = async (req,res)=>{
    const {id} = req.params

    const {usuario} = req

    const proyecto = await Proyecto.findById(id)

    if(!proyecto){
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== usuario._id.toString()){
        const error = new Error("Acción no válida")
        return res.status(403).json({msg: error.message})
    }

    const tareas = await Tarea.find().where('proyecto').equals(proyecto._id)

    return res.status(200).json({proyecto, tareas})
}
~~~

- Elimino obtenerTareas
- Faltan algunas cosas relacionadas con el backend, sobretodo con colaboradores
- En Proyecto tengo un arreglo de colaboradores. Va a almacenar el id de cada colaborador, y despues con un populate podemos llenar toda esa información
- Si agregara un arreglo de tareas, en createTarea, antes de almacenar la nueva tarea debería agregar el modelo de Proyecto e ir almacenando el id para que el populate funcione
- También hay otras cosas como que voy a enviar un email de confirmación cuando cree un usuario.
- Entonces, el backend no está 100% finalizado, pero se queda así por ahora.
