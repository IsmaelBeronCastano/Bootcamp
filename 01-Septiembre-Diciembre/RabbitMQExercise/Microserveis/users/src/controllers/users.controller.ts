import { Request, Response } from "express"


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
export const createUser=(_:Request, res: Response)=>{
res.status(200).json({
    message: 'METHOD POST'
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
