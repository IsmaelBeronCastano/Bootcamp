import { Router } from 'express';
import { SalesController } from '../controllers/sales.controller';




export class SalesRoutes {



  static get routes(): Router {

    const router = Router();
    const productsController= new SalesController()


    router.get('/products/todos', productsController.getAllProducts)

    return router;
  }


}

