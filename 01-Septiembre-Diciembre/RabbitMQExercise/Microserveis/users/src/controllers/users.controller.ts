import { Request, Response } from "express"
import {createUserService} from '../service/user.service'
import { IUser } from "@users/interfaces/user.interface"


export const getUser=(_:Request, res: Response)=>{
res.status(200).json({
    message: 'METHOD GET'
})
}
export const getUsers=(_:Request, res: Response)=>{
res.status(200).json({
    message: 'METHOD GET'
})
}
const createUser=async (req:Request, res: Response)=>{
   const {name,email,password} = req.body
    const user: IUser | null = await createUserService({name, email, password})
    res.status(200).json({
        message: 'user created!',
        user
    })
}
export const updateUser=(_:Request, res: Response)=>{
res.status(200).json({
    message: 'METHOD UPDATE'
})
}
export const deleteUser=(_:Request, res: Response)=>{
res.status(200).json({
    message: 'METHOD DELETE'
})
}

export default {
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser
}
