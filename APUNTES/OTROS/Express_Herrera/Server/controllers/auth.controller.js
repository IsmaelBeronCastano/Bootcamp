import generarJWT from '../helpers/generarJWT.js';
import googleVerify from '../helpers/google-verify.js';
import Usuario from '../models/usuario.js'
import bcryptjs from 'bcryptjs'

const LoginController=async (req, res)=>{
    const {correo, password} = req.body

    try {
       const usuario = await Usuario.findOne({correo});

       if(!usuario) return res.status(400).json({msg: "Usuario / Password no son correctos -  correo"})
       
       if(usuario.estado === false) return res.status(400).json({msg: "Usuario / Password no son correctos - estado"})

       const validPassword = bcryptjs.compareSync(password, usuario.password)  //true o false

       if(!validPassword) return res.status(400).json({msg: "Usuario / Password no son correctos - password"})

       const token = await generarJWT(usuario.id)

       res.status(200).json({msg: "login ok", token})

    } catch (error) {
        
        console.log(error)
        res.status(400).json({
            msg: "Hable con el administrador"
        })
    }


}

const loginGoogle = async (req, res)=>{
    const {googleToken} = req.body

    try {

        const {nombre, img, correo} = await googleVerify(googleToken)
        //console.log(googleUser) //recibo nombre, img y correo

        let usuario = await Usuario.findOne({correo})

        if(!usuario){
            const data ={
                nombre,
                img,
                correo,
                password: ':P',  //Hay que mandar el password porque es obligatorio.
                google: true
            }
            usuario = new Usuario(data)
            await usuario.save()
        }

        //Si el usuario en DB tiene el estado en false voy a negar su autenticación

        if(!usuario.estado) return res.status(401).json({msg: "Hable con el administrador. Usuario bloqueado"})

        //genero el jwt

        const token = await generarJWT(usuario.id)

        res.json({
            msg: "Todo bien!",
            usuario,
            token
        })

        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: "El token no se pudo verificar"
        })
    }

}



export default{
    LoginController,
    loginGoogle
}