import Usuario from '../models/usuario.js'
import bcryptjs from 'bcryptjs'

const usuariosGet = async (req,res) =>{
   const {limite= 5, desde = 0} = req.query
    
    const [total, usuarios]= await Promise.all([  // va a ejecutar ambas de manera simultanea y no va a continuar hasta que ambas resuelvan
        Usuario.countDocuments({estado: true}), // si una de las dos falla, todo falla
        Usuario.find({estado: true})
        .skip(desde)
        .limit(+limite)
    ])

   res.json({
    total, usuarios
   })
}

const usuariosPost = async (req,res) => {
    
    //recoger errores del express validator

    const {nombre, correo, password, rol}= req.body
    const usuario = new Usuario({nombre, correo, password, rol})


    const salt = bcryptjs.genSaltSync() // tiene el valor 10 por defecto
    usuario.password = bcryptjs.hashSync(password, salt)

    await usuario.save()

    res.json(usuario) 

}

const usuariosPatch = (req,res) =>{

}
const usuariosPut = async (req,res) =>{
    const {id}= req.params
    const {_id, password, google,correo, ...resto} = req.body //extraigo el viejo password y lo añado con resto.password en caso de que venga
    
    
    if(password){ // si viene el password tengo que volver a encriptarlo
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync(password, salt)
    }
    
    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true}) // le paso resto como valor a actualizar

    res.status(200).json({
        usuario
    })

}

const usuariosDelete =  async (req,res) =>{
   const {id} = req.params
   const usuarioAutenticado = req.usuario

    const usuario= await Usuario.findByIdAndUpdate(id, {estado:false}) //si quisiera borrarlo fisicamente usaría finsByIdAndDelete(id)

   res.json({
        usuario
    })

} 


export default {
    usuariosGet,
    usuariosPost,
    usuariosPatch,
    usuariosDelete,
    usuariosPut
}