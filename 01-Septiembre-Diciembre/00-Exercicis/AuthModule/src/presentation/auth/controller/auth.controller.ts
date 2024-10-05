import { Request, Response } from "express"

export class AuthController{
    constructor(){

    }
    registerUser =(req:Request, res: Response)=>{
        res.json({msg: 'register user'})
    }

    loginUser = (req:Request, res: Response)=>{
        res.json({msg: "login user"})
    }

    validateEmail=(req:Request, res: Response)=>{
        res.json({msg: "validate-email"})
    }
}