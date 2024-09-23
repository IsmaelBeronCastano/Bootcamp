import { Request, Response } from "express"

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
export const createProduct=(_:Request, res: Response)=>{
    
    res.status(200).json({
        message: "method POST"
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