import jwt from 'jsonwebtoken'
import Usuario from '../models/usuario.js'

const validarJWT = async (req, res, next) =>{
    const token = req.header('x-token')

    if(!token)
     return res.status(401).json({msg: "No hay token en la petición"})

    try {
        //verifico el jwt y extraigo el uid
        const {uid} = jwt.verify(token, process.env.SECRET_KEY)

        //creo una propiedad nueva dentro de la request para pasar el uid
        const usuario = await Usuario.findById(uid)

        //verificar que venga usuario por el uid
        if(!usuario) return res.status(401).json({msg:"Token no válido - usuario no existe en BD"}) 

        //verificar si el usuario tiene estado en true
        if(!usuario.estado) return res.status(401).json({msg:"Token no válido - usuario con estado false"})

       req.usuario = usuario
        next()
        
    } catch (error) {
        console.log(error)
        return res.status(401).json({msg:"Token no válido"})        
    }
    

}

export default validarJWT