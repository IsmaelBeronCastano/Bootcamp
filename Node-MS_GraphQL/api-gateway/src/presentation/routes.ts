import { Router } from 'express';
import { gatewayController } from '../controllers/gateway.controller';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    router.post('/all', gatewayController.getAll)



    return router;
  }


}

