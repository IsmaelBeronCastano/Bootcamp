import { Router } from 'express';
import { UserController } from '../controllers/user.controller';




export class UserRoutes {



  static get routes(): Router {

    const router = Router();
    const productsController= new UserController()


    router.get('/all', productsController.getAllUsers)

    return router;
  }


}

