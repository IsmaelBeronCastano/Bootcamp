import { NextFunction, Request, Response } from "express";

export class ValidTypesMiddleware{
    static validTypes= (req: Request, res: Response, next: NextFunction)=>{
        const type= req.params.type
        const validTypes=['users', 'products', 'categories']

        if(!validTypes.includes(type)){
            return res.status(400).json({error: 'Invalid type'})
        }
        next()

    }

    static validTypesDinamic= (validTypes: string[])=> (req: Request, res: Response, next: NextFunction)=>{
        const type= req.url.split('/')[2] ?? ""

        if(!validTypes.includes(type)){
            return res.status(400).json({error: 'Invalid type'})
        }
        next()

    }
}