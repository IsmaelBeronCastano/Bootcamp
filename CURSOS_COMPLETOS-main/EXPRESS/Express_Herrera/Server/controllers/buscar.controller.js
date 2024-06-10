import Usuario from "../models/usuario.js"
import Categoria from "../models/categoria.js"
import Producto from "../models/producto.js"
import mongoose from "mongoose"

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async(termino="", res)=>{

    const esMongoId= mongoose.isValidObjectId(termino) //TRUE
    
    if(esMongoId){
        const usuario = await Usuario.findById(termino)
        return res.json({
            results : usuario ? [usuario]: []
        })
    }

    const regex = new RegExp(termino, 'i') //expresión regular, i de insensitive a minúsculas y mayúsculas

    const usuarios = await Usuario.find({
        //$or es una propiedad de mongo
        $or: [
            {nombre: regex},
            {correo: regex}
        ],

        $and: [{estado:true}]
    })
    res.json({
        results: usuarios
    })

}

const buscar = (req,res)=>{

    const {coleccion, termino} = req.params

    if(!coleccionesPermitidas.includes(coleccion)) return res.status(400).json({msg:"La colección no está en la DB"})


    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)            
            break;
        case 'categorias':
            buscarCategorias(termino, res)
            break;
        case 'productos':
            buscarProductos(termino, res)
            break;
        default:
            res.status(500).json({
                msg:"Se me olvidó hacer esta búsqueda"
            })
            break;
    }
}

const buscarCategorias = async(termino="", res)=>{
    const esMongoId= mongoose.isValidObjectId(termino) //TRUE
    
    if(esMongoId){
        const categoria = await Categoria.findById(termino)
        return res.json({
            results : categoria ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i') //expresión regular, i de insensitive a minúsculas y mayúsculas

    const categorias = await Categoria.find({nombre: regex, estado: true})
    res.json({
        results: categorias
    })

}

const buscarProductos = async(termino="", res)=>{
    const esMongoId= mongoose.isValidObjectId(termino) //TRUE
    
    if(esMongoId){
        const producto = await Producto.findById(termino)
        return res.json({
            results : producto ? [producto]: []
        })
    }

    const regex = new RegExp(termino, 'i') //expresión regular, i de insensitive a minúsculas y mayúsculas

    const productos = await Producto.find({nombre: regex, estado:true })
    res.json({
        results: productos
    })

}


export default{
    buscar
}