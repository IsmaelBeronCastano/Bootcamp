import { Router } from 'express';
import { EventBrokerController } from '../controllers/event-broker.controller';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    router.post('/events', EventBrokerController.getAll)



    return router;
  }


}

