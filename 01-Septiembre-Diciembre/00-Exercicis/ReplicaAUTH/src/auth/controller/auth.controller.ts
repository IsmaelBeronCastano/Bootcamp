import { Request, Response } from "express";

export class AuthController{
    constructor(){

    }

    login=(req: Request, res: Response)=>{
        res.json({msg: "login"})
    }
    register=(req: Request, res: Response)=>{
        res.json({msg: "register"})
    }
    validateEmail=(req: Request, res: Response)=>{
        res.json({msg: "validateEmail"})
    }
}