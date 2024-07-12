import mongoose from "mongoose"
import Role from "../models/role.js"
import Usuario from "../models/usuario.js"
import Categoria from "../models/categoria.js"
import Producto from "../models/producto.js"

export const esRolValido = async(rol="")=>{      //validación contra la DB
    const existeRol = await Role.findOne({rol})

    if(!existeRol){
        throw new Error("El rol no existe")
    }

}

export const existeMail = async(correo)=>{
    const existeEmail = await Usuario.findOne({correo})

    if(existeEmail){
       throw new Error("El email ya existe")
    }

    return existeMail
}

export const userExistsById = async(id)=>{
    const existeUsuario= await Usuario.findById(id)

    if(!existeUsuario) throw new Error("El id no existe")
    
}

export const existeCategoria = async(id)=>{
    const categoria = await Categoria.findById(id)

    if(!categoria) throw new Error(`El id ${id} no existe`)
}



export const existeProducto = async(id)=>{
    const producto = await Producto.findById(id)

    if(!producto) throw new Error(`El producto con id ${id} no existe`)
}