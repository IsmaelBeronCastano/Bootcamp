import {Request, Response } from "express"
import Usuario from "../models/usuario"

export const getUsuarios = async ( req: Request, res: Response)=>{
    const {headers} = req.headers

    const usuarios = await  Usuario.findAll()

    res.json({
        usuarios,
        headers
    })
}

export const getUsuario = async (req: Request, res: Response)=>{

    const {id}= req.params

    const usuario = await Usuario.findByPk(id)

    if(!usuario){
        res.status(404).json({
            msg: `No existe un usuario con el id ${id}`
        })
        
    }else{
        res.json({
            msg: 'GET USUARIO',
            usuario
        })
    }
   
}

export const createUsuario = async (req: Request,res: Response)=>{

    try {
        const {body} = req

        const existeEmail = await Usuario.findOne({
            where:{
                email: body.email
            }
        })

        if(existeEmail){
           return res.status(400).json({
                msg: `El email ${body.email} ya está registrado`
            })
        }

        const usuario = await Usuario.create(body)

        usuario.save()
        
    } catch (error: any) {
        throw new Error(error)
    }
    
    res.json({
        msg: 'POST USUARIO'
    })
}


export const updateUsuario = async (req:Request, res: Response)=>{
  
    try {
        const {body} = req
        const {id} = req.params

        const usuario = await Usuario.findByPk(id)

        if(!usuario){
           return res.status(404).json({
                msg: `El usuario con id ${id} no existe`
            })
        }        

        await Usuario.update(body,{
            where:{
                id
            }
        })
        res.json({
            usuario
        })
    } catch (error: any) {
        throw new Error(error)
    }
}


export const deleteUsuario = async (req: Request, res: Response)=>{
  
    const {id} = req.params

    const usuario = await Usuario.findByPk(id)

    if(!usuario) return res.status(404).json({
        msg: `Usuario con id ${id} no encontrado`
    })
    
    //await usuario.destroy()    borrado fisico
    
    //borrado lógico

    await usuario.update({estado: 0})
    
    res.json({
        msg: 'DELETE USUARIO'
    })
}