import { Request, Response } from "express";

export class ProductsController{

    constructor(){}

    public getAllProducts = async(req:Request,res:Response)=>{
        return res.status(200).json({
            message: "OK",
            data:{
                products:{
                    name: "Toyota",
                    price: 2000,
                    quantity: 1
                }
            }
        })
    }
}