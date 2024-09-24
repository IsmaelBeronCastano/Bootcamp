import { Request, Response } from "express"
import { createProductService } from "../services/products.service"
import { IProduct } from "@users/interfaces/IProduct.interface"

export const getProduct=(_:Request, res: Response)=>{

    
    
    res.status(200).json({
        message: "method GET"
    })
}
export const getProducts=(_:Request, res: Response)=>{
    
    res.status(200).json({
        message: "method GET"
    })
}
export const createProduct= async (req:Request, res: Response)=>{
    const {name, price, quantity, avaliable} = req.body
    const product = await createProductService({name, price, quantity, avaliable} as IProduct)
    res.status(200).json({
        message: "create-product",
        product
    })
}
export const updateProduct=(_:Request, res: Response)=>{
    
    res.status(200).json({
        message: "method PUT"
    })
}
export const deleteProduct=(_:Request, res: Response)=>{
    
    res.status(200).json({
        message: "method DELETE"
    })
}

export default {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
}