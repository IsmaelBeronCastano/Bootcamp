import {Request, Response} from 'express'

const getUser =(_:Request, res: Response)=>{
    
res.status(200).json({
    message: "METHOD GET OK"
})    
}
const createUser =(_:Request, res: Response)=>{
    
res.status(200).json({
    message: "METHOD POST OK"
})    
}
const updateUser =(_:Request, res: Response)=>{
    
res.status(200).json({
    message: "METHOD PUT OK"
})    
}
const deleteUser =(_:Request, res: Response)=>{
    
res.status(200).json({
    message: "METHOD DELETE OK"
})    
}

export default {
    getUser,
    createUser,
    updateUser,
    deleteUser
}
