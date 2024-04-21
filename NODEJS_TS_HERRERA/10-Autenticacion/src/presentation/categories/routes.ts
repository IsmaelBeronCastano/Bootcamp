import { Router } from 'express';
import { CategoryController } from './controller';
import { getEnabledCategories } from 'trace_events';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryService } from '../services/category.service';


export class CategoryRoutes {


  static get routes(): Router {
    
    const categoryController = new CategoryController(new CategoryService())
    const router = Router();
    
    router.get('/', categoryController.getCategories)
    router.post('/', [AuthMiddleware.validateJWT], categoryController.createCategory)



    return router;
  }


}

