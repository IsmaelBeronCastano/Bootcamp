import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/products.controller";

export class ProductsRoutes{

    private router : Router

    constructor(){
        this.router = Router()
    }


    public routes(): Router{

        this.router.post('/create-product', createProduct)
        this.router.put('/update-product/:id',updateProduct)
        this.router.get('/get-product/:id', getProduct)
        this.router.get('/get-products', getProducts)
        this.router.delete('/delete-product', deleteProduct)



        return this.router
    }

}

export const productsRoutes: ProductsRoutes = new ProductsRoutes()