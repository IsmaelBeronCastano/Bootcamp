import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/jwt.adqapter";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain/entities/user/user.entity";

export class AuthMiddleware{
 
    static async validateJWT(req:Request,res:Response,next: NextFunction ){
        const authorization= req.header('Authorization')

        if(!authorization) return res.status(401).json({error:"No token provider"})

        if(!authorization.startsWith('Bearer ')) return res.status(401).json({error: "Invalid Bearer Token"})

        const token = authorization.split(' ').at(1)  || ""//es lo mismo que poner [1]
        
        try {
            const payload = await JwtAdapter.validateToken<{id:string}>(token)
            if(!payload) return res.status(401).json({error: "Invalid Token"})

            const user = await UserModel.findById(payload.id)
            if(!user) return res.status(401).json({error:"Invalid Token- user"})
            
            //todo: validar si el usuario está activo
            req.body.user = UserEntity.fromObject(user)

            next()
            
        } catch (error) {
            res.status(500).json({error:"Internal Server error"})
        }

    }
}