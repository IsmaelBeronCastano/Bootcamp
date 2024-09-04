import { Request, Response } from "express";
import { getAllProducts } from "./products.controller";
import { ProductsEvent } from "../enums/products.enum";

export class EventBrokerController {

    constructor(){}

    static async getAll(req: Request, res: Response){
        
        const {event, data}= req.body

        console.log(event)

        if(event === ProductsEvent.GET_PRODUCTS){
            
                const products = await getAllProducts()
                return res.status(200).json({
                    products
                })
                
            }

        res.status(404).json({
            message: "Event not found!"
        })



    }
}