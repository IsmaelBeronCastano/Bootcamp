import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller';




export class ProductRoutes {



  static get routes(): Router {

    const router = Router();
    const productsController= new ProductsController()


    router.get('/all', productsController.getAllProducts)

    return router;
  }


}

