import { Router } from "express";
import productsController from "../controllers/products.controller";

export class ProductsRoutes{

    private router : Router

    constructor(){
        this.router = Router()
    }


    public routes(): Router{

        this.router.post('/create-product', productsController.createProduct)
        this.router.put('/update-product/:id', productsController.updateProduct)
        this.router.get('/get-product/:id', productsController.getProduct)
        this.router.get('/get-products', productsController.getProducts)
        this.router.delete('/delete-product', productsController.deleteProduct)



        return this.router
    }

}

export const productsRoutes: ProductsRoutes = new ProductsRoutes()