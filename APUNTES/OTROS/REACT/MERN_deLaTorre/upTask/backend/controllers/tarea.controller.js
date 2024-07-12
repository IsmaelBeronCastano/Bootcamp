import Proyecto from "../models/Proyecto.model.js"
import Tarea from "../models/Tarea.model.js"


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

const crearTarea = async (req,res)=>{
    const {proyecto}= req.body

    const existeProyecto = await Proyecto.findById(proyecto)

    if(!proyecto){
        const error = new Error("El proyecto no existe")
        return res.status(404).json({msg: error.message})
    }   

    
    if(req.usuario._id.toString() !== existeProyecto.creador.toString()){
        const error = new Error("No tienes los permisos necesarios")
        return res.status(403).json({msg: error.message})
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body)
        return res.status(200).json(tareaAlmacenada)
        
    } catch (error) {
     console.log(error)   
    }
}

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
        return res.status(200).json({msg: "Tarea eliminada correctamente"})
    } catch (error) {
        console.log(error)
    }
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