import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { CategoryRoutes } from './categories/routes';
import { FileUploadRoutes } from './file-upload/routes';


export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    router.use('/api/auth', AuthRoutes.routes)
    router.use('/api/categories', CategoryRoutes.routes)
    router.use('/api/file-upload', FileUploadRoutes.routes)



    return router;
  }


}

