import { Router } from 'express';
import { CategoryController } from './controller';
import { getEnabledCategories } from 'trace_events';


export class CategoryRoutes {


  static get routes(): Router {
    const categoryController = new CategoryController()
    const router = Router();
    
    router.get('/', categoryController.getCategories)
    router.post('/', categoryController.createCategory)



    return router;
  }


}

