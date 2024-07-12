import jwt from 'jsonwebtoken'



const generarJWT = (uid="")=>{
    //podría ser async pero como trabaja con callbacks voy a tener que generar la promesa manualmente
    return new Promise((resolve,reject)=>{
        const payload = {uid} //voy a grabar el uid en el jwt

        //le paso el payload, la clave secreta, las opciones y el callback donde está el token que voy a tener que resolver
        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '4h'  //quiero que solo viva 4 horas
        }, (err, token)=>{
            if(err){
                console.log(err)
                reject('No se pudo generar el jwt')
            }else{
                resolve(token)
            }
        })
    })
}

export default generarJWT