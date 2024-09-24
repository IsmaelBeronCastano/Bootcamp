import { Request, Response } from "express"
import { productsService } from "../service/products.service"


export const createProduct= async (req: Request, res: Response): Promise<void>=>{

    const {name, price, quantity, avaliable} = req.body
    const response = await productsService.createProduct({name, price, quantity, avaliable})
   
    res.status(200).json({
        message: response.data.message,
        product: response.data.product
    })
    
}

export const updateProduct= async (req: Request, res: Response): Promise<void>=>{
    const {id} = req.params
    const {name, price, quantity, avaliable} = req.body
    const response = await productsService.updateProduct(id, {name, price, quantity, avaliable})
    res.status(200).json({
        message: response.data.message,
        product: response.data.product
    })
    
}

export const getProduct= async (req: Request, res: Response)=>{
    const {id} = req.params
    const response = await productsService.getProduct(id)
    res.status(200).json({
        message: response.data.message,
        product: response.data.product
    })
    
}

export const getProducts= async (_: Request, res: Response)=>{
    const response = await productsService.getProducts()
    
    res.status(200).json({
        message: response.data.message,
        product: response.data.product
    })
    
}

export const deleteProduct= async(req: Request, res: Response)=>{
    const {id} = req.params

    const response = await productsService.deleteProduct(id)
    res.status(200).json({
        message: response.data.message,
        product: response.data.product
    })
    
}

export default {
    createProduct,
    updateProduct,
    getProduct,
    getProducts,
    deleteProduct
}