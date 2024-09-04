import { Request, Response } from "express";

export class UserController{

    constructor(){}

    public getAllUsers = async(req:Request,res:Response)=>{
        return res.status(200).json({
            message: "OK",
            data:{
                users:{
                    name: "Peter",
                    email: "peter@gmail.com"
                }
            }
        })
    }
}