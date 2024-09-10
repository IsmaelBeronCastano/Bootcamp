import { Router } from 'express';
import { createSale, getAll } from '../controllers/sales.controller';



export class SalesRoutes {


    static get routes(): Router {

    const router = Router();
 


    router.get('/all', getAll )
    router.post('/create',createSale
    )

    return router;
  }


}

