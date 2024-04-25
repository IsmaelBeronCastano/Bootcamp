import { Router } from 'express';
import { EmailRoutes } from './email/email.routes';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
   
    router.use('/api/v1', EmailRoutes.routes)



    return router;
  }


}

