


export const esAdminRole = (req, res, next) =>{
    
    if(!req.usuario) return res.status(500).json({msg: "Se quiere validar el role sin obtener el token"})
    
    const {rol, nombre} = req.usuario

    if(rol !== 'ADMIN_ROLE') return res.status(401).json({msg: `${nombre} no es administrador`})
    next()
}

const tieneRole = (...roles)=>{
   
    return (req,res,next)=>{
        if(!req.usuario) return res.status(500).json({msg: "Se quiere validar el role sin obtener el token"})

        const {rol} = req.usuario
        if(!roles.includes(rol)) return res.status(401).json({msg: `El servicio requiere uno de estos roles ${roles}`})
        next()
    }

}

export default tieneRole