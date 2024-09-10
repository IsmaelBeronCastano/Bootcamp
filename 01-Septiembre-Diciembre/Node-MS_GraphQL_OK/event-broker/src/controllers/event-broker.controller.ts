import { Request, Response } from "express";
import { getAllProducts } from "./products.controller";
import { ProductsEvent } from "../enums/products.enum";
import { UserEvent } from "../enums/users.enum";
import { getAllUsers } from "./users.controller";

export class EventBrokerController {

    constructor(){}

    static async getAll(req: Request, res: Response){
        
        const {event, data}= req.body



        if(event === ProductsEvent.GET_PRODUCTS){
            
                const products = await getAllProducts()
                return res.status(200).json({
                    products
                })
                
            }

        if(event === UserEvent.GET_USERS){
            const users = await getAllUsers()

            return res.status(200).json({
                users
            })

        }
        res.status(500).json({
            message: "Internal Server Error - users"
        })
   }
}