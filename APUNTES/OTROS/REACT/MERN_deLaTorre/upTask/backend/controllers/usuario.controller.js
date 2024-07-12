import Usuario from '../models/Usuario.model.js'
import { generarId } from '../helpers/generar-id.js'
import { generarJWT } from '../helpers/generarJWT.js'
import { emailOlvidePassword, emailRegistro } from '../helpers/emails.js'

const postUsuario = async (req,res)=>{
    const {email} = req.body
    const existeUsuario = await Usuario.findOne({email})

    if(existeUsuario){
        const error = new Error("Usuario ya registrado")

        return res.status(400).json({msg: error.message})
    }

    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId() 
        await usuario.save()

        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        
        res.json({msg: "Usuario creado correctamente. revisa tu email"})
        
    } catch (error) {
        console.log(error)
    }
}

const putUsuario = (req,res)=>{
    console.log("POST desde /api/usuarios")
}

const deleteUsuario = (req,res)=>{
    console.log("DELETE desde /api/usuarios")
}


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
            token: generarJWT(usuario._id)
        })
    }else{
        const error = new Error("El password es incorrecto")
        return res.status(403).json({msg: error.message})
    }    
}

const confirmarCuenta = async (req,res)=>{
    const {token} = req.params

    const usuarioConfirmar = await Usuario.findOne({token})

    
    if(!usuarioConfirmar){
        const error = new Error("Token no valido")
        res.status(400).json({msg: error.message})
    }
    
    if(usuarioConfirmar === null) return
    

    try {
        usuarioConfirmar.confirmado = true
        usuarioConfirmar.token = ""
        await usuarioConfirmar.save()
        res.json({msg: "Usuario confirmado correctamente"})

    } catch (error) {
        console.log(error)
    }
}

const olvidePassword = async (req,res)=>{

    const {email} = req.body

    const usuario = await Usuario.findOne({email})

    if(!usuario){
        const error = new Error("Usuario no existe")
        res.status(400).json({msg: error.message})
    }

    try {
        usuario.token = generarId()
        await usuario.save()

        emailOlvidePassword({
            email: email,
            nombre: usuario.nombre,
            token: usuario.token           
        })
        res.json({msg: 'Hemos enviado un email con las instrucciones'})
        
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req,res)=>{
    const {token} = req.params

    const tokenValido = await Usuario.findOne({token})

    if(!tokenValido){
        const error = new Error("Token no válido")
        return res.status(400).json({msg: error.message})
    }

   return res.json({msg: "Token válido, usuario existe"})
}

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

const obtenerPerfil = (req,res)=>{
    const {usuario} = req

    return res.status(200).json(usuario)
}


export default {
    postUsuario,
    putUsuario,
    deleteUsuario,
    login,
    confirmarCuenta,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    obtenerPerfil
}

