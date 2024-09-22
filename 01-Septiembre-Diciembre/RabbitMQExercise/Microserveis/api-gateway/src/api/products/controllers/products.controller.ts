import { Request, Response } from "express"


export const createProduct= ()=>{

    
    
}
export const updateProduct= ()=>{

    return 'UPDATE method'
}
export const getProduct= ()=>{

    return 'GET method'
}
export const getProducts= (_: Request, res: Response)=>{

    

    res.status(200).json({
        message: "OK!!"
    })

    
}
export const deleteProduct= ()=>{

    return 'DELETE method'
}

export default {
    createProduct,
    updateProduct,
    getProduct,
    getProducts,
    deleteProduct
}